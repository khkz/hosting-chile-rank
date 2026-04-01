import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import './index.css'

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();

    const recoveryKey = '__vite_preload_recovery_at__';
    const now = Date.now();
    const lastRecovery = Number(sessionStorage.getItem(recoveryKey) || '0');

    // Prevent infinite reload loops: allow at most one auto-recovery per minute
    if (now - lastRecovery < 60_000) return;

    sessionStorage.setItem(recoveryKey, String(now));

    const url = new URL(window.location.href);
    url.searchParams.set('cache-bust', String(now));
    window.location.replace(url.toString());
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
