import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { AuraPlatformProvider } from "@/contexts/AuraPlatformContext";
import App from './App.tsx';
import './index.css';
import * as Sentry from "@sentry/react";

// Sentry Initialization
if (!import.meta.env.DEV) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

// Capacitor Mobile Support
import { Capacitor } from '@capacitor/core';

// Configure query client for mobile optimization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Capacitor.isNativePlatform() ? 30000 : 10000, // Longer cache on mobile
      retry: Capacitor.isNativePlatform() ? 2 : 3, // Fewer retries on mobile
      networkMode: 'offlineFirst', // Mobile-friendly offline support
    },
    mutations: {
      retry: Capacitor.isNativePlatform() ? 1 : 2,
      networkMode: 'offlineFirst',
    }
  }
});

import { logger } from './lib/logger';

// Initialize mobile-specific features
if (Capacitor.isNativePlatform()) {
  logger.info('Sacred Shifter Community - Running on native mobile platform', { component: 'main' });
  
  // Add mobile-specific initialization here
  document.addEventListener('deviceready', () => {
    logger.info('Mobile device ready - Sacred consciousness activated', { component: 'main' });
  });
  
  // Handle app state changes for consciousness preservation
  document.addEventListener('pause', () => {
    logger.info('App paused - Consciousness state preserved', { component: 'main' });
  });
  
  document.addEventListener('resume', () => {
    logger.info('App resumed - Consciousness state restored', { component: 'main' });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AuraPlatformProvider>
            <App />
            <Toaster />
          </AuraPlatformProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);