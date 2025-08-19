import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { TourProvider } from "@/components/TourProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/MainLayout";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { AIChatBubble } from "@/components/AIChatBubble";
import BreathOfSource from "@/components/BreathOfSource";
import { SacredSoundscape } from "@/components/SacredSoundscape";
import { ErrorBoundary, UIErrorBoundary, AudioErrorBoundary } from "@/components/ErrorBoundary";

import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Circles from "./pages/Circles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Journal from "./pages/Journal";
import VideoLibrary from "./pages/VideoLibrary";
import Registry from "./pages/Registry";
import Codex from "./pages/Codex";
import Guidebook from "./pages/Guidebook";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { Outlet } from "react-router-dom";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary name="Root">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="min-h-screen relative">
              <UIErrorBoundary>
                <ParallaxBackground />
              </UIErrorBoundary>
              
              <BrowserRouter>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    element={
                      <ProtectedRoute>
                        <TourProvider>
                          <MainLayout />
                        </TourProvider>
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/" element={<Index />} />
                    <Route path="/feed" element={<Feed />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/circles"element={<Circles />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/videos" element={<VideoLibrary />} />
                    <Route path="/registry" element={<Registry />} />
                    <Route path="/codex" element={<Codex />} />
                    <Route path="/guidebook" element={<Guidebook />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>

                {/* Global floating components */}
                <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
                  <AudioErrorBoundary>
                    <SacredSoundscape />
                  </AudioErrorBoundary>
                </div>

                <div className="fixed bottom-20 right-4 z-50">
                  <UIErrorBoundary>
                    <AIChatBubble />
                  </UIErrorBoundary>
                </div>

                <AudioErrorBoundary>
                  <BreathOfSource />
                </AudioErrorBoundary>
              </BrowserRouter>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
