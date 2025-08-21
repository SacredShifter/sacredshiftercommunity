import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { TourProvider } from "@/components/TourProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import { MainLayout } from "@/components/MainLayout";
import { ToolbarWithComponents } from "@/components/ToolbarWithComponents";

import { ErrorBoundary, UIErrorBoundary } from "@/components/ErrorBoundary";

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
import ConstellationMapper from "./pages/ConstellationMapper";
import Grove from "./pages/Grove";

function App() {
  return (
    <ErrorBoundary name="Root">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen relative w-full">
          
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
                <Route path="/grove" element={<Grove />} />
                <Route path="/guidebook" element={<Guidebook />} />
                <Route path="/constellation" element={<ConstellationMapper />} />
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

            {/* Proper Toolbar with Component Loading */}
            <ToolbarWithComponents />
          </div>
        </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;