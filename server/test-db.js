import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const { Client } = pg;

console.log("---------------------------------------------------");
console.log("🛠️  PRUEBA DE CONEXIÓN A BASE DE DATOS (Nativa)");
console.log("---------------------------------------------------");

const testConnection = async (connectionString, label) => {
    if (!connectionString) {
        console.log(`❌ ${label}: No definida en .env`);
        return;
    }

    // Mask password for safe logging
    const safeUrl = connectionString.replace(/:([^:@]+)@/, ':****@');
    console.log(`\nProbando ${label}: ${safeUrl}`);

    const client = new Client({
        connectionString: connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase in many environments
    });

    try {
        await client.connect();
        const res = await client.query('SELECT NOW()');
        console.log(`✅ ${label}: CONEXIÓN EXITOSA!`);
        console.log(`   Hora del servidor: ${res.rows[0].now}`);
        await client.end();
    } catch (err) {
        console.error(`❌ ${label}: FALLÓ`);
        console.error(`   Error: ${err.message}`);
        if (err.code) console.error(`   Código: ${err.code}`);
    }
};

(async () => {
    await testConnection(process.env.DATABASE_URL, "DATABASE_URL (Pooling)");
    await testConnection(process.env.DIRECT_URL, "DIRECT_URL (Directa)");
})();
