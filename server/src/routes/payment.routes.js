import { Router } from 'express';
import { createPreference, handlePaymentWebhook } from '../controllers/paymentController.js';

const router = Router();

// Ruta para crear el pago (MP o Transferencia)
router.post('/create_preference', createPreference);

// Ruta para que MP nos avise (Webhook)
router.post('/webhook', handlePaymentWebhook);

export default router;