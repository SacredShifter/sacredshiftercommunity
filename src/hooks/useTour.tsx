import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TourStep {
  target: string;
  content: string;
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  disableBeacon?: boolean;
  disableOverlayClose?: boolean;
  hideCloseButton?: boolean;
  hideFooter?: boolean;
  spotlightClicks?: boolean;
  styles?: any;
}

export interface TourConfig {
  id: string;
  steps: TourStep[];
  continuous?: boolean;
  showProgress?: boolean;
  showSkipButton?: boolean;
  disableOverlay?: boolean;
  disableScrolling?: boolean;
}

export const useTour = () => {
  const { user } = useAuth();
  const [activeTour, setActiveTour] = useState<TourConfig | null>(null);
  const [tourIndex, setTourIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedTours, setCompletedTours] = useState<string[]>([]);

  // Load completed tours from user profile
  useEffect(() => {
    const loadCompletedTours = async () => {
      if (!user) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', user.id)
          .single();

        // Simplified - no tour progress tracking in profiles for now
        // if (profile && (profile as any).tour_progress) {
        //   setCompletedTours((profile as any).tour_progress as string[]);
        // }
      } catch (error) {
        console.error('Error loading tour progress:', error);
      }
    };

    loadCompletedTours();
  }, [user]);

  // Save completed tour to user profile
  const saveTourCompletion = useCallback(async (tourId: string) => {
    if (!user) return;

    const updatedTours = [...completedTours, tourId];
    setCompletedTours(updatedTours);

    try {
      await supabase
        .from('profiles')
        .update({ display_name: user.email?.split('@')[0] || 'Sacred Seeker' })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error saving tour progress:', error);
    }
  }, [user, completedTours]);

  // Start a tour
  const startTour = useCallback((config: TourConfig, force = false) => {
    if (!force && completedTours.includes(config.id)) {
      return; // Don't start if already completed
    }

    setActiveTour(config);
    setTourIndex(0);
    setIsRunning(true);
  }, [completedTours]);

  const stopTour = useCallback(() => {
    setIsRunning(false);
    setActiveTour(null);
    setTourIndex(0);
    
    // Clean up any tour-related body styles
    setTimeout(() => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 100);
  }, []);

  // Handle tour completion
  const completeTour = useCallback(() => {
    if (activeTour) {
      saveTourCompletion(activeTour.id);
    }
    stopTour();
  }, [activeTour, saveTourCompletion, stopTour]);

  // Skip tour (mark as completed but don't show again)
  const skipTour = useCallback(() => {
    if (activeTour) {
      saveTourCompletion(activeTour.id);
    }
    stopTour();
  }, [activeTour, saveTourCompletion, stopTour]);

  // Reset all tours (for testing or user request)
  const resetAllTours = useCallback(async () => {
    if (!user) return;

    setCompletedTours([]);
    
    try {
      await supabase
        .from('profiles')
        .update({ display_name: user.email?.split('@')[0] || 'Sacred Seeker' })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error resetting tour progress:', error);
    }
  }, [user]);

  // Check if a tour has been completed
  const isTourCompleted = useCallback((tourId: string) => {
    return completedTours.includes(tourId);
  }, [completedTours]);

  // Tour callback handlers
  const handleTourCallback = useCallback((data: any) => {
    const { action, index, type, status } = data;

    if (type === 'step:after' || type === 'target:not-found') {
      setTourIndex(index + (action === 'prev' ? -1 : 1));
    } else if (type === 'finished') {
      completeTour();
    } else if (type === 'skipped') {
      skipTour();
    } else if (action === 'close' || action === 'skip') {
      skipTour();
    }
  }, [completeTour, skipTour]);

  return {
    // State
    activeTour,
    tourIndex,
    isRunning,
    completedTours,
    
    // Actions
    startTour,
    stopTour,
    completeTour,
    skipTour,
    resetAllTours,
    isTourCompleted,
    handleTourCallback,
  };
};