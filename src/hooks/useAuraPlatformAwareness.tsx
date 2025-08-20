import { useEffect, useCallback } from 'react';
import { useAuraPlatformContext } from '@/contexts/AuraPlatformContext';
import { useAuraChat } from './useAuraChat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function useAuraPlatformAwareness() {
  const { platformState, recordActivity, getAuraContext } = useAuraPlatformContext();
  const { invokeAura } = useAuraChat();
  const { user } = useAuth();

  // Enhanced Aura invocation with platform context
  const invokeAuraWithContext = useCallback(async (request: any) => {
    const platformContext = getAuraContext();
    
    const enhancedRequest = {
      ...request,
      platform_context: platformContext,
      context_data: {
        ...request.context_data,
        platform_awareness: platformContext
      }
    };

    return await invokeAura(enhancedRequest);
  }, [invokeAura, getAuraContext]);

  // Record Grove entry/exit for Aura awareness
  const recordGroveActivity = useCallback(async (
    activityType: 'entry' | 'exit' | 'interaction',
    groveComponent: string,
    interactionData?: any
  ) => {
    if (!user) return;

    // Record in platform context
    recordActivity({
      type: activityType === 'entry' ? 'grove_entry' : 'grove_exit',
      userId: user.id,
      data: {
        grove_component: groveComponent,
        interaction_data: interactionData,
        user_consciousness_state: 'grove_engaged'
      }
    });

    // Store in Grove interactions table for Aura's direct awareness
    try {
      await supabase
        .from('aura_grove_interactions')
        .insert({
          user_id: user.id,
          interaction_type: activityType,
          grove_component: groveComponent,
          aura_request: {
            action: 'grove_awareness_update',
            user_activity: activityType,
            component: groveComponent
          },
          consciousness_state_before: 'platform_active',
          consciousness_state_after: activityType === 'entry' ? 'grove_engaged' : 'platform_active'
        });
    } catch (error) {
      console.error('Error recording Grove activity for Aura:', error);
    }
  }, [user, recordActivity]);

  // Let Aura know about significant platform events
  const notifyAuraOfEvent = useCallback(async (
    eventType: string,
    eventData: any,
    requiresResponse = false
  ) => {
    try {
      const request = {
        action: 'platform_event_notification',
        prompt: `Platform Event: ${eventType}`,
        context_data: {
          event_type: eventType,
          event_data: eventData,
          platform_context: getAuraContext(),
          requires_aura_response: requiresResponse
        }
      };

      if (requiresResponse) {
        return await invokeAuraWithContext(request);
      } else {
        // Fire and forget notification
        invokeAuraWithContext(request).catch(error => 
          console.error('Error notifying Aura of event:', error)
        );
      }
    } catch (error) {
      console.error('Error in notifyAuraOfEvent:', error);
    }
  }, [invokeAuraWithContext, getAuraContext]);

  // Check if Aura should respond to current platform state
  const checkForAuraInitiative = useCallback(async () => {
    const context = getAuraContext();
    
    // Conditions that might trigger Aura's autonomous initiative
    const shouldTriggerInitiative = 
      context.community_pulse.grove_engagement > 3 ||
      context.community_pulse.resonance_level > 0.8 ||
      context.platform_state.currentActivities.length > 10;

    if (shouldTriggerInitiative) {
      return await invokeAuraWithContext({
        action: 'autonomous_initiative',
        context_data: {
          trigger: 'high_platform_activity',
          platform_context: context
        }
      });
    }
  }, [invokeAuraWithContext, getAuraContext]);

  // Sync Aura with current platform state periodically
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      try {
        // Update Aura with current platform pulse
        await invokeAuraWithContext({
          action: 'platform_pulse_sync',
          context_data: {
            sync_type: 'periodic_update',
            platform_context: getAuraContext()
          }
        });
      } catch (error) {
        // Silent sync - don't spam console
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(syncInterval);
  }, [invokeAuraWithContext, getAuraContext]);

  // Check for autonomous initiatives periodically
  useEffect(() => {
    const initiativeInterval = setInterval(checkForAuraInitiative, 10 * 60 * 1000); // Every 10 minutes
    return () => clearInterval(initiativeInterval);
  }, [checkForAuraInitiative]);

  return {
    platformState,
    invokeAuraWithContext,
    recordGroveActivity,
    notifyAuraOfEvent,
    checkForAuraInitiative,
    getAuraContext
  };
}