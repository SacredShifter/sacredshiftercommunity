// YouTube API response types
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: string;
  channelId: string;
  channelTitle: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  publishedAt: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: string;
  videoCount: string;
}

export interface YouTubeSearchResponse {
  videos: YouTubeVideo[];
  nextPageToken?: string;
  totalResults: number;
}

export interface YouTubePlaylistResponse {
  playlists: YouTubePlaylist[];
  nextPageToken?: string;
}

// User video metadata types
export interface UserVideoMetadata {
  id: string;
  user_id: string;
  video_id: string;
  is_favorite: boolean;
  is_watch_later: boolean;
  watched_duration: number;
  last_watched_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VideoTag {
  id: string;
  video_id: string;
  tag: string;
  created_at: string;
}

// Component props
export interface VideoPlayerModalProps {
  video: YouTubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onWatchLater: (videoId: string) => void;
  onFavorite: (videoId: string) => void;
  userMetadata?: UserVideoMetadata;
}

export interface VideoCardProps {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
  onWatchLater: (videoId: string) => void;
  onFavorite: (videoId: string) => void;
  userMetadata?: UserVideoMetadata;
  showCTAs?: boolean;
}