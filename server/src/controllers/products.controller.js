import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validación de esquema (Zod)
const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    images: z.array(z.string()).optional(), // Correcto: Array de URLs
    categoryId: z.number().int().optional(),
    paused: z.boolean().optional(),
    materials: z.string().optional(),
    measurements: z.string().optional(),
    customizationOptions: z.object({
        fabricColors: z.array(z.union([
            z.string(),
            z.object({ name: z.string(), hex: z.string().nullable().optional() })
        ])).optional(),
        embroideryColors: z.array(z.union([
            z.string(),
            z.object({ name: z.string(), hex: z.string().nullable().optional() })
        ])).optional(),
        initialsColors: z.array(z.union([
            z.string(),
            z.object({ name: z.string(), hex: z.string().nullable().optional() })
        ])).optional(),
        allowInitials: z.boolean().optional(),
    }).optional(),
});

// GET All (Obtener todos)
export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                orderItems: true,
                category: true // Incluimos la categoría para agrupar en el frontend
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET Single (Obtener uno por ID)
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        // CORRECCIÓN: Convertir ID a Número
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });

        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE (Admin - Crear)
export const createProduct = async (req, res) => {
    try {
        const body = req.body;

        // Convertir strings a números si es necesario
        if (typeof body.price === 'string') body.price = parseFloat(body.price);
        if (typeof body.stock === 'string') body.stock = parseInt(body.stock);
        if (typeof body.categoryId === 'string') body.categoryId = parseInt(body.categoryId);

        const validation = productSchema.safeParse(body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }

        const newProduct = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                price: body.price,
                stock: body.stock,
                // Aquí guardamos el array de imágenes
                images: body.images || [],
                categoryId: body.categoryId || null,
                materials: body.materials || null,
                measurements: body.measurements || null,
                customizationOptions: body.customizationOptions || null,
            }
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

// UPDATE (Admin - Actualizar)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        if (body.price && typeof body.price === 'string') body.price = parseFloat(body.price);
        if (body.stock && typeof body.stock === 'string') body.stock = parseInt(body.stock);
        if (body.categoryId && typeof body.categoryId === 'string') body.categoryId = parseInt(body.categoryId);

        const updateData = {
            name: body.name,
            description: body.description,
            price: body.price,
            stock: body.stock,
            images: body.images,
            categoryId: body.categoryId,
            materials: body.materials,
            measurements: body.measurements,
            customizationOptions: body.customizationOptions,
            paused: body.paused,
            isDigital: body.isDigital
        };

        // Remove undefined fields to avoid overwriting with undefined
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: updateData,
        });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

// DELETE (Admin - Borrar)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error("Delete Product Error:", error);

        // P2003 is Prisma's error code for foreign key constraint violation
        if (error.code === 'P2003') {
            return res.status(400).json({
                error: 'No se puede eliminar un producto con ventas asociadas. Te sugerimos pausar la publicación.'
            });
        }

        res.status(500).json({ error: 'Error al intentar eliminar el producto' });
    }
};
