import prisma from '../utils/prisma.js';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import { sendOrderConfirmation, sendAdminNewOrderNotification } from '../services/emailService.js';
import { getIO } from '../utils/socket.js';

dotenv.config();

// Configurar Mercado Pago
if (!process.env.MP_ACCESS_TOKEN) {
    console.error("CRITICAL: MP_ACCESS_TOKEN is missing in environment variables!");
}
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

// 1. CREAR ORDEN CON TRANSACCIÓN ACID
const createOrderTransaction = async (items, total, type, customerData, extraData = {}) => {
    return await prisma.$transaction(async (tx) => {
        // A. Validar y Decrementar Stock
        for (const item of items) {
            const product = await tx.product.findUnique({ where: { id: item.id } });

            if (!product) {
                throw new Error(`El producto "${item.name}" no existe.`);
            }

            const qty = item.quantity || 1;

            if (product.stock < qty) {
                throw new Error(`Stock insuficiente para: ${item.name} (Disponible: ${product.stock})`);
            }

            await tx.product.update({
                where: { id: item.id },
                data: { stock: { decrement: qty } }
            });
        }

        // B. Crear Orden con Datos de Envío
        const order = await tx.order.create({
            data: {
                totalAmount: total,
                status: 'PENDING',
                paymentMethod: type,
                // Datos de Cliente y Envío
                customerName: customerData.customerName,
                customerEmail: customerData.customerEmail,
                shippingAddress: customerData.shippingAddress,
                shippingCity: customerData.shippingCity,
                postalCode: customerData.shippingZip,
                shippingPhone: customerData.shippingPhone,
                
                // Campos de descuento y envío
                shippingCost: extraData.shippingCost || 0,
                shippingMethod: customerData.shippingMethod || 'N/A',
                shippingType: customerData.shippingType || 'N/A',
                discountAmount: extraData.discountAmount || 0,

                // Relación con Cupones
                coupons: extraData.couponIds ? {
                    connect: extraData.couponIds.map(id => ({ id }))
                } : undefined,

                items: {
                    create: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity || 1,
                        price: item.price,
                        selectedCustomizations: item.selectedCustomizations || null
                    }))
                }
            },
            include: { 
                items: { include: { product: true } },
                coupons: true
            }
        });

        return order;
    });
};

// 2. ENDPOINT: INICIAR PAGO (Preference)
export const createPreference = async (req, res) => {
    try {
        const { items, method, customerData, shippingCost, couponCodes, totalPhysicalUnits } = req.body;

        // Validar datos básicos
        if (!customerData || !customerData.customerEmail || !customerData.shippingAddress) {
            return res.status(400).json({ error: "Faltan datos de envío o contacto." });
        }

        let subtotal = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
        let actualShippingCost = parseFloat(shippingCost) || parseFloat(customerData?.shippingCost) || 0;
        
        // --- PROCESAR CUPONES ---
        let totalDiscount = 0;
        let isFreeShipping = false;
        let appliedCouponIds = [];

        if (couponCodes && Array.isArray(couponCodes) && couponCodes.length > 0) {
            const coupons = await prisma.coupon.findMany({
                where: {
                    code: { in: couponCodes.map(c => c.toUpperCase().trim()) },
                    isActive: true
                }
            });

            for (const coupon of coupons) {
                // Validar expiración
                if (coupon.expirationDate && new Date() > new Date(coupon.expirationDate)) continue;
                
                // Validar límite de uso
                if (coupon.usageLimit !== null && coupon.usageLimit !== -1 && coupon.usageCount >= coupon.usageLimit) continue;

                // Validar mínimo de ítems
                if (coupon.minItems && totalPhysicalUnits < coupon.minItems) continue;

                // Aplicar beneficio
                if (coupon.type === 'PERCENTAGE') {
                    totalDiscount += (subtotal * (coupon.value / 100));
                } else if (coupon.type === 'FIXED') {
                    totalDiscount += coupon.value;
                } else if (coupon.type === 'FREE_SHIPPING') {
                    isFreeShipping = true;
                }
                
                appliedCouponIds.push(coupon.id);

                // Incrementar contador de uso
                await prisma.coupon.update({
                    where: { id: coupon.id },
                    data: { usageCount: { increment: 1 } }
                });
            }
        }

        // Si hay cupón de envío gratis, el costo de envío es 0
        if (isFreeShipping) {
            actualShippingCost = 0;
        }

        // Subtotal después de cupones
        const subtotalAfterCoupons = Math.max(0, subtotal - totalDiscount);
        let total = subtotalAfterCoupons + actualShippingCost;

        // APLICAR DESCUENTO TRANSFERENCIA (10% solo sobre subtotal remanente)
        let transferDiscount = 0;
        if (method === 'transferencia') {
            transferDiscount = subtotalAfterCoupons * 0.10;
            total = subtotalAfterCoupons - transferDiscount + actualShippingCost;
        }

        // --- TRANSACCIÓN ACID (Stock + Orden) ---
        let newOrder;
        try {
            newOrder = await createOrderTransaction(items, total, method.toUpperCase(), customerData, {
                discountAmount: totalDiscount + transferDiscount,
                shippingCost: actualShippingCost,
                couponIds: appliedCouponIds
            });
        } catch (dbError) {
            console.error("Error de Stock/DB:", dbError.message);
            return res.status(400).json({ error: dbError.message });
        }

        // A. CASO TRANSFERENCIA
        if (method === 'transferencia') {
            // Enviar email de confirmación inmediatamente
            await sendOrderConfirmation(newOrder);

            // Notify Admin
            await sendAdminNewOrderNotification(newOrder);

            // Real-time notification
            try {
                getIO().emit('new-order', {
                    id: newOrder.id,
                    total: newOrder.totalAmount,
                    customer: newOrder.customerName,
                    method: 'TRANSFERENCIA'
                });
            } catch (ioErr) {
                console.error("Socket error emitting new-order:", ioErr.message);
            }

            return res.json({
                orderId: newOrder.id,
                message: "Orden creada. Esperando transferencia."
            });
        }

        // B. CASO MERCADO PAGO
        const preference = new Preference(client);

        // Calcular "expiration" para reservar stock solo por un tiempo (Opcional, avanzado)
        // Por ahora, el stock ya se descontó. Si no pagan, habría que reponerlo (webhook failure/pending expiry).
        // Simplificamos asumiendo éxito o webhook de cancelación manual.

        const shippingItem = actualShippingCost > 0 ? {
            title: "Envío a Domicilio",
            quantity: 1,
            unit_price: actualShippingCost,
            currency_id: 'ARS'
        } : null;

        const preferenceItems = items.map(item => ({
            title: item.selectedCustomizations
                ? `${item.name} (${Object.values(item.selectedCustomizations).join(', ')})`
                : item.name,
            quantity: parseInt(item.quantity) || 1,
            unit_price: Math.round(item.price * 100) / 100, // Round to 2 decimals
            currency_id: 'ARS',
            picture_url: item.images?.[0] || ''
        }));

        if (shippingItem) preferenceItems.push(shippingItem);

        const result = await preference.create({
            body: {
                items: preferenceItems,
                payer: {
                    name: customerData.customerName,
                    email: customerData.customerEmail,
                    // Mercado Pago phone object is sensitive. Better to omit if format is unsure or format it correctly.
                    // For now, let's try a safer format or omit it to avoid rejection.
                },
                external_reference: newOrder.id.toString(),
                statement_descriptor: "GAUSTINA",
                back_urls: {
                    success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success`,
                    failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/failure`,
                    pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/pending`
                },
                auto_return: "approved",
                notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payment/webhook`
            }
        });

        res.json({
            id: result.id,
            init_point: result.init_point,
            orderId: newOrder.id
        });

    } catch (error) {
        console.error("Error detallado al crear preferencia:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause,
            response: error.response?.data || error.response || "No response data"
        });
        res.status(500).json({
            error: "Error interno del servidor",
            details: error.message,
            mpError: error.response?.data || null
        });
    }
};

// 3. WEBHOOK
export const handlePaymentWebhook = async (req, res) => {
    const { type, data } = req.body;

    try {
        if (type === 'payment') {
            const paymentId = data.id;

            // Consultar a MP la data real del pago
            const payment = await new Payment(client).get({ id: paymentId });

            if (payment.status === 'approved') {
                const orderId = parseInt(payment.external_reference);

                // Actualizar orden a PAGADO
                const updatedOrder = await prisma.order.update({
                    where: { id: orderId },
                    data: { status: 'PAID' },
                    include: { items: { include: { product: true } } }
                });

                // Enviar email de confirmación
                await sendOrderConfirmation(updatedOrder);

                // Notify Admin
                await sendAdminNewOrderNotification(updatedOrder);

                // Real-time notification
                try {
                    getIO().emit('new-order', {
                        id: updatedOrder.id,
                        total: updatedOrder.totalAmount,
                        customer: updatedOrder.customerName,
                        method: 'MERCADO_PAGO'
                    });
                } catch (ioErr) {
                    console.error("Socket error emitting new-order:", ioErr.message);
                }

                console.log(`Orden #${orderId} pagada y confirmada.`);
            }
        }
        res.status(200).send("OK");
    } catch (error) {
        console.error("Error en Webhook:", error);
        res.status(500).send("Error");
    }
};
