import { Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuthContext";
import { AppSidebar } from "./components/AppSidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
import AIAssistantPage from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";
import { ParallaxBackground } from "./components/ParallaxBackground";
import BreathOfSource from "./components/BreathOfSource";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-screen bg-transparent">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-muted-foreground">Loading Sacred Shifter...</p>
    </div>
  </div>
);

// Authenticated layout with sidebar
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full h-screen bg-transparent text-foreground">
    <ParallaxBackground />
    <AppSidebar />
    <main className="flex-1 overflow-y-auto bg-transparent">
      {children}
      <BreathOfSource />
    </main>
  </div>
);

export const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is not authenticated, show auth page
  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Auth />} />
      </Routes>
    );
  }

  // If user is authenticated, show app with sidebar
  return (
    <AuthenticatedLayout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/messages/:userId" element={<Messages />} />
        <Route path="/circles" element={<Circles />} />
        <Route path="/circles/:circleId" element={<Circles />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/video-library" element={<VideoLibrary />} />
        <Route path="/registry" element={<Registry />} />
        <Route path="/codex" element={<Codex />} />
        <Route path="/guidebook" element={<Guidebook />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthenticatedLayout>
  );
};