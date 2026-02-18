📁 Estructura del Proyecto (Monorepo)
/server: Node.js + Express
/client: React + Vite

🛡️ Backend & Seguridad (Server)
Validación Zod Middleware: server/src/middlewares/validationMiddleware.js. Intercepta automáticamente POST/PUT. Definiciones en server/src/schemas/zodSchemas.js.
Integridad de Datos (ACID): server/src/controllers/paymentController.js. Implementa prisma.$transaction para asegurar la consistencia del stock al confirmar pagos.
Observabilidad: Sentry inicializado en server/src/app.js.

⚡ Frontend & UX (Client)
Optimistic UI: client/src/hooks/useCart.js. Hook personalizado usando React Query que actualiza la UI instantáneamente antes de la respuesta del servidor (con rollback si falla).
Sentry: Configurado en client/src/main.jsx.

📈 Growth (Recuperación de Carritos)
Endpoint Seguro: server/src/controllers/cronController.js. Lógica para buscar órdenes pendientes de hace >2 horas. Protegido por Token Bearer.
Automatización: .github/workflows/cron_recovery.yml. Configurado para ejecutarse cada 6 horas y llamar a tu servidor Render.
