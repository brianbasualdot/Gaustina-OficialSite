// server/src/controllers/cronController.js
import { PrismaClient } from '@prisma/client';
import * as Sentry from "@sentry/node";
import { sendAbandonedCartEmail } from '../services/emailService.js';

const prisma = new PrismaClient();

/**
 * Controller for recovering abandoned carts.
 * Secured by CRON_SECRET check in middleware or here.
 * 
 * Logic:
 * 1. Find orders created > 2 hours ago that are still PENDING.
 * 2. Send email reminder.
 */
export const recoverAbandonedCarts = async (req, res) => {
    // Security Check (redundant if middleware handles it, but good practice)
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const now = Date.now();
        const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000);
        const eightHoursAgo = new Date(now - 8 * 60 * 60 * 1000);

        const abandonedOrders = await prisma.order.findMany({
            where: {
                status: 'PENDING',
                createdAt: {
                    lt: twoHoursAgo,
                    gt: eightHoursAgo, // Time window to prevent spam loop
                },
            },
        });

        console.log(`Found ${abandonedOrders.length} abandoned carts.`);

        // Nodemailer setup (Mock)
        // const transporter = nodemailer.createTransport({ ... });

        const emailPromises = abandonedOrders.map(order => {
            const email = order.customerEmail;
            if (email) {
                console.log(`Sending recovery email to ${email} for Order #${order.id}`);
                return sendAbandonedCartEmail(order);
            } else {
                const errorMsg = `Order #${order.id} found without customerEmail for recovery.`;
                console.warn(errorMsg);
                Sentry.captureMessage(errorMsg, "warning");
                return Promise.resolve();
            }
        });

        await Promise.all(emailPromises);

        res.status(200).json({
            message: 'Recovery process completed',
            processed: abandonedOrders.length
        });

    } catch (error) {
        console.error("Cron job failed:", error);
        Sentry.captureException(error);
        res.status(500).json({ error: error.message });
    }
};
