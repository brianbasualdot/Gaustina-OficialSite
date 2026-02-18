// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@vercel/analytics/react";
import * as Sentry from "@sentry/react";
// import { BrowserTracing } from "@sentry/tracing";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

import ErrorBoundary from './components/common/ErrorBoundary';

console.log('Main.jsx restoring with ErrorBoundary');

// Sentry Init for Frontend
Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],
    tracesSampleRate: 1.0,
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <Analytics />
                </QueryClientProvider>
            </HelmetProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
