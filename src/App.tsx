import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { TourProvider } from "@/components/TourProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { ChatBubble } from "@/components/ChatBubble";
import { AIChatBubble } from "@/components/AIChatBubble";
import { SacredSoundscape } from "@/components/SacredSoundscape";

import Index from "./pages/Index";
import Feed from "./pages/Feed";
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

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TourProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen relative">
            {/* Beautiful moving background across all pages */}
            <ParallaxBackground />
            
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <div className="min-h-screen flex w-full relative">
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
                              <Route path="/registry" element={<Registry />} />
                              <Route path="/codex" element={<Codex />} />
                              <Route path="/guidebook" element={<Guidebook />} />
                              <Route path="/support" element={<Support />} />
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
                        
                        {/* AI Assistant - Bottom Right */}
                        <div className="fixed bottom-20 right-4 z-50">
                          <AIChatBubble />
                        </div>
                        
                      </div>
                    </SidebarProvider>
                  </ProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </div>
        </TooltipProvider>
        </TourProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
