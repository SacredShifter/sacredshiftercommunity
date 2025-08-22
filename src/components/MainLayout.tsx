import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UIErrorBoundary } from "@/components/ErrorBoundary";
import { AuraPresenceIndicator } from "@/components/AuraPresenceIndicator";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { SovereignMeshHeader } from "@/components/SovereignMeshHeader";
import SimpleBackground from "@/components/SimpleBackground";

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <SimpleBackground />
      <div className="sidebar-layout min-h-screen flex w-full">
        <UIErrorBoundary>
          <AppSidebar />
        </UIErrorBoundary>
        <SidebarInset className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 md:h-12 flex items-center justify-between border-b border-border/30 backdrop-blur-md bg-background/40 px-3 md:px-4 shrink-0 sticky top-0 z-50 safe-area-top">
            <div className="flex items-center">
              <SidebarTrigger className="mr-2 md:mr-4" />
              <img
                src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png"
                alt="Sacred Shifter"
                className="h-6 md:h-8 w-auto filter invert brightness-0 contrast-100 opacity-90"
              />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <SovereignMeshHeader />
              <div className="flex items-center gap-1 md:gap-2">
                <NotificationDropdown />
                <AuraPresenceIndicator showDetails={false} size="sm" />
              </div>
            </div>
          </header>
          <main className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-y-auto -webkit-overflow-scrolling-touch scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <div className="h-full">
                <UIErrorBoundary>
                  <Outlet />
                </UIErrorBoundary>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
