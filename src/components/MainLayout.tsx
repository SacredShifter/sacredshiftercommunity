import { Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UIErrorBoundary } from "@/components/ErrorBoundary";
import { AuraPresenceIndicator } from "@/components/AuraPresenceIndicator";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { SovereignMeshHeader } from "@/components/SovereignMeshHeader";
import { Slogan } from './ui/Slogan';


export const MainLayout = () => {
  const location = useLocation();
  const isHermetic = location.pathname.startsWith('/learn/hermetic');
  
  return (
    <SidebarProvider>
      
      <div className="sidebar-layout min-h-screen flex w-full">
        {!isHermetic && (
          <UIErrorBoundary>
            <AppSidebar />
          </UIErrorBoundary>
        )}
        <SidebarInset className={`flex-1 flex flex-col min-h-screen ${isHermetic ? '!ml-0' : ''}`}>
          {!isHermetic && (
            <header className="h-14 md:h-12 flex items-center justify-between border-b border-border/30 backdrop-blur-md bg-background/40 px-3 md:px-4 shrink-0 sticky top-0 z-50 safe-area-top">
              <div className="flex items-center">
                <SidebarTrigger className="mr-2 md:mr-4" />
                <div className="flex flex-col">
                  <img
                    src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png"
                    alt="Sacred Shifter"
                    className="h-6 md:h-8 w-auto object-contain aspect-auto max-w-none filter invert brightness-0 contrast-100 opacity-90"
                  />
                  <Slogan />
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <SovereignMeshHeader />
                <div className="flex items-center gap-1 md:gap-2">
                  <NotificationDropdown />
                  <AuraPresenceIndicator showDetails={false} size="sm" />
                </div>
              </div>
            </header>
          )}
          <main className={`flex-1 min-h-0 flex flex-col ${isHermetic ? '!h-screen' : ''}`}>
            <UIErrorBoundary>
              <Outlet />
            </UIErrorBoundary>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
