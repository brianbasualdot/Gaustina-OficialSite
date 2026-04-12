/**
 * Centralized API and Socket configuration
 */

// Use VITE_API_URL or VITE_BACKEND_URL from environment variables
// Fallback to localhost:3000 ONLY for local development
const baseBackendUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const API_URL = baseBackendUrl;
export const SOCKET_URL = baseBackendUrl;

console.log(`[Config] API_URL initialized as: ${API_URL}`);
