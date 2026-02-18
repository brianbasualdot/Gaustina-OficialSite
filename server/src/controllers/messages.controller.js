
import { PrismaClient } from '@prisma/client';
import { sendAdminReplyEmail } from '../services/emailService.js';

const prisma = new PrismaClient();

// Get all messages (ordered by newest)
export const getMessages = async (req, res) => {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Error retrieving messages" });
    }
};

// Reply to a message
export const replyMessage = async (req, res) => {
    const { id } = req.params;
    const { replyText, templateType } = req.body;

    if (!replyText) {
        return res.status(400).json({ error: "Reply text is required" });
    }

    try {
        // 1. Find the message
        const originalMessage = await prisma.contactMessage.findUnique({
            where: { id: parseInt(id) },
        });

        if (!originalMessage) {
            return res.status(404).json({ error: "Message not found" });
        }

        // 2. Send Email
        const emailResult = await sendAdminReplyEmail({
            to: originalMessage.email,
            name: originalMessage.name,
            originalMessage: originalMessage.message,
            replyMessage: replyText,
            templateType: templateType || 'GENERAL'
        });

        if (!emailResult.success) {
            return res.status(500).json({ error: "Failed to send email: " + emailResult.error });
        }

        // 3. Update Database
        const updatedMessage = await prisma.contactMessage.update({
            where: { id: parseInt(id) },
            data: {
                reply: replyText,
                repliedAt: new Date(),
                replyTemplate: templateType || 'GENERAL',
                isRead: true,
            },
        });

        res.status(200).json({ message: "Reply sent successfully", data: updatedMessage });

    } catch (error) {
        console.error("Error replying to message:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
