import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Pin, 
  Lock, 
  Users, 
  Globe, 
  Sparkles,
  Calendar,
  Eye,
  Share2,
  Bookmark,
  Clock,
  Heart,
  MessageCircle,
  MoreVertical
} from 'lucide-react';
import { RegistryEntry, useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

interface RegistryEntryCardProps {
  entry: RegistryEntry;
  onClick: () => void;
}

export function RegistryEntryCard({ entry, onClick }: RegistryEntryCardProps) {
  const { user } = useAuth();
  const { toggleResonance, getUserResonanceStatus, shareToCircle } = useRegistryOfResonance();
  const [hasResonated, setHasResonated] = useState(false);
  const [resonanceCount, setResonanceCount] = useState(entry.resonance_count || 0);

  useEffect(() => {
    if (user && entry.id) {
      getUserResonanceStatus(entry.id).then(setHasResonated);
    }
  }, [entry.id, user, getUserResonanceStatus]);

  const handleResonanceClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newResonanceState = await toggleResonance(entry.id);
    setHasResonated(newResonanceState);
    setResonanceCount(prev => newResonanceState ? prev + 1 : prev - 1);
  };

  const getAccessIcon = () => {
    switch (entry.access_level) {
      case 'Private':
        return <Lock className="w-3 h-3 text-muted-foreground" />;
      case 'Circle':
        return <Users className="w-3 h-3 text-blue-500" />;
      case 'Public':
        return <Globe className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const getResonanceColor = () => {
    return entry.resonance_rating >= 80 ? 'text-green-500 border-green-500/20 bg-green-500/10' : 
           entry.resonance_rating >= 60 ? 'text-blue-500 border-blue-500/20 bg-blue-500/10' : 
           entry.resonance_rating >= 40 ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' : 'text-orange-500 border-orange-500/20 bg-orange-500/10';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const engagementMetrics = entry.engagement_metrics as Record<string, number> || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -2,
        boxShadow: "0 10px 25px -5px hsl(var(--primary) / 0.15)"
      }}
      className="group cursor-pointer"
    >
      <Card className="relative overflow-hidden border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 hover:border-primary/20 transition-all duration-300 h-full">
        <CardHeader className="pb-2 space-y-2">
          {/* Top row with badges and actions */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              {entry.is_pinned && <Pin className="w-3 h-3 text-amber-500 fill-current" />}
              {entry.is_verified && <CheckCircle className="w-3 h-3 text-green-500 fill-current" />}
              {getAccessIcon()}
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5">
                {entry.entry_type}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={cn("text-xs font-semibold px-2 py-1 rounded-md border", getResonanceColor())}>
                {entry.resonance_rating}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onClick}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    Share to Circle
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Title and description */}
          <div onClick={onClick}>
            <CardTitle className="text-sm leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
              {entry.title}
            </CardTitle>
            
            <CardDescription className="text-xs line-clamp-3 leading-relaxed">
              {entry.content}
            </CardDescription>
          </div>

          {/* Tags */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5 h-4">
                  {tag}
                </Badge>
              ))}
              {entry.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5 h-4">
                  +{entry.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0 pb-3">
          {/* Metadata row */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(entry.created_at)}
              </span>
              
              {entry.reading_time_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {entry.reading_time_minutes}m
                </span>
              )}
            </div>
            
            {entry.resonance_signature && (
              <span className="flex items-center gap-1 font-mono text-xs opacity-60">
                <Sparkles className="w-3 h-3" />
                {entry.resonance_signature.slice(-6)}
              </span>
            )}
          </div>

          {/* Interaction buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResonanceClick}
                className={cn(
                  "h-6 px-2 gap-1 text-xs",
                  hasResonated ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
                )}
              >
                <Heart className={cn("w-3 h-3", hasResonated && "fill-current")} />
                {resonanceCount}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClick}
                className="h-6 px-2 gap-1 text-xs text-muted-foreground hover:text-blue-500"
              >
                <MessageCircle className="w-3 h-3" />
                0
              </Button>
            </div>
            
            {/* Engagement metrics */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {engagementMetrics.views > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {engagementMetrics.views}
                </span>
              )}
              
              {engagementMetrics.shares > 0 && (
                <span className="flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  {engagementMetrics.shares}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}