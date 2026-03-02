// server/src/app.js
import express from 'express';
import * as Sentry from "@sentry/node";
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';


// Initialize dotenv before anything else
dotenv.config();

// Import routes and middlewares
import { validate } from './middlewares/validationMiddleware.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import seoRoutes from './routes/seo.routes.js';

import categoriesRoutes from './routes/categories.routes.js';

const app = express();

// 1. Sentry Initialization (Must be first)
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// 2. CORS and JSON middleware
const allowedOrigins = [
    'https://gaustina.com.ar',
    'https://www.gaustina.com.ar',
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Ruta básica de salud
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// 3. Setup Routes
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/', seoRoutes);

// General API Routes (including contact and webhooks)
import apiRoutes from './routes/api.js';
app.use('/api', apiRoutes);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Payment Routes
app.use('/api/payment', paymentRoutes);

// Custom Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', reference: res.sentry });
});


// CONFIGURACIÓN DEL PUERTO Y ARRANQUE DEL SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});

// --- CÓDIGO DE DEBUG TEMPORAL REMOVIDO ---

export default app;
