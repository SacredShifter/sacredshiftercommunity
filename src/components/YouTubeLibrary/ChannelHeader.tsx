import React from 'react';
import { motion } from 'framer-motion';
import { Users, Video } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { YouTubeChannel } from '@/types/youtube';
import { Skeleton } from '@/components/ui/skeleton';

interface ChannelHeaderProps {
  channel: YouTubeChannel | null;
  loading?: boolean;
}

export const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channel, loading = false }) => {
  const formatSubscriberCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <Card className="w-full bg-background/60 backdrop-blur-sm border-border/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Skeleton className="w-24 h-24 rounded-full shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-full max-w-2xl" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!channel) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-background/60 backdrop-blur-sm border-border/30 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Channel Avatar */}
            <motion.img
              src={channel.thumbnail}
              alt={channel.title}
              className="w-24 h-24 rounded-full object-cover shrink-0 border-2 border-primary/20"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Channel Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {channel.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed line-clamp-3">
                  {channel.description}
                </p>
              </div>
              
              {/* Channel Stats */}
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {formatSubscriberCount(channel.subscriberCount)} subscribers
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  {parseInt(channel.videoCount).toLocaleString()} videos
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};