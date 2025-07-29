import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pin, Share2, Sparkles, Lock, Globe, Users } from 'lucide-react';
import { RegistryEntry } from '@/hooks/useRegistryOfResonance';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RegistryEntryCardProps {
  entry: RegistryEntry;
  onClick: () => void;
}

export function RegistryEntryCard({ entry, onClick }: RegistryEntryCardProps) {
  const getAccessIcon = () => {
    switch (entry.access_level) {
      case 'Public':
        return <Globe className="w-3 h-3" />;
      case 'Circle':
        return <Users className="w-3 h-3" />;
      case 'Private':
        return <Lock className="w-3 h-3" />;
      default:
        return <Lock className="w-3 h-3" />;
    }
  };

  const getResonanceColor = (rating: number) => {
    if (rating >= 80) return 'text-green-500';
    if (rating >= 60) return 'text-blue-500';
    if (rating >= 40) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getResonanceRing = (rating: number) => {
    const circumference = 2 * Math.PI * 20;
    const strokeDasharray = `${(rating / 100) * circumference} ${circumference}`;
    
    return (
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-muted-foreground/20"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className={cn("transition-all duration-500", getResonanceColor(rating))}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-xs font-bold", getResonanceColor(rating))}>
            {rating}
          </span>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card 
        className={cn(
          "cursor-pointer group relative overflow-hidden",
          "hover:shadow-lg transition-all duration-300",
          "border-primary/20 bg-card/50 backdrop-blur-sm",
          entry.is_verified && "ring-1 ring-primary/30",
          entry.is_pinned && "border-yellow-500/50"
        )}
        onClick={onClick}
      >
        {/* Verified glow effect */}
        {entry.is_verified && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-500/10 opacity-50" />
        )}
        
        <CardHeader className="relative">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                  {entry.title}
                </CardTitle>
                {entry.is_pinned && (
                  <Pin className="w-4 h-4 text-yellow-500 fill-current" />
                )}
                {entry.is_verified && (
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs gap-1">
                  {getAccessIcon()}
                  {entry.access_level}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {entry.entry_type}
                </Badge>
              </div>
            </div>
            
            {getResonanceRing(entry.resonance_rating)}
          </div>
          
          <CardDescription className="line-clamp-2 text-sm">
            {entry.content.substring(0, 120)}...
          </CardDescription>
        </CardHeader>

        <CardContent className="relative">
          <div className="space-y-3">
            {/* Tags */}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {entry.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{entry.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Resonance Signature */}
            {entry.resonance_signature && (
              <div className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                {entry.resonance_signature}
              </div>
            )}

            {/* Timestamp */}
            <div className="text-xs text-muted-foreground">
              {new Date(entry.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
}