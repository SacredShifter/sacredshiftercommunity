import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface TourConfig {
  id: string;
  continuous?: boolean;
  showProgress?: boolean;
  showSkipButton?: boolean;
  disableOverlay?: boolean;
  steps: {
    target: string;
    content: string;
    title?: string;
    placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
    disableBeacon?: boolean;
  }[];
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
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('completed_tours')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading tour progress:', error);
          return;
        }
        
        if (profile && profile.completed_tours) {
          setCompletedTours(profile.completed_tours as string[]);
        }
      } catch (error) {
        console.error('Error loading tour progress:', error);
      }
    };

    loadCompletedTours();
  }, [user]);

  // Save completed tour to user profile
  const saveTourCompletion = useCallback(async (tourId: string) => {
    if (!user) return;

    const updatedTours = Array.from(new Set([...completedTours, tourId]));
    setCompletedTours(updatedTours);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ completed_tours: updatedTours })
        .eq('id', user.id);

      if (error) {
        console.error('Error saving tour progress:', error);
      }
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
      const { error } = await supabase
        .from('profiles')
        .update({ completed_tours: [] })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error resetting tour progress:', error);
      }
    } catch (error) {
      console.error('Error resetting tour progress:', error);
    }
  }, [user]);

  // Check if a tour has been completed
  const isTourCompleted = useCallback((tourId: string) => {
    return completedTours.includes(tourId);
  }, [completedTours]);

  return {
    activeTour,
    tourIndex,
    isRunning,
    completedTours,
    startTour,
    stopTour,
    completeTour,
    skipTour,
    resetAllTours,
    isTourCompleted,
    setTourIndex
  };
};