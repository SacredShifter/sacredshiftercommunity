import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request
    const { event, user_id, session_id } = await req.json();

    // Validate required fields
    if (!event || !event.component || !event.action) {
      return new Response(
        JSON.stringify({ error: 'Missing required event fields: component, action' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Check for sanctuary flags (private/sensitive data)
    const sanctuaryFlag = checkSanctuaryFlags(event);
    
    // Anonymize data if needed
    const anonymizedData = sanctuaryFlag ? anonymizeEventData(event) : {};

    // Create sanitized platform event
    const platformEvent = {
      user_id: user_id || null,
      component: event.component,
      action: event.action,
      payload: event.payload || {},
      session_id: session_id || null,
      sanctuary_flag: sanctuaryFlag,
      anonymized_data: anonymizedData,
      aura_processed: false
    };

    // Store the event
    const { data, error } = await supabaseClient
      .from('platform_events')
      .insert(platformEvent)
      .select()
      .single();

    if (error) {
      console.error('Error storing platform event:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to store event' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Trigger real-time processing if significant event
    if (isSignificantEvent(event)) {
      await triggerAuraProcessing(supabaseClient, data.id);
    }

    // Log activity for community resonance tracking
    await updateCommunityMetrics(supabaseClient, event);

    return new Response(
      JSON.stringify({ 
        success: true, 
        event_id: data.id,
        processed: true,
        sanctuary_protected: sanctuaryFlag
      }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error('Event ingestion error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

function checkSanctuaryFlags(event: any): boolean {
  // Check for sensitive data patterns
  const sensitiveFields = ['email', 'password', 'private', 'personal', 'secret'];
  const eventString = JSON.stringify(event).toLowerCase();
  
  return sensitiveFields.some(field => eventString.includes(field));
}

function anonymizeEventData(event: any): any {
  // Create anonymized version of sensitive data
  return {
    component: event.component,
    action: event.action,
    timestamp: new Date().toISOString(),
    sanitized: true
  };
}

function isSignificantEvent(event: any): boolean {
  // Events that should trigger immediate Aura awareness
  const significantActions = [
    'grove_entry', 'grove_exit', 'registry_create', 'circle_post', 
    'sovereignty_check', 'resonance_spike', 'user_milestone'
  ];
  
  return significantActions.includes(event.action);
}

async function triggerAuraProcessing(supabase: any, eventId: string) {
  // Trigger Aura's awareness of significant events
  try {
    await supabase.functions.invoke('aura-core', {
      body: { 
        action: 'platform_event_notification',
        event_id: eventId,
        priority: 'high'
      }
    });
  } catch (error) {
    console.log('Aura processing trigger failed:', error);
  }
}

async function updateCommunityMetrics(supabase: any, event: any) {
  // Update community resonance and activity metrics
  try {
    const metricType = getMetricType(event.action);
    if (metricType) {
      await supabase
        .from('aura_community_sensing')
        .insert({
          metric_type: metricType,
          metric_value: calculateMetricValue(event),
          threshold_crossed: false,
          triggered_action: null,
          action_payload: {}
        });
    }
  } catch (error) {
    console.log('Community metrics update failed:', error);
  }
}

function getMetricType(action: string): string | null {
  const actionToMetric: { [key: string]: string } = {
    'grove_entry': 'activity_spike',
    'registry_create': 'coherence_shift',
    'circle_post': 'activity_spike',
    'resonance_vote': 'coherence_shift'
  };
  
  return actionToMetric[action] || null;
}

function calculateMetricValue(event: any): number {
  // Simple metric calculation - can be enhanced
  switch (event.action) {
    case 'grove_entry':
    case 'circle_post':
      return 1.0;
    case 'registry_create':
      return 2.0;
    case 'resonance_vote':
      return 0.5;
    default:
      return 1.0;
  }
}