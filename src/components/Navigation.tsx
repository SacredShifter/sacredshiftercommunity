import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Rss, MessageSquare, Users, BookOpen, Video, 
  Database, Archive, Scroll, Heart, Settings, HelpCircle, Sparkles
} from 'lucide-react';

export const Navigation = () => {
  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      dataTour: 'nav-home'
    },
    { 
      path: '/feed', 
      label: 'Sacred Feed', 
      icon: Rss,
      dataTour: 'nav-feed'
    },
    { 
      path: '/messages', 
      label: 'Messages', 
      icon: MessageSquare,
      dataTour: 'nav-messages'
    },
    { 
      path: '/circles', 
      label: 'Sacred Circles', 
      icon: Users,
      dataTour: 'nav-circles'
    },
    { 
      path: '/journal', 
      label: 'Mirror Journal', 
      icon: BookOpen,
      dataTour: 'nav-journal'
    },
    { 
      path: '/video-library', 
      label: 'YouTube Library', 
      icon: Video,
      dataTour: 'nav-video-library'
    },
    { 
      path: '/registry', 
      label: 'Registry of Resonance', 
      icon: Database,
      dataTour: 'nav-registry'
    },
    { 
      path: '/codex', 
      label: 'Personal Codex', 
      icon: Archive,
      dataTour: 'nav-codex'
    },
    { 
      path: '/guidebook', 
      label: 'Guidebook', 
      icon: Scroll,
      dataTour: 'nav-guidebook'
    },
    { 
      path: '/ai-assistant', 
      label: 'AI Assistant', 
      icon: Sparkles,
      dataTour: 'nav-ai-assistant'
    },
    { 
      path: '/support', 
      label: 'Support', 
      icon: Heart,
      dataTour: 'nav-support'
    },
  ];

  const bottomNavItems = [
    { 
      path: '/settings', 
      label: 'Settings', 
      icon: Settings,
      dataTour: 'nav-settings'
    },
    { 
      path: '/help', 
      label: 'Help', 
      icon: HelpCircle,
      dataTour: 'nav-help'
    },
  ];

  return (
    <nav className="flex flex-col justify-between h-full" data-tour="navigation-sidebar">
      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            data-tour={item.dataTour}
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${isActive 
                ? 'bg-primary/20 text-primary' 
                : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'}
            `}
          >
            <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="space-y-1 pt-4 border-t border-border/30 mt-4">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            data-tour={item.dataTour}
            className={({ isActive }) => `
              flex items-center px-3 py-2 rounded-lg text-sm font-medium
              transition-colors duration-200
              ${isActive 
                ? 'bg-primary/20 text-primary' 
                : 'text-foreground/70 hover:text-foreground hover:bg-primary/10'}
            `}
          >
            <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};