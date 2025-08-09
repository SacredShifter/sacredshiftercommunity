import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, Play, BookOpen, Headphones } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoCardProps } from '@/types/youtube';
import { cn } from '@/lib/utils';

export const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onPlay, 
  onWatchLater, 
  onFavorite, 
  userMetadata,
  showCTAs = true 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatViews = (views: string) => {
    const num = parseInt(views);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="group overflow-hidden bg-background/60 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <motion.img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            whileHover={{ scale: 1.05 }}
          />
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="lg"
              onClick={() => onPlay(video)}
              className="rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg"
            >
              <Play className="h-6 w-6 ml-1" />
            </Button>
          </div>
          
          {/* Duration badge */}
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 right-2 bg-black/70 text-white border-0 font-mono text-xs"
          >
            {video.duration}
          </Badge>
          
          {/* Watch progress indicator */}
          {userMetadata?.watched_duration && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ 
                  width: `${Math.min((userMetadata.watched_duration / 100) * 100, 100)}%` 
                }}
              />
            </div>
          )}
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 
              className="font-semibold text-sm leading-tight line-clamp-2 text-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => onPlay(video)}
            >
              {video.title}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatViews(video.viewCount)} views</span>
              <span>{formatDate(video.publishedAt)}</span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFavorite(video.id)}
                className={cn(
                  "h-8 px-2 transition-colors",
                  userMetadata?.is_favorite 
                    ? "text-red-500 hover:text-red-600" 
                    : "text-muted-foreground hover:text-red-500"
                )}
              >
                <Heart className={cn("h-4 w-4", userMetadata?.is_favorite && "fill-current")} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWatchLater(video.id)}
                className={cn(
                  "h-8 px-2 transition-colors",
                  userMetadata?.is_watch_later 
                    ? "text-primary hover:text-primary/80" 
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
            
            {showCTAs && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-primary transition-colors"
                  title="Reflect in Mirror Journal"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-muted-foreground hover:text-primary transition-colors"
                  title="Add to Sonic Shifter"
                >
                  <Headphones className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};