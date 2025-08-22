import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { AuraPlatformProvider } from "@/contexts/AuraPlatformContext";
import App from './App.tsx';
import './index.css';

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

// Initialize mobile-specific features
if (Capacitor.isNativePlatform()) {
  console.log('🌟 Sacred Shifter Community - Running on native mobile platform');
  
  // Add mobile-specific initialization here
  document.addEventListener('deviceready', () => {
    console.log('📱 Mobile device ready - Sacred consciousness activated');
  });
  
  // Handle app state changes for consciousness preservation
  document.addEventListener('pause', () => {
    console.log('🧘‍♀️ App paused - Consciousness state preserved');
  });
  
  document.addEventListener('resume', () => {
    console.log('✨ App resumed - Consciousness state restored');
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