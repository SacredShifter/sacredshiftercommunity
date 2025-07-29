import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Clock, BookOpen, Headphones, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VideoPlayerModalProps } from '@/types/youtube';
import { cn } from '@/lib/utils';

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  isOpen,
  onClose,
  onWatchLater,
  onFavorite,
  userMetadata
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // YouTube embed URL with clean parameters
  const embedUrl = video ? 
    `https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1&enablejsapi=1&origin=${window.location.origin}` : 
    '';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: string) => {
    const num = parseInt(views);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const openOnYouTube = () => {
    if (video) {
      window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
    }
  };

  if (!video) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-6xl w-full max-h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-md border-border/30" aria-describedby="video-description">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <DialogHeader className="p-6 pb-4 border-b border-border/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl font-semibold leading-tight line-clamp-2 text-foreground">
                      {video.title}
                    </DialogTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{formatViews(video.viewCount)} views</span>
                      <span>•</span>
                      <span>{formatDate(video.publishedAt)}</span>
                      <span>•</span>
                      <Badge variant="secondary" className="font-mono">
                        {video.duration}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="shrink-0 ml-4"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              {/* Video Player */}
              <div className="flex-1 flex flex-col lg:flex-row">
                <div className="flex-1 bg-black">
                  <div className="relative w-full h-full min-h-[300px]">
                    <iframe
                      ref={iframeRef}
                      src={embedUrl}
                      title={video.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 bg-background/50 backdrop-blur-sm border-l border-border/30 flex flex-col">
                  {/* Action Buttons */}
                  <div className="p-4 border-b border-border/30">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <Button
                        variant={userMetadata?.is_favorite ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFavorite(video.id)}
                        className={cn(
                          "transition-colors",
                          userMetadata?.is_favorite && "bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30"
                        )}
                      >
                        <Heart className={cn("h-4 w-4 mr-2", userMetadata?.is_favorite && "fill-current")} />
                        Favorite
                      </Button>
                      
                      <Button
                        variant={userMetadata?.is_watch_later ? "default" : "outline"}
                        size="sm"
                        onClick={() => onWatchLater(video.id)}
                        className={cn(
                          "transition-colors",
                          userMetadata?.is_watch_later && "bg-primary/20 border-primary/50"
                        )}
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Later
                      </Button>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Integration CTAs */}
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Reflect in Mirror Journal
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left"
                      >
                        <Headphones className="h-4 w-4 mr-2" />
                        Add to Sonic Shifter
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openOnYouTube}
                        className="w-full justify-start text-left"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open on YouTube
                      </Button>
                    </div>
                  </div>

                  {/* Video Description */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p id="video-description" className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {video.description || 'No description available.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};