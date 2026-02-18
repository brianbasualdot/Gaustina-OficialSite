// server/src/routes/api.js
import express from 'express';
import { handlePaymentWebhook } from '../controllers/paymentController.js';
import { recoverAbandonedCarts } from '../controllers/cronController.js';
import { validate } from '../middlewares/validationMiddleware.js';
import { UserSchema, ProductSchema } from '../schemas/zodSchemas.js';

const router = express.Router();

// --- Public / Webhook Routes ---

// Payment Webhook (Mercado Pago knocks here)
router.post('/webhooks/mercadopago', handlePaymentWebhook);

import { handleContactForm } from '../controllers/contact.controller.js';
router.post('/contact', handleContactForm);

// --- Protected / Admin Routes ---

// Cron Job Route (Protected by Bearer Token check inside controller or middleware)
router.post('/cron/recover-carts', recoverAbandonedCarts);

// Example Validated Routes
router.post('/users', validate(UserSchema), (req, res) => {
    // Controller logic for creating user
    res.status(201).json({ message: "User created validly" });
});

router.post('/products', validate(ProductSchema), (req, res) => {
    // Controller logic for creating product
    res.status(201).json({ message: "Product created validly" });
});

export default router;
