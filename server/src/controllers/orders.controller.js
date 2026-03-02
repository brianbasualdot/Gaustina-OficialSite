import { PrismaClient } from '@prisma/client';
import { generateInvoicePDF } from '../utils/invoiceGenerator.js';
import { sendOrderConfirmation, sendShippingNotification } from '../services/emailService.js';

const prisma = new PrismaClient();

// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Update order status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        // --- DISPARADORES DE EMAIL SEGÚN ESTADO ---
        if (status === 'PAID') {
            try {
                await sendOrderConfirmation(updatedOrder);
            } catch (emailError) {
                console.error("Error sending confirmation email:", emailError);
            }
        } else if (status === 'SHIPPED') {
            try {
                await sendShippingNotification(updatedOrder);
            } catch (emailError) {
                console.error("Error sending shipping email:", emailError);
            }
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
};

// Download Invoice
export const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const doc = await generateInvoicePDF(order);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Factura-${order.id}.pdf`);

        doc.pipe(res);
        doc.end();

    } catch (error) {
        console.error("Error downloading invoice:", error);
        res.status(500).json({ error: 'Failed to download invoice' });
    }
};
