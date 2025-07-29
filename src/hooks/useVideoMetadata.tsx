import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserVideoMetadata, VideoTag } from '@/types/youtube';
import { useToast } from '@/hooks/use-toast';

export const useVideoMetadata = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metadata, setMetadata] = useState<Record<string, UserVideoMetadata>>({});
  const [tags, setTags] = useState<Record<string, VideoTag[]>>({});
  const [loading, setLoading] = useState(false);

  // Fetch user video metadata
  const fetchMetadata = useCallback(async (videoIds?: string[]) => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('user_video_metadata')
        .select('*')
        .eq('user_id', user.id);

      if (videoIds) {
        query = query.in('video_id', videoIds);
      }

      const { data, error } = await query;

      if (error) throw error;

      const metadataMap: Record<string, UserVideoMetadata> = {};
      data.forEach(item => {
        metadataMap[item.video_id] = item;
      });

      setMetadata(prevMetadata => ({ ...prevMetadata, ...metadataMap }));
    } catch (error) {
      console.error('Error fetching video metadata:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load video preferences"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Fetch video tags
  const fetchTags = useCallback(async (videoIds?: string[]) => {
    try {
      let query = supabase
        .from('video_tags')
        .select('*');

      if (videoIds) {
        query = query.in('video_id', videoIds);
      }

      const { data, error } = await query;

      if (error) throw error;

      const tagsMap: Record<string, VideoTag[]> = {};
      data.forEach(tag => {
        if (!tagsMap[tag.video_id]) {
          tagsMap[tag.video_id] = [];
        }
        tagsMap[tag.video_id].push(tag);
      });

      setTags(prevTags => ({ ...prevTags, ...tagsMap }));
    } catch (error) {
      console.error('Error fetching video tags:', error);
    }
  }, []);

  // Update or create metadata
  const updateMetadata = useCallback(async (
    videoId: string,
    updates: Partial<Omit<UserVideoMetadata, 'id' | 'user_id' | 'video_id' | 'created_at' | 'updated_at'>>
  ) => {
    if (!user) return;

    try {
      const existing = metadata[videoId];
      
      if (existing) {
        const { error } = await supabase
          .from('user_video_metadata')
          .update(updates)
          .eq('id', existing.id);

        if (error) throw error;

        setMetadata(prev => ({
          ...prev,
          [videoId]: { ...existing, ...updates }
        }));
      } else {
        const { data, error } = await supabase
          .from('user_video_metadata')
          .insert({
            user_id: user.id,
            video_id: videoId,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;

        setMetadata(prev => ({
          ...prev,
          [videoId]: data
        }));
      }
    } catch (error) {
      console.error('Error updating video metadata:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update video preferences"
      });
    }
  }, [user, metadata, toast]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (videoId: string) => {
    const current = metadata[videoId];
    const newValue = !current?.is_favorite;
    
    await updateMetadata(videoId, { is_favorite: newValue });
    
    toast({
      title: newValue ? "Added to Favorites" : "Removed from Favorites",
      description: newValue ? "Video saved to your favorites" : "Video removed from favorites"
    });
  }, [metadata, updateMetadata, toast]);

  // Toggle watch later
  const toggleWatchLater = useCallback(async (videoId: string) => {
    const current = metadata[videoId];
    const newValue = !current?.is_watch_later;
    
    await updateMetadata(videoId, { is_watch_later: newValue });
    
    toast({
      title: newValue ? "Added to Watch Later" : "Removed from Watch Later",
      description: newValue ? "Video saved to watch later" : "Video removed from watch later"
    });
  }, [metadata, updateMetadata, toast]);

  // Update watched duration
  const updateWatchedDuration = useCallback(async (videoId: string, duration: number) => {
    await updateMetadata(videoId, { 
      watched_duration: duration, 
      last_watched_at: new Date().toISOString() 
    });
  }, [updateMetadata]);

  // Get favorites
  const getFavorites = useCallback(() => {
    return Object.values(metadata).filter(m => m.is_favorite);
  }, [metadata]);

  // Get watch later
  const getWatchLater = useCallback(() => {
    return Object.values(metadata).filter(m => m.is_watch_later);
  }, [metadata]);

  // Load initial metadata when user changes
  useEffect(() => {
    if (user) {
      fetchMetadata();
      fetchTags();
    }
  }, [user, fetchMetadata, fetchTags]);

  return {
    metadata,
    tags,
    loading,
    fetchMetadata,
    fetchTags,
    updateMetadata,
    toggleFavorite,
    toggleWatchLater,
    updateWatchedDuration,
    getFavorites,
    getWatchLater,
  };
};