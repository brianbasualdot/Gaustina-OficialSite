import { sendContactEmail } from '../services/emailService.js';
import prisma from '../utils/prisma.js';

export const handleContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        // 1. Save to Database
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                message,
            },
        });

        // 2. Send Notification Email
        const result = await sendContactEmail({ name, email, message });

        if (!result.success) {
            return res.status(500).json({ error: result.error || 'Error al enviar el email' });
        }

        res.status(200).json({ message: 'Mensaje enviado correctamente' });
    } catch (error) {
        console.error("Error in handleContactForm:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
