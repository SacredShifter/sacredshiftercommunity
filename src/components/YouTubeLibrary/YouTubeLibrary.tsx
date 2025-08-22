import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Clock, Play, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useYouTubeAPI } from '@/hooks/useYouTubeAPI';
import { useVideoMetadata } from '@/hooks/useVideoMetadata';
import { YouTubeVideo, YouTubeChannel } from '@/types/youtube';
import { ChannelHeader } from './ChannelHeader';
import { VideoGrid } from './VideoGrid';
import { SimpleVideoModal } from './SimpleVideoModal';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const YouTubeLibrary: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    loading: apiLoading,
    error: apiError,
    getChannelInfo,
    getChannelVideos,
    searchVideos
  } = useYouTubeAPI();

  const {
    metadata,
    loading: metadataLoading,
    toggleFavorite,
    toggleWatchLater,
    getFavorites,
    getWatchLater
  } = useVideoMetadata();

  const [channel, setChannel] = useState<YouTubeChannel | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();

  // Show API key configuration notice
  useEffect(() => {
    if (apiError && apiError.includes('API')) {
      toast({
        variant: "destructive",
        title: "YouTube API Configuration Required",
        description: "Please configure your YouTube API key to access video content."
      });
    }
  }, [apiError, toast]);

  // Load channel info and initial videos
  useEffect(() => {
    const loadInitialData = async () => {
      const channelData = await getChannelInfo();
      if (channelData) {
        setChannel(channelData);
      }

      const videosData = await getChannelVideos();
      setVideos(videosData.videos);
      setNextPageToken(videosData.nextPageToken);
    };

    loadInitialData();
  }, [getChannelInfo, getChannelVideos]);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (query.trim()) {
      const results = await searchVideos(query.trim());
      setVideos(results.videos);
      setNextPageToken(results.nextPageToken);
    } else {
      const videosData = await getChannelVideos();
      setVideos(videosData.videos);
      setNextPageToken(videosData.nextPageToken);
    }
  }, [searchVideos, getChannelVideos]);

  // Handle video play
  const handlePlayVideo = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  // Handle player close
  const handleClosePlayer = () => {
    setIsPlayerOpen(false);
    setSelectedVideo(null);
  };

  // Get filtered videos based on active tab
  const getFilteredVideos = () => {
    switch (activeTab) {
      case 'favorites':
        const favoriteIds = getFavorites().map(m => m.video_id);
        return videos.filter(v => favoriteIds.includes(v.id));
      case 'watchLater':
        const watchLaterIds = getWatchLater().map(m => m.video_id);
        return videos.filter(v => watchLaterIds.includes(v.id));
      default:
        return videos;
    }
  };

  // Sort videos
  const getSortedVideos = (videosToSort: YouTubeVideo[]) => {
    switch (sortBy) {
      case 'title':
        return [...videosToSort].sort((a, b) => a.title.localeCompare(b.title));
      case 'views':
        return [...videosToSort].sort((a, b) => parseInt(b.viewCount) - parseInt(a.viewCount));
      case 'date':
      default:
        return [...videosToSort].sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
    }
  };

  const filteredVideos = getFilteredVideos();
  const sortedVideos = getSortedVideos(filteredVideos);
  const loading = apiLoading || metadataLoading;

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 space-y-6 md:space-y-8 overflow-y-auto -webkit-overflow-scrolling-touch">
      {/* Channel Header */}
      <ChannelHeader channel={channel} loading={loading && !channel} />

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Sacred Shifter videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              className="pl-10 bg-background/60 backdrop-blur-sm border-border/30"
            />
          </div>
          
          <Button onClick={() => handleSearch(searchQuery)} disabled={loading}>
            Search
          </Button>
        </div>

        {/* Tabs and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Grid className="h-4 w-4" />
                All Videos
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="watchLater" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Watch Later
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Added</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="views">View Count</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Video Count */}
      {!loading && (
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-sm">
            {sortedVideos.length} video{sortedVideos.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      )}

      {/* Video Grid */}
      <VideoGrid
        videos={sortedVideos}
        loading={loading}
        onPlay={handlePlayVideo}
        onWatchLater={toggleWatchLater}
        onFavorite={toggleFavorite}
        metadata={metadata}
        showCTAs={true}
      />

      {/* Video Player Modal */}
      <SimpleVideoModal
        video={selectedVideo}
        isOpen={isPlayerOpen}
        onClose={handleClosePlayer}
        onWatchLater={toggleWatchLater}
        onFavorite={toggleFavorite}
        userMetadata={selectedVideo ? metadata[selectedVideo.id] : undefined}
      />

      {/* API Configuration Notice */}
      {!user && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-muted-foreground">
            Please sign in to save your video preferences and access personalized features.
          </p>
        </motion.div>
      )}
    </div>
  );
};