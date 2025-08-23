import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { COSMOGRAM } from '@/config/mediaMaps';

export interface YouTubePlayerRef {
  seekToChapter: (chapter: keyof typeof COSMOGRAM.chapters) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
}

interface YouTubePlayerProps {
  videoId?: string;
  width?: number;
  height?: number;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  ({ videoId = COSMOGRAM.videoId, width = 560, height = 315, onReady, onStateChange }, ref) => {
    const playerRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      seekToChapter: (chapter: keyof typeof COSMOGRAM.chapters) => {
        if (playerRef.current && COSMOGRAM.chapters[chapter] !== undefined) {
          playerRef.current.seekTo(COSMOGRAM.chapters[chapter], true);
        }
      },
      play: () => {
        if (playerRef.current) {
          playerRef.current.playVideo();
        }
      },
      pause: () => {
        if (playerRef.current) {
          playerRef.current.pauseVideo();
        }
      },
      setVolume: (volume: number) => {
        if (playerRef.current) {
          playerRef.current.setVolume(volume * 100);
        }
      },
      getCurrentTime: () => {
        return playerRef.current ? playerRef.current.getCurrentTime() : 0;
      }
    }));

    useEffect(() => {
      // Load YouTube API if not already loaded
      if (!(window as any).YT) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(script);

        (window as any).onYouTubeIframeAPIReady = () => {
          initializePlayer();
        };
      } else {
        initializePlayer();
      }

      function initializePlayer() {
        if (containerRef.current && !playerRef.current) {
          playerRef.current = new (window as any).YT.Player(containerRef.current, {
            width,
            height,
            videoId,
            playerVars: {
              controls: 0,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              iv_load_policy: 3,
              disablekb: 1,
              fs: 0
            },
            events: {
              onReady: (event: any) => {
                onReady?.();
              },
              onStateChange: (event: any) => {
                onStateChange?.(event.data);
              }
            }
          });
        }
      }

      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      };
    }, [videoId, width, height, onReady, onStateChange]);

    return (
      <div 
        ref={containerRef}
        className="youtube-player-container bg-black rounded-lg overflow-hidden"
        style={{ width, height }}
      />
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';