import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig({
    plugins: [
        react(),
        // sentryVitePlugin({
        //     org: "brianbasualdot org's",
        //     project: "ecommerce-frontend",
        //     authToken: process.env.SENTRY_AUTH_TOKEN, // Crear token en Sentry settings
        // }),
    ],
    build: {
        sourcemap: true, // Vital para que funcione
    },
});