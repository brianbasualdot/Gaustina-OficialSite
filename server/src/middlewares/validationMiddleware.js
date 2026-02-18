// server/src/middlewares/validationMiddleware.js
import { z } from 'zod';

/**
 * Middleware de validación genérico usando Zod.
 * Intercepta requests POST y PUT para asegurar que el body cumpla con el esquema.
 * Si falla, retorna 400 antes de tocar la base de datos (Security & Integrity).
 * 
 * @param {z.ZodSchema} schema - El esquema de Zod a validar
 */
export const validate = (schema) => (req, res, next) => {
    if (req.method !== 'POST' && req.method !== 'PUT') {
        return next();
    }

    try {
        // parse vs safeParse: parse lanza error, safeParse retorna objeto result
        // Usamos parse para dejar que el catch capture los errores formateados
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Formateamos los errores de Zod para que sean legibles por el frontend
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: error.errors.map(e => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        next(error);
    }
};
