import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFeaturedContent } from '@/hooks/useFeaturedContent';
import { 
  Star, 
  Database, 
  Users, 
  Crown, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const getContentIcon = (contentType: string) => {
  switch (contentType) {
    case 'registry_entry':
      return Database;
    case 'circle':
      return Users;
    case 'grove_session':
      return Crown;
    default:
      return Star;
  }
};

const getContentPath = (contentType: string, contentId?: string) => {
  switch (contentType) {
    case 'registry_entry':
      return contentId ? `/resonance/entries/${contentId}` : '/registry';
    case 'circle':
      return contentId ? `/circles/${contentId}` : '/circles';
    case 'grove_session':
      return '/grove';
    default:
      return '/';
  }
};

export function FeaturedContentSection() {
  const { featuredContent, loading, error } = useFeaturedContent();

  if (loading) {
    return (
      <div className="mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg mb-4 w-48"></div>
          <Card className="backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="h-32 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !featuredContent.length) {
    return null;
  }

  const heroContent = featuredContent.find(content => content.feature_type === 'hero');
  const tiledContent = featuredContent.filter(content => content.feature_type === 'featured_tile').slice(0, 3);

  return (
    <div className="mb-12 space-y-6">
      {/* Hero Featured Content */}
      {heroContent && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Featured by Aura
            </h2>
            <Badge variant="secondary" className="ml-2">
              Latest
            </Badge>
          </div>
          
          <Link to={getContentPath(heroContent.content_type, heroContent.content_id)}>
            <Card className="featured-hero group relative backdrop-blur-xl border-primary/20 hover:border-primary/40 transition-all duration-500 overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
              
              {/* Sacred geometry overlay */}
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                {React.createElement(getContentIcon(heroContent.content_type), { 
                  className: "h-16 w-16 text-primary animate-pulse" 
                })}
              </div>
              
              <CardContent className="relative z-10 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                      {React.createElement(getContentIcon(heroContent.content_type), { 
                        className: "h-6 w-6 text-white" 
                      })}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {heroContent.title}
                      </h3>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {heroContent.content_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                {heroContent.description && (
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                    {heroContent.description}
                  </p>
                )}
                
                <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span>Featured Now</span>
                  </div>
                  {heroContent.featured_until && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                      <span>
                        Until {new Date(heroContent.featured_until).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
      
      {/* Tiled Featured Content */}
      {tiledContent.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiledContent.map((content) => (
            <Link 
              key={content.id} 
              to={getContentPath(content.content_type, content.content_id)}
              className="group"
            >
              <Card className="featured-tile h-full backdrop-blur-xl border-white/20 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300" />
                
                <CardContent className="relative z-10 p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      {React.createElement(getContentIcon(content.content_type), { 
                        className: "h-4 w-4 text-primary" 
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {content.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {content.content_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                  
                  {content.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {content.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}