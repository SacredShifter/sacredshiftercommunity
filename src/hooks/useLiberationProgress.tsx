import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface LiberationSession {
  id?: string;
  user_id: string;
  session_id: string;
  current_scene: string;
  completed_phases: string[];
  comfort_settings: {
    motionReduced: boolean;
    volumeLevel: number;
    vignetteEnabled: boolean;
    fovClamped: boolean;
  };
  reflection_notes?: string;
  start_time: string;
  end_time?: string;
  arousal_level: number;
  created_at?: string;
  updated_at?: string;
}

export const useLiberationProgress = (sessionId: string) => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<LiberationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing session
  const loadSession = async () => {
    if (!user || !sessionId) {
      console.log('Liberation Progress: No user or sessionId', { user: !!user, sessionId });
      return;
    }

    try {
      console.log('Liberation Progress: Loading session', { userId: user.id, sessionId });
      setLoading(true);
      const { data, error } = await supabase
        .from('liberation_sessions' as any)
        .select('*')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .maybeSingle();

      console.log('Liberation Progress: Query result', { data, error });

      if (error && error.code !== 'PGRST116') {
        console.error('Liberation Progress: Database error', error);
        throw error;
      }

      setCurrentSession(data as unknown as LiberationSession | null);
      console.log('Liberation Progress: Session loaded', data);
    } catch (err) {
      console.error('Error loading liberation session:', err);
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  // Save session progress
  const saveProgress = async (updates: Partial<LiberationSession>) => {
    if (!user || !sessionId) return;

    try {
      const sessionData: Partial<LiberationSession> = {
        ...updates,
        user_id: user.id,
        session_id: sessionId,
        updated_at: new Date().toISOString(),
      };

      if (currentSession) {
        // Update existing session
        const { error } = await supabase
          .from('liberation_sessions' as any)
          .update(sessionData)
          .eq('id', currentSession.id);

        if (error) throw error;

        setCurrentSession(prev => prev ? { ...prev, ...sessionData } : null);
      } else {
        // Create new session
        const newSession: Omit<LiberationSession, 'id' | 'created_at' | 'updated_at'> = {
          user_id: user.id,
          session_id: sessionId,
          current_scene: 'intro',
          completed_phases: [],
          comfort_settings: {
            motionReduced: false,
            volumeLevel: 0.7,
            vignetteEnabled: true,
            fovClamped: false,
          },
          start_time: new Date().toISOString(),
          arousal_level: 0,
          ...updates,
        };

        const { data, error } = await supabase
          .from('liberation_sessions' as any)
          .insert(newSession)
          .select()
          .maybeSingle();

        if (error) throw error;

        setCurrentSession(data as unknown as LiberationSession | null);
      }
    } catch (err) {
      console.error('Error saving liberation progress:', err);
      setError(err instanceof Error ? err.message : 'Failed to save progress');
    }
  };

  // Mark phase as completed
  const completePhase = async (phase: string) => {
    if (!currentSession) return;

    const updatedPhases = [...currentSession.completed_phases];
    if (!updatedPhases.includes(phase)) {
      updatedPhases.push(phase);
    }

    await saveProgress({
      completed_phases: updatedPhases,
      current_scene: phase,
    });
  };

  // Complete entire session
  const completeSession = async (reflectionNotes?: string) => {
    await saveProgress({
      end_time: new Date().toISOString(),
      reflection_notes: reflectionNotes,
      current_scene: 'complete',
    });
  };

  // Update comfort settings
  const updateComfortSettings = async (settings: Partial<LiberationSession['comfort_settings']>) => {
    if (!currentSession) return;

    const updatedSettings = {
      ...currentSession.comfort_settings,
      ...settings,
    };

    await saveProgress({
      comfort_settings: updatedSettings,
    });
  };

  // Update arousal level
  const updateArousalLevel = async (level: number) => {
    await saveProgress({
      arousal_level: level,
    });
  };

  // Get user's liberation history
  const getLiberationHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('liberation_sessions' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (err) {
      console.error('Error fetching liberation history:', err);
      return [];
    }
  };

  useEffect(() => {
    loadSession();
  }, [user, sessionId]);

  return {
    currentSession,
    loading,
    error,
    saveProgress,
    completePhase,
    completeSession,
    updateComfortSettings,
    updateArousalLevel,
    getLiberationHistory,
    reload: loadSession,
  };
};