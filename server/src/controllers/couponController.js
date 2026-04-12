import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET /api/coupons - Obtener todos los cupones (Admin)
export const getCoupons = async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(coupons);
    } catch (error) {
        console.error("Error al obtener cupones:", error);
        res.status(500).json({ error: 'Error del servidor al obtener cupones.' });
    }
};

// POST /api/coupons - Crear un cupón (Admin)
export const createCoupon = async (req, res) => {
    try {
        const { code, type, value, minItems, usageLimit, expirationDate, isActive } = req.body;
        
        // Validación básica
        if (!code || !type || value === undefined) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase().trim(),
                type,
                value: parseFloat(value),
                minItems: minItems ? parseInt(minItems) : null,
                usageLimit: usageLimit ? parseInt(usageLimit) : null,
                expirationDate: expirationDate ? new Date(expirationDate) : null,
                isActive: isActive !== undefined ? isActive : true
            }
        });

        res.status(201).json(coupon);
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Ya existe un cupón con ese código' });
        }
        console.error("Error al crear cupón:", error);
        res.status(500).json({ error: 'Error interno del servidor al crear el cupón' });
    }
};

// PUT /api/coupons/:id - Actualizar cupón (Admin)
export const updateCoupon = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { code, type, value, minItems, usageLimit, expirationDate, isActive } = req.body;

        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                code: code ? code.toUpperCase().trim() : undefined,
                type,
                value: value !== undefined ? parseFloat(value) : undefined,
                minItems: minItems !== undefined ? (minItems ? parseInt(minItems) : null) : undefined,
                usageLimit: usageLimit !== undefined ? (usageLimit ? parseInt(usageLimit) : null) : undefined,
                expirationDate: expirationDate !== undefined ? (expirationDate ? new Date(expirationDate) : null) : undefined,
                isActive
            }
        });

        res.json(coupon);
    } catch (error) {
        console.error("Error al actualizar cupón:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// DELETE /api/coupons/:id - Eliminar cupón (Admin)
export const deleteCoupon = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.coupon.delete({ where: { id } });
        res.json({ message: 'Cupón eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar cupón:", error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar el cupón' });
    }
};

// POST /api/coupons/validate - Validar un código de cupón (Público)
export const validateCoupon = async (req, res) => {
    try {
        const { code, totalPhysicalUnits } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'Se requiere un código de cupón' });
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase().trim() }
        });

        if (!coupon) {
            return res.status(404).json({ error: 'Cupón no encontrado' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ error: 'Este cupón está inactivo' });
        }

        // Validación de expiración
        if (coupon.expirationDate && new Date() > new Date(coupon.expirationDate)) {
            return res.status(400).json({ error: 'Este cupón ha expirado' });
        }

        // Validación de límite de uso (-1 o null son infinitos)
        if (coupon.usageLimit !== null && coupon.usageLimit !== -1) {
            if (coupon.usageCount >= coupon.usageLimit) {
                return res.status(400).json({ error: 'Se ha alcanzado el límite de usos para este cupón' });
            }
        }

        // Validación de mínimo de items en el carrito
        if (coupon.minItems && totalPhysicalUnits !== undefined) {
            if (totalPhysicalUnits < coupon.minItems) {
                return res.status(400).json({ error: `Este cupón requiere un mínimo de ${coupon.minItems} productos físicos` });
            }
        }

        // Si pasa todas las validaciones
        res.json({
            id: coupon.id,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            message: 'Cupón válido'
        });

    } catch (error) {
        console.error("Error al validar cupón:", error);
        res.status(500).json({ error: 'Error interno del servidor. Intente realizar la validación nuevamente.' });
    }
};
