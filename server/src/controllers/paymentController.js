import { PrismaClient } from '@prisma/client';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import { sendOrderConfirmation, sendAdminNewOrderNotification } from '../services/emailService.js';

dotenv.config();
const prisma = new PrismaClient();

// Configurar Mercado Pago
if (!process.env.MP_ACCESS_TOKEN) {
    console.error("CRITICAL: MP_ACCESS_TOKEN is missing in environment variables!");
}
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

// 1. CREAR ORDEN CON TRANSACCIÓN ACID
const createOrderTransaction = async (items, total, type, customerData) => {
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
                // Datos de Cliente y Envío (Obligatorios por lógica de negocio ahora)
                customerName: customerData.customerName,
                customerEmail: customerData.customerEmail,
                shippingAddress: customerData.shippingAddress,
                shippingCity: customerData.shippingCity,
                postalCode: customerData.shippingZip,
                shippingPhone: customerData.shippingPhone,

                items: {
                    create: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity || 1,
                        price: item.price,
                        selectedCustomizations: item.selectedCustomizations || null
                    }))
                }
            },
            include: { items: { include: { product: true } } } // Para tener detalles al enviar email
        });

        return order;
    });
};

// 2. ENDPOINT: INICIAR PAGO (Preference)
export const createPreference = async (req, res) => {
    try {
        const { items, method, customerData } = req.body;

        // Validar datos básicos
        if (!customerData || !customerData.customerEmail || !customerData.shippingAddress) {
            return res.status(400).json({ error: "Faltan datos de envío o contacto." });
        }

        let total = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

        // APLICAR DESCUENTO TRANSFERENCIA (5%)
        if (method === 'transferencia') {
            total = total * 0.95;
        }

        // --- TRANSACCIÓN ACID (Stock + Orden) ---
        let newOrder;
        try {
            newOrder = await createOrderTransaction(items, total, method.toUpperCase(), customerData);
        } catch (dbError) {
            console.error("Error de Stock/DB:", dbError.message);
            return res.status(400).json({ error: dbError.message }); // Retorna error de stock al front
        }

        // A. CASO TRANSFERENCIA
        if (method === 'transferencia') {
            // Enviar email de confirmación inmediatamente
            await sendOrderConfirmation(newOrder);

            // Notify Admin
            await sendAdminNewOrderNotification(newOrder);

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

        const result = await preference.create({
            body: {
                items: items.map(item => ({
                    title: item.selectedCustomizations
                        ? `${item.name} (${Object.values(item.selectedCustomizations).join(', ')})`
                        : item.name,
                    quantity: parseInt(item.quantity) || 1,
                    unit_price: Math.round(item.price * 100) / 100, // Round to 2 decimals
                    currency_id: 'ARS',
                    picture_url: item.images?.[0] || ''
                })),
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

                console.log(`Orden #${orderId} pagada y confirmada.`);
            }
        }
        res.status(200).send("OK");
    } catch (error) {
        console.error("Error en Webhook:", error);
        res.status(500).send("Error");
    }
};
