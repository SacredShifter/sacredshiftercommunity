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
import { ProductionReadyErrorBoundary } from "@/components/production/ProductionReadyErrorBoundary";
import { PerformanceMonitor } from "@/components/production/PerformanceMonitor";

import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Circles from "./pages/Circles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Journal from "./pages/Journal";
import VideoLibrary from "./pages/VideoLibrary";
import CollectiveAkashicConstellationPage from "./pages/CollectiveAkashicConstellation";
import RegistryEntry from "./pages/RegistryEntry";
import AkashicConstellationPage from "./pages/AkashicConstellation";
import Guidebook from "./pages/Guidebook";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AuraQuantumCommandNexus from '@/pages/AuraQuantumCommandNexus';
import ConstellationMapper from "./pages/ConstellationMapper";
import Grove from "./pages/Grove";
import Liberation from "./pages/Liberation";
import LearningModule3D from './components/3D/LearningModule3D';
import Shift from './pages/Shift';
import Meditation from './pages/Meditation';

import HermeticAtrium from './pages/learn/hermetic/Atrium';
import Mentalism from './pages/learn/hermetic/Mentalism';
import Vibration from './pages/learn/hermetic/Vibration';

function App() {
  return (
    <ProductionReadyErrorBoundary>
      <PerformanceMonitor />
      <ErrorBoundary name="Root">
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <div className="min-h-screen relative w-full">
          
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/learn/hermetic" element={<HermeticAtrium />} />
            <Route path="/learn/hermetic/mentalism" element={<Mentalism />} />
            <Route path="/learn/hermetic/vibration" element={<Vibration />} />
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
                <Route path="/registry" element={<CollectiveAkashicConstellationPage />} />
                <Route path="/resonance/entries/:id" element={<RegistryEntry />} />
                <Route path="/codex" element={<AkashicConstellationPage />} />
                <Route path="/grove" element={<Grove />} />
                <Route path="/liberation" element={<Liberation />} />
                <Route path="/guidebook" element={<Guidebook />} />
                <Route path="/constellation" element={<ConstellationMapper />} />
                <Route path="/support" element={<Support />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/ai-admin" element={<AdminRoute><AuraQuantumCommandNexus /></AdminRoute>} />
                <Route path="/learning-3d" element={<LearningModule3D />} />
                <Route path="/shift" element={<Shift />} />
                <Route path="/meditation" element={<Meditation />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Proper Toolbar with Component Loading */}
            <ToolbarWithComponents />
          </div>
        </TooltipProvider>
      </ErrorBoundary>
    </ProductionReadyErrorBoundary>
  );
}

export default App;