import React from 'react';
import { motion } from 'framer-motion';
import { VideoCard } from './VideoCard';
import { YouTubeVideo, UserVideoMetadata } from '@/types/youtube';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoGridProps {
  videos: YouTubeVideo[];
  loading?: boolean;
  onPlay: (video: YouTubeVideo) => void;
  onWatchLater: (videoId: string) => void;
  onFavorite: (videoId: string) => void;
  metadata: Record<string, UserVideoMetadata>;
  showCTAs?: boolean;
}

const VideoSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="aspect-video w-full rounded-lg" />
    <div className="space-y-2 p-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  </div>
);

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  loading = false,
  onPlay,
  onWatchLater,
  onFavorite,
  metadata,
  showCTAs = true
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-muted-foreground text-lg">
          No videos found
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your search or filters
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <VideoCard
            video={video}
            onPlay={onPlay}
            onWatchLater={onWatchLater}
            onFavorite={onFavorite}
            userMetadata={metadata[video.id]}
            showCTAs={showCTAs}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};