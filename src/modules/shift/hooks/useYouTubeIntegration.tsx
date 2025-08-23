import { useEffect, useRef } from 'react';
import { useShiftStore } from '../state/useShiftStore';
import { YouTubePlayerRef } from '@/components/media/YouTubePlayer';
import { COSMOGRAM } from '@/config/mediaMaps';

export const useYouTubeIntegration = () => {
  const playerRef = useRef<YouTubePlayerRef>(null);
  const { activeNode, playbackMode, volume } = useShiftStore();

  // Handle chapter changes
  useEffect(() => {
    if (activeNode && playerRef.current && playbackMode !== 'paused') {
      playerRef.current.seekToChapter(activeNode);
      playerRef.current.play();
    }
  }, [activeNode, playbackMode]);

  // Handle volume changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  // Handle playback mode changes
  useEffect(() => {
    if (playerRef.current) {
      if (playbackMode === 'paused') {
        playerRef.current.pause();
      } else if (playbackMode === 'all') {
        playerRef.current.seekToChapter('all');
        playerRef.current.play();
      }
    }
  }, [playbackMode]);

  // Listen for chapter jump events
  useEffect(() => {
    const handleChapterJump = (event: CustomEvent) => {
      const { node } = event.detail;
      if (node && playerRef.current) {
        playerRef.current.seekToChapter(node);
        
        // Auto-play if not paused
        if (useShiftStore.getState().playbackMode !== 'paused') {
          playerRef.current.play();
        }
      }
    };

    window.addEventListener('shift:chapterJump', handleChapterJump as EventListener);
    return () => {
      window.removeEventListener('shift:chapterJump', handleChapterJump as EventListener);
    };
  }, []);

  const handlePlayerReady = () => {
    console.log('YouTube player ready for Shift module');
  };

  const handleStateChange = (state: number) => {
    // YouTube player states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
    if (state === 0) { // ended
      // Could loop the current chapter or move to next
      console.log('Video ended');
    }
  };

  return {
    playerRef,
    handlePlayerReady,
    handleStateChange
  };
};