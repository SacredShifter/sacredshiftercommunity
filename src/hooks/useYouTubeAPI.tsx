import { useState, useEffect, useCallback } from 'react';
import { YouTubeVideo, YouTubePlaylist, YouTubeChannel, YouTubeSearchResponse } from '@/types/youtube';

// Note: In production, this should be handled by an edge function to keep the API key secure
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // This will need to be configured as a secret
const SACRED_SHIFTER_CHANNEL_ID = 'YOUR_CHANNEL_ID'; // Replace with actual channel ID
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export const useYouTubeAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDuration = (duration: string): string => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';
    
    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');
    
    let formatted = '';
    if (hours) formatted += `${hours}:`;
    formatted += `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    
    return formatted;
  };

  const makeYouTubeRequest = async (endpoint: string, params: Record<string, string>) => {
    const url = new URL(`${YOUTUBE_API_BASE}/${endpoint}`);
    Object.entries({ ...params, key: YOUTUBE_API_KEY }).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }
    
    return response.json();
  };

  const getChannelInfo = useCallback(async (): Promise<YouTubeChannel | null> => {
    try {
      setLoading(true);
      setError(null);

      const data = await makeYouTubeRequest('channels', {
        part: 'snippet,statistics',
        id: SACRED_SHIFTER_CHANNEL_ID,
      });

      if (!data.items || data.items.length === 0) {
        return null;
      }

      const channel = data.items[0];
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default.url,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch channel info');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getChannelVideos = useCallback(async (
    pageToken?: string,
    maxResults: number = 20
  ): Promise<YouTubeSearchResponse> => {
    try {
      setLoading(true);
      setError(null);

      // First, get the uploads playlist ID
      const channelData = await makeYouTubeRequest('channels', {
        part: 'contentDetails',
        id: SACRED_SHIFTER_CHANNEL_ID,
      });

      if (!channelData.items || channelData.items.length === 0) {
        throw new Error('Channel not found');
      }

      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

      // Get videos from the uploads playlist
      const playlistParams: Record<string, string> = {
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: maxResults.toString(),
      };

      if (pageToken) {
        playlistParams.pageToken = pageToken;
      }

      const playlistData = await makeYouTubeRequest('playlistItems', playlistParams);

      // Get additional video details
      const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
      
      const videoData = await makeYouTubeRequest('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds,
      });

      const videos: YouTubeVideo[] = videoData.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
        publishedAt: video.snippet.publishedAt,
        duration: formatDuration(video.contentDetails.duration),
        viewCount: video.statistics.viewCount,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
      }));

      return {
        videos,
        nextPageToken: playlistData.nextPageToken,
        totalResults: playlistData.pageInfo.totalResults,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch videos');
      return { videos: [], totalResults: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  const getChannelPlaylists = useCallback(async (
    pageToken?: string,
    maxResults: number = 20
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        part: 'snippet,contentDetails',
        channelId: SACRED_SHIFTER_CHANNEL_ID,
        maxResults: maxResults.toString(),
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      const data = await makeYouTubeRequest('playlists', params);

      const playlists: YouTubePlaylist[] = data.items.map((playlist: any) => ({
        id: playlist.id,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        thumbnail: playlist.snippet.thumbnails.high?.url || playlist.snippet.thumbnails.default.url,
        itemCount: playlist.contentDetails.itemCount,
        publishedAt: playlist.snippet.publishedAt,
      }));

      return {
        playlists,
        nextPageToken: data.nextPageToken,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch playlists');
      return { playlists: [] };
    } finally {
      setLoading(false);
    }
  }, []);

  const searchVideos = useCallback(async (
    query: string,
    pageToken?: string,
    maxResults: number = 20
  ): Promise<YouTubeSearchResponse> => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {
        part: 'snippet',
        q: query,
        channelId: SACRED_SHIFTER_CHANNEL_ID,
        type: 'video',
        order: 'date',
        maxResults: maxResults.toString(),
      };

      if (pageToken) {
        params.pageToken = pageToken;
      }

      const searchData = await makeYouTubeRequest('search', params);

      // Get additional video details
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      
      const videoData = await makeYouTubeRequest('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds,
      });

      const videos: YouTubeVideo[] = videoData.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default.url,
        publishedAt: video.snippet.publishedAt,
        duration: formatDuration(video.contentDetails.duration),
        viewCount: video.statistics.viewCount,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
      }));

      return {
        videos,
        nextPageToken: searchData.nextPageToken,
        totalResults: searchData.pageInfo.totalResults,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search videos');
      return { videos: [], totalResults: 0 };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getChannelInfo,
    getChannelVideos,
    getChannelPlaylists,
    searchVideos,
  };
};
