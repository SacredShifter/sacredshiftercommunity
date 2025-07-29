import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, Rss, Settings, LogOut, BookOpen, Video, Database, Archive, Scroll } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipWrapper } from "@/components/HelpSystem/TooltipWrapper";
import { HelpTooltips } from "@/components/HelpSystem/ContextualHelp";

const navItems = [
  { title: "Home", url: "/", icon: Home, tooltip: HelpTooltips.home },
  { title: "Feed", url: "/feed", icon: Rss, tooltip: HelpTooltips.feed },
  { title: "Circles", url: "/circles", icon: Users, tooltip: HelpTooltips.circles },
  { title: "Journal", url: "/journal", icon: BookOpen, tooltip: HelpTooltips.journal },
  { title: "Video Library", url: "/videos", icon: Video, tooltip: HelpTooltips.videos },
  { title: "Registry", url: "/registry", icon: Database, tooltip: HelpTooltips.registry },
  { title: "Personal Codex", url: "/codex", icon: Archive, tooltip: HelpTooltips.codex },
  { title: "Profile", url: "/profile", icon: User, tooltip: HelpTooltips.profile },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (email?: string) => {
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'SS';
  };

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isItemActive = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <TooltipWrapper 
                      content={item.tooltip} 
                      side="right"
                      disabled={!isCollapsed}
                    >
                      <SidebarMenuButton 
                        asChild
                        isActive={isItemActive}
                        className={isItemActive ? "bg-primary/10 text-primary font-medium" : ""}
                      >
                        <Link to={item.url}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </TooltipWrapper>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Guidebook Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Knowledge</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <TooltipWrapper 
                  content="Sacred Shifter Guidebook - Ancient wisdom for modern transformation" 
                  side="right"
                  disabled={!isCollapsed}
                >
                  <SidebarMenuButton asChild>
                    <Link to="/guidebook">
                      <Scroll className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Sacred Shifter Guidebook</span>}
                    </Link>
                  </SidebarMenuButton>
                </TooltipWrapper>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <TooltipWrapper 
                  content={HelpTooltips.settings} 
                  side="right"
                  disabled={!isCollapsed}
                >
                  <SidebarMenuButton asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Settings</span>}
                    </Link>
                  </SidebarMenuButton>
                </TooltipWrapper>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <TooltipWrapper 
                  content="Sign out of your Sacred Shifter account" 
                  side="right"
                  disabled={!isCollapsed}
                >
                  <SidebarMenuButton 
                    onClick={handleSignOut}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {!isCollapsed && <span>Sign Out</span>}
                  </SidebarMenuButton>
                </TooltipWrapper>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Info */}
        {user && !isCollapsed && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Sacred Seeker</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}