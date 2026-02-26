import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// El Backend busca primero la Llave Maestra (Service Role)
// Si no la encuentra, usa la Anon (pero es mejor usar la Service Role para el backend)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey) {
    console.warn("❌ Error: Faltan las variables de entorno de Supabase en el servidor. Funcionalidad limitada.");
    // Mock básico para evitar crash
    supabase = {
        from: () => ({
            select: () => Promise.resolve({ data: [], error: { message: "Supabase not configured" } }),
            insert: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            update: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            delete: () => Promise.resolve({ error: { message: "Supabase not configured" } }),
            url: { searchParams: new URLSearchParams() }
        }),
        storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: "" } }) }) },
        auth: {
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            admin: { listUsers: () => Promise.resolve({ data: { users: [] }, error: null }) }
        }
    };
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };