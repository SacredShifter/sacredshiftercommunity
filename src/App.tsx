import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { ChatBubble } from "@/components/ChatBubble";
import { SacredSoundscape } from "@/components/SacredSoundscape";
import Index from "./pages/Index";
import Feed from "./pages/Feed";
import Circles from "./pages/Circles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Journal from "./pages/Journal";
import VideoLibrary from "./pages/VideoLibrary";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full relative">
                      <ParallaxBackground />
                      <AppSidebar />
                      <SidebarInset>
                        <header className="h-12 flex items-center border-b border-border/30 backdrop-blur-md bg-background/20 px-4">
                          <SidebarTrigger className="mr-4" />
                          <div className="flex items-center">
                            <img 
                              src="/src/assets/sacred-shifter-logo.png" 
                              alt="Sacred Shifter" 
                              className="h-8 w-auto filter invert brightness-0 contrast-100 opacity-90"
                            />
                          </div>
                        </header>
                        <div className="flex-1 overflow-auto p-4 bg-transparent">
                          <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/feed" element={<Feed />} />
                            <Route path="/circles" element={<Circles />} />
                            <Route path="/journal" element={<Journal />} />
                            <Route path="/videos" element={<VideoLibrary />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </div>
                      </SidebarInset>
                      
                      {/* Floating Control Center - Top Right */}
                      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
                        <SacredSoundscape />
                        <ChatBubble />
                      </div>
                    </div>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
