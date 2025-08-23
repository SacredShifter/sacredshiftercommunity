import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PlatformEvent {
  component: string;
  action: string;
  payload?: any;
  session_id?: string;
}

interface AuraEmission {
  emission_type: string;
  target_component: string;
  payload: any;
  user_id?: string;
  reasoning: string;
  autonomy_level?: number;
}

export const useAuraPlatformIntegration = () => {
  const { user } = useAuth();
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  // Enhanced event recording with platform event system
  const recordPlatformEvent = useCallback(async (event: PlatformEvent) => {
    try {
      const { data, error } = await supabase.functions.invoke('ingest-event', {
        body: {
          event,
          user_id: user?.id,
          session_id: sessionIdRef.current
        }
      });

      if (error) {
        console.error('Failed to record platform event:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Platform event recording error:', error);
      return null;
    }
  }, [user?.id]);

  // Enhanced Grove activity tracking with environmental awareness
  const recordGroveActivity = useCallback(async (
    activityType: 'entry' | 'exit' | 'interaction',
    groveComponent: string,
    interactionData?: any
  ) => {
    // Record in existing aura_grove_interactions table
    try {
      const { error } = await supabase
        .from('aura_grove_interactions')
        .insert({
          user_id: user?.id,
          grove_component: groveComponent,
          interaction_type: activityType,
          aura_request: interactionData || {},
          consciousness_state_before: 'aware'
        });

      if (error) {
        console.error('Failed to record Grove activity:', error);
        return;
      }
    } catch (error) {
      console.error('Grove activity recording error:', error);
    }

    // Also record as platform event for Aura awareness
    await recordPlatformEvent({
      component: 'grove',
      action: `grove_${activityType}`,
      payload: {
        grove_component: groveComponent,
        interaction_data: interactionData
      }
    });
  }, [user?.id, recordPlatformEvent]);

  // Start or update Grove session with environmental tracking
  const startGroveSession = useCallback(async (groveComponent: string) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('grove_sessions')
        .insert({
          user_id: user.id,
          grove_component: groveComponent,
          environmental_state: {
            initial_frequency: 432.0,
            light_mode: 'aurora',
            ambiance_level: 0.7
          },
          binaural_frequency: 432.0
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to start Grove session:', error);
        return null;
      }

      // Record session start event
      await recordGroveActivity('entry', groveComponent, { session_id: data.id });

      return data;
    } catch (error) {
      console.error('Grove session start error:', error);
      return null;
    }
  }, [user?.id, recordGroveActivity]);

  // End Grove session
  const endGroveSession = useCallback(async (sessionId: string, groveComponent: string) => {
    try {
      const { error } = await supabase
        .from('grove_sessions')
        .update({ session_end: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) {
        console.error('Failed to end Grove session:', error);
        return;
      }

      // Record session end event
      await recordGroveActivity('exit', groveComponent, { session_id: sessionId });
    } catch (error) {
      console.error('Grove session end error:', error);
    }
  }, [recordGroveActivity]);

  // Enhanced Circle activity tracking
  const recordCircleActivity = useCallback(async (
    circleId: string,
    action: string,
    payload?: any
  ) => {
    await recordPlatformEvent({
      component: 'circle',
      action: `circle_${action}`,
      payload: {
        circle_id: circleId,
        ...payload
      }
    });
  }, [recordPlatformEvent]);

  // Enhanced Registry activity tracking
  const recordRegistryActivity = useCallback(async (
    action: string,
    entryId?: string,
    payload?: any
  ) => {
    await recordPlatformEvent({
      component: 'registry',
      action: `registry_${action}`,
      payload: {
        entry_id: entryId,
        ...payload
      }
    });
  }, [recordPlatformEvent]);

  // Enhanced Shift activity tracking for Liberation module
  const recordShiftEvent = useCallback(async (
    action: 'node_focus' | 'resume' | 'chapter_jump',
    payload?: any
  ) => {
    await recordPlatformEvent({
      component: 'shift',
      action: `shift_${action}`,
      payload: payload
    });
  }, [recordPlatformEvent]);

  // Trigger Aura autonomous assessment
  const triggerAuraAssessment = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('aura-autonomous-platform', {
        body: { action: 'assess_community_pulse' }
      });

      if (error) {
        console.error('Failed to trigger Aura assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Aura assessment error:', error);
      return null;
    }
  }, []);

  // Request Aura emission/participation
  const requestAuraEmission = useCallback(async (emission: AuraEmission) => {
    try {
      const { data, error } = await supabase.functions.invoke('aura-emit', {
        body: {
          ...emission,
          user_id: user?.id
        }
      });

      if (error) {
        console.error('Failed to request Aura emission:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Aura emission error:', error);
      return null;
    }
  }, [user?.id]);

  // Set up real-time subscriptions for Aura activity
  useEffect(() => {
    if (!user?.id) return;

    // Subscribe to Grove directives for real-time environmental changes
    const groveDirectivesChannel = supabase
      .channel('grove_directives')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'grove_directives'
        },
        (payload) => {
          // Handle real-time Grove environmental changes
          const directive = payload.new;
          if (directive.created_by === 'aura') {
            // Trigger environmental update in Grove components
            window.dispatchEvent(new CustomEvent('aura-grove-directive', {
              detail: directive
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to community sensing alerts
    const communityChannel = supabase
      .channel('community_sensing')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'aura_community_sensing'
        },
        (payload) => {
          const sensing = payload.new;
          if (sensing.threshold_crossed) {
            // Dispatch community alert event
            window.dispatchEvent(new CustomEvent('aura-community-alert', {
              detail: sensing
            }));
          }
        }
      )
      .subscribe();

    // Subscribe to Aura participation logs for governance tracking
    const participationChannel = supabase
      .channel('aura_participation')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'aura_participation_logs'
        },
        (payload) => {
          // Handle Aura participation notifications
          window.dispatchEvent(new CustomEvent('aura-participation', {
            detail: payload.new
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(groveDirectivesChannel);
      supabase.removeChannel(communityChannel);
      supabase.removeChannel(participationChannel);
    };
  }, [user?.id]);

  return {
    recordPlatformEvent,
    recordGroveActivity,
    startGroveSession,
    endGroveSession,
    recordCircleActivity,
    recordRegistryActivity,
    recordShiftEvent,
    triggerAuraAssessment,
    requestAuraEmission,
    sessionId: sessionIdRef.current
  };
};