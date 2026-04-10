import dotenv from 'dotenv';
// 1. Initialize dotenv before anything else
dotenv.config();

import express from 'express';
import * as Sentry from "@sentry/node";
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import paymentRoutes from './routes/payment.routes.js';
import { createServer } from 'http';
import { initSocket } from './utils/socket.js';

// Import routes and middlewares
import { validate } from './middlewares/validationMiddleware.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import seoRoutes from './routes/seo.routes.js';

import categoriesRoutes from './routes/categories.routes.js';

const app = express();

// 1. Sentry Initialization (Must be first to catch native Node crashes)
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

// Required for Render/Proxies
app.set('trust proxy', 1);

// Health check endpoint (Placed here to bypass heavy middleware)
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
        console.log(`[CORS Debug] Incoming Origin: ${origin}`);
    }
    next();
});

app.use(cors({
    origin: (origin, callback) => {
        // Allow if no origin (like mobile apps/postman) or if it's our domain/localhost
        if (!origin || 
            origin.includes('gaustina.com.ar') || 
            origin.includes('localhost') || 
            origin.includes('127.0.0.1')) {
            callback(null, true);
        } else {
            console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'sentry-trace', 'baggage'],
    credentials: true,
    maxAge: 7200 // Cache preflight response for 2h (conservative but efficient)
}));

// Handle preflight requests for all routes
app.options('*', cors());

// 1.5. Security Middlewares (Helmet & Rate Limit)

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "img-src": ["'self'", "data:", "https://tamyyvryopjvppkjauqa.supabase.co", "https://images.unsplash.com", "https://via.placeholder.com"],
            "media-src": ["'self'", "https://tamyyvryopjvppkjauqa.supabase.co"],
            "connect-src": ["'self'", "https://tamyyvryopjvppkjauqa.supabase.co", "https://api.mercadopago.com", "*.sentry.io"]
        },
    },
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por IP por ventana
    standardHeaders: true, 
    legacyHeaders: false,
    message: { error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo en 15 minutos.' }
});

// Aplicar el limitador a todas las rutas de la API
app.use('/api/', limiter);

// 2. JSON middleware
app.use(express.json());

// 3. Setup Routes
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/seo', seoRoutes); // For catalog CSV and other SEO tools
app.use('/', seoRoutes); // For sitemap.xml at root

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
const httpServer = createServer(app);

// Initialize Socket.io
initSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`✅ Server and Socket.io are running on port ${PORT}`);
});

// --- CÓDIGO DE DEBUG TEMPORAL REMOVIDO ---

export default app;
