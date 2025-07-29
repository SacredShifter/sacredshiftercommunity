import { useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  Users, 
  User, 
  MessageSquare, 
  Settings, 
  LogOut,
  Rss
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export const Navigation = ({ className }: NavigationProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/feed', label: 'Feed', icon: Rss },
    { path: '/circles', label: 'Circles', icon: Users },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className={`space-y-2 ${className}`}>
      {/* Main Navigation */}
      <div className="space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              asChild
              variant={active ? "default" : "ghost"}
              className={`w-full justify-start ${
                active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-primary/10 hover:text-primary'
              }`}
            >
              <Link to={item.path}>
                <IconComponent className="mr-3 h-4 w-4" />
                {item.label}
                {active && (
                  <Badge variant="secondary" className="ml-auto bg-primary-foreground/20">
                    Active
                  </Badge>
                )}
              </Link>
            </Button>
          );
        })}
      </div>

      {/* User Section */}
      <div className="pt-4 border-t border-border/50">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Account
        </div>
        
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-primary/10 hover:text-primary"
            asChild
          >
            <Link to="/settings">
              <Settings className="mr-3 h-4 w-4" />
              Settings
            </Link>
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="w-full justify-start hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className="mt-4 px-3 py-2 bg-muted/30 rounded-md">
            <p className="text-xs font-medium truncate">{user.email}</p>
            <p className="text-xs text-muted-foreground">Sacred Seeker</p>
          </div>
        )}
      </div>
    </nav>
  );
};