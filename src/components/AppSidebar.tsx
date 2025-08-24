import { Link, useLocation } from "react-router-dom";
import { Home, Users, User, Rss, Settings, LogOut, BookOpen, Video, Database, Archive, Scroll, Heart, MessageCircle, Brain, TreePine, Stars, Box } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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

const coreNavItems = [
  { title: "Home", url: "/", icon: Home, tooltip: HelpTooltips.home },
  { title: "Feed", url: "/feed", icon: Rss, tooltip: HelpTooltips.feed },
  { title: "Messages", url: "/messages", icon: MessageCircle, tooltip: "Direct Messages - Connect with other Sacred Shifters privately" },
];

const sacredToolsItems = [
  { title: "Sacred Grove", url: "/grove", icon: TreePine, tooltip: "Sacred Grove - Your living wisdom ecosystem for consciousness exploration" },
  { title: "Journal", url: "/journal", icon: BookOpen, tooltip: HelpTooltips.journal },
  { title: "Circles", url: "/circles", icon: Users, tooltip: HelpTooltips.circles },
  { title: "Personal Codex", url: "/codex", icon: Archive, tooltip: HelpTooltips.akashicConstellation },
  { title: "Consciousness Mapper", url: "/constellation", icon: Stars, tooltip: "Consciousness Constellation Mapper - AI-powered consciousness cartography and pattern recognition" },
];

const knowledgeItems = [
  { title: "Guidebook", url: "/guidebook", icon: Scroll, tooltip: "Guidebook - Ancient wisdom for modern transformation" },
  { title: "3D Learning Modules", url: "/learning-3d", icon: Box, tooltip: "3D Learning Modules - Interactive sacred geometry and consciousness visualization library" },
  { title: "Collective Codex", url: "/registry", icon: Database, tooltip: HelpTooltips.collectiveAkashicConstellation },
];

const mediaItems = [
  { title: "YouTube", url: "/videos", icon: Video, tooltip: HelpTooltips.videos },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const [userProfile, setUserProfile] = useState<{ display_name?: string; avatar_url?: string } | null>(null);

  const isActive = (path: string) => currentPath === path;

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Subscribe to profile changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (displayName?: string, email?: string) => {
    if (displayName) {
      return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'SS';
  };

  return (
    <Sidebar 
      className={`${isCollapsed ? "w-16" : "w-64"} min-h-screen border-r border-border/30`} 
      collapsible="icon" 
      data-tour="navigation-sidebar"
    >
      <SidebarContent className="bg-background/20 backdrop-blur-sm overflow-visible sidebar-no-scrollbar">
        {/* Core Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Core Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreNavItems.map((item) => {
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
                        <Link to={item.url} data-tour={`nav-${item.title.toLowerCase()}`}>
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

        {/* Sacred Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Sacred Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sacredToolsItems.map((item) => {
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
                        <Link to={item.url} data-tour={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
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

        {/* Media */}
        <SidebarGroup>
          <SidebarGroupLabel>Media</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mediaItems.map((item) => {
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
                        <Link to={item.url} data-tour="nav-video-library">
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

        {/* Knowledge Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Knowledge</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {knowledgeItems.map((item) => {
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

        {/* AI Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Neural Interface</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <TooltipWrapper 
                  content="AI Admin - Advanced neural command center with consciousness mapping" 
                  side="right"
                  disabled={!isCollapsed}
                >
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive("/ai-admin")}
                    className={isActive("/ai-admin") ? "bg-primary/10 text-primary font-medium" : ""}
                  >
                    <Link to="/ai-admin">
                      <Brain className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>AI Admin</span>}
                    </Link>
                  </SidebarMenuButton>
                </TooltipWrapper>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support the Shift Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Support the Shift</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <TooltipWrapper 
                  content="Support Sacred Shifter - Fuel the Frequency with donations and premium modules" 
                  side="right"
                  disabled={!isCollapsed}
                >
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive("/support")}
                    className={isActive("/support") ? "bg-primary/10 text-primary font-medium" : ""}
                  >
                    <Link to="/support">
                      <Heart className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Support the Shift</span>}
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
                  content={HelpTooltips.profile} 
                  side="right"
                  disabled={!isCollapsed}
                >
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive("/profile")}
                    className={isActive("/profile") ? "bg-primary/10 text-primary font-medium" : ""}
                  >
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>Profile</span>}
                    </Link>
                  </SidebarMenuButton>
                </TooltipWrapper>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <TooltipWrapper 
                  content={HelpTooltips.settings} 
                  side="right"
                  disabled={!isCollapsed}
                >
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive("/settings")}
                    className={isActive("/settings") ? "bg-primary/10 text-primary font-medium" : ""}
                  >
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
          <div className="mt-auto p-4 border-t" data-tour="profile-section">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={userProfile?.avatar_url || ""} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(userProfile?.display_name, user.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userProfile?.display_name || user.email?.split('@')[0] || 'Sacred Seeker'}
                </p>
                <p className="text-xs text-muted-foreground">Sacred Seeker</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}