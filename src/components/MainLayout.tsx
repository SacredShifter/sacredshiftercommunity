import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { UIErrorBoundary } from "@/components/ErrorBoundary";

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full">
        <UIErrorBoundary>
          <AppSidebar />
        </UIErrorBoundary>
        <SidebarInset className="flex-1 flex flex-col h-screen">
          <header className="h-12 flex items-center border-b border-border/30 backdrop-blur-md bg-background/20 px-4 shrink-0">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center">
              <img
                src="https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png"
                alt="Sacred Shifter"
                className="h-8 w-auto filter invert brightness-0 contrast-100 opacity-90"
              />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto min-h-0">
            <div className="min-h-full">
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
