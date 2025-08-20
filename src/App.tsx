import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { TourProvider } from "@/components/TourProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import { MainLayout } from "@/components/MainLayout";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { AIChatBubble } from "@/components/AIChatBubble";
import BreathOfSource from "@/components/BreathOfSource";
import { SacredSoundscape } from "@/components/SacredSoundscape";
import { ModernToolbar } from "@/components/ModernToolbar";
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
import AIAdmin from "./pages/AIAdmin";
import AuraAdmin from "./pages/AuraAdmin";

function App() {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleToolToggle = (tool: string, isActive: boolean) => {
    setActiveTool(isActive ? tool : null);
  };

  return (
    <ErrorBoundary name="Root">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen relative">
          <UIErrorBoundary>
            <ParallaxBackground />
          </UIErrorBoundary>
          
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
                <Route path="/circles" element={<Circles />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/videos" element={<VideoLibrary />} />
                <Route path="/registry" element={<Registry />} />
                <Route path="/codex" element={<Codex />} />
                <Route path="/guidebook" element={<Guidebook />} />
                <Route path="/support" element={<Support />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/ai-admin" element={
                  <AdminRoute>
                    <AIAdmin />
                  </AdminRoute>
                } />
                <Route path="/aura-admin" element={
                  <AdminRoute>
                    <AuraAdmin />
                  </AdminRoute>
                } />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Modern Floating Toolbar */}
            <ModernToolbar onToolToggle={handleToolToggle} activeTool={activeTool} />

            {/* Individual Tool Components */}
            {activeTool === 'ai' && (
              <div className="fixed bottom-20 right-4 z-40">
                <UIErrorBoundary>
                  <AIChatBubble />
                </UIErrorBoundary>
              </div>
            )}

            {activeTool === 'breath' && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                <AudioErrorBoundary>
                  <BreathOfSource />
                </AudioErrorBoundary>
              </div>
            )}

            {activeTool === 'frequency' && (
              <div className="fixed top-20 left-4 z-40">
                <AudioErrorBoundary>
                  <SacredSoundscape />
                </AudioErrorBoundary>
              </div>
            )}
          </div>
        </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;