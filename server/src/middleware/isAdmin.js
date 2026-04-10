import prisma from '../utils/prisma.js';
import { supabase } from '../utils/supabase.js';

const isAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }

        const token = authHeader.split(' ')[1];

        // 1. Verificar Token con Supabase (La Nube)
        console.time('[isAdmin] Supabase Auth');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        console.timeEnd('[isAdmin] Supabase Auth');

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid token or session expired' });
        }

        // 2. Verificar Rol en Base de Datos Local (Prisma)
        console.time('[isAdmin] Prisma fetch');
        let dbUser = await prisma.user.findUnique({
            where: { email: user.email }
        });
        console.timeEnd('[isAdmin] Prisma fetch');

        // --- MAGIA: AUTO-CREACIÓN SI NO EXISTE ---
        if (!dbUser) {
            console.log(`Usuario ${user.email} existe en Supabase pero no en DB local. Creándolo...`);

            // Como desactivaste el registro público, asumimos que si está en Supabase
            // es porque TÚ lo creaste manualmente, así que es seguro darle rol ADMIN.
            dbUser = await prisma.user.create({
                data: {
                    email: user.email,
                    name: user.user_metadata?.full_name || 'Admin', // Intenta sacar el nombre o pone 'Admin'
                    role: 'ADMIN',
                    // Si tu modelo User pide password, pon uno dummy porque la auth real la maneja Supabase
                    // password: 'managed-by-supabase' 
                }
            });
        }
        // ------------------------------------------

        if (dbUser.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        // Adjuntar usuario a la petición
        req.user = dbUser;
        next();

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default isAdmin;
