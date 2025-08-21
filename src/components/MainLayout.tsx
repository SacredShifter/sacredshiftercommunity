import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UIErrorBoundary } from "@/components/ErrorBoundary";
import { AuraPresenceIndicator } from "@/components/AuraPresenceIndicator";
import { NotificationDropdown } from "@/components/NotificationDropdown";

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <UIErrorBoundary>
          <AppSidebar />
        </UIErrorBoundary>
        <SidebarInset className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 md:h-12 flex items-center justify-between border-b border-border/30 backdrop-blur-md bg-background/20 px-3 md:px-4 shrink-0">
            <div className="flex items-center">
              <SidebarTrigger className="mr-2 md:mr-4" />
              <img
                src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png"
                alt="Sacred Shifter"
                className="h-6 md:h-8 w-auto filter invert brightness-0 contrast-100 opacity-90"
              />
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <NotificationDropdown />
              <AuraPresenceIndicator showDetails={false} size="sm" />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-2 md:p-4">
              <UIErrorBoundary>
                <Outlet />
              </UIErrorBoundary>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
