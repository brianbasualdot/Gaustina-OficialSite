import { createClient } from '@supabase/supabase-js';

export let initializationError = null;
let supabaseInstance;

console.log("Attempting to initialize Supabase...");

try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Log presence of variables (not values) for debugging
    console.log("VITE_SUPABASE_URL present:", !!supabaseUrl);
    console.log("VITE_SUPABASE_ANON_KEY present:", !!supabaseAnonKey);

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing Environment Variables: Is .env file created in /client?");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log("Supabase Client created successfully.");

} catch (error) {
    console.error("Supabase Initialization Failed:", error);
    initializationError = error.message;

    // Fallback Mock to prevent App Crash
    supabaseInstance = {
        auth: {
            signInWithPassword: async () => ({ error: { message: `Init Error: ${initializationError}` } }),
            getSession: async () => ({ data: { session: null }, error: { message: "Mock session" } }),
            signOut: async () => ({ error: null })
        },
        from: () => ({
            select: () => ({
                data: [],
                error: { message: "Database unreachable due to initialization error." }
            }),
            insert: () => ({ data: null, error: { message: "Database unreachable" } }),
            update: () => ({ data: null, error: { message: "Database unreachable" } }),
            delete: () => ({ data: null, error: { message: "Database unreachable" } }),
            upload: () => ({ data: null, error: { message: "Storage unreachable" } }) // Mock for storage.from().upload
        }),
        storage: {
            from: () => ({
                upload: () => ({ data: null, error: { message: "Storage unreachable" } }),
                getPublicUrl: () => ({ data: { publicUrl: "" } })
            })
        }
    };
}

export const supabase = supabaseInstance;
