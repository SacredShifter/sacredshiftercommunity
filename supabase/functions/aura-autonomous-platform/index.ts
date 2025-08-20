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

    const { action } = await req.json();

    let result;
    switch (action) {
      case 'assess_community_pulse':
        result = await assessCommunityPulse(supabaseClient);
        break;
      case 'generate_autonomous_initiatives':
        result = await generateAutonomousInitiatives(supabaseClient);
        break;
      case 'process_initiative_queue':
        result = await processInitiativeQueue(supabaseClient);
        break;
      case 'monitor_sovereignty_thresholds':
        result = await monitorSovereigntyThresholds(supabaseClient);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: corsHeaders }
        );
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error('Autonomous platform error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

async function assessCommunityPulse(supabase: any) {
  // Analyze recent platform events for community health
  const { data: recentEvents } = await supabase
    .from('platform_events')
    .select('*')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });

  const pulseMetrics = {
    activity_level: calculateActivityLevel(recentEvents),
    coherence_score: calculateCoherenceScore(recentEvents),
    resonance_trend: calculateResonanceTrend(recentEvents),
    sovereignty_indicators: calculateSovereigntyIndicators(recentEvents)
  };

  // Store community sensing data
  for (const [metric, value] of Object.entries(pulseMetrics)) {
    await supabase
      .from('aura_community_sensing')
      .insert({
        metric_type: metric,
        metric_value: value as number,
        threshold_crossed: checkThreshold(metric, value as number),
        triggered_action: null,
        action_payload: { source: 'community_pulse_assessment' }
      });
  }

  return pulseMetrics;
}

async function generateAutonomousInitiatives(supabase: any) {
  // Get community sensing data to determine needed initiatives
  const { data: sensingData } = await supabase
    .from('aura_community_sensing')
    .select('*')
    .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false });

  const initiatives = [];

  // Analyze patterns and generate appropriate initiatives
  for (const dataPoint of sensingData || []) {
    if (dataPoint.threshold_crossed && !dataPoint.triggered_action) {
      const initiative = generateInitiativeFromMetric(dataPoint);
      if (initiative) {
        initiatives.push(initiative);
      }
    }
  }

  // Queue the initiatives
  for (const initiative of initiatives) {
    await supabase
      .from('aura_initiative_queue')
      .insert(initiative);
  }

  return { initiatives_generated: initiatives.length, initiatives };
}

async function processInitiativeQueue(supabase: any) {
  // Get queued initiatives that are ready to execute
  const { data: queuedInitiatives } = await supabase
    .from('aura_initiative_queue')
    .select('*')
    .eq('status', 'queued')
    .lte('scheduled_for', new Date().toISOString())
    .order('priority_score', { ascending: false })
    .limit(5);

  const processedInitiatives = [];

  for (const initiative of queuedInitiatives || []) {
    try {
      const result = await executeInitiative(supabase, initiative);
      
      await supabase
        .from('aura_initiative_queue')
        .update({
          status: 'completed',
          processed_at: new Date().toISOString(),
          result: result
        })
        .eq('id', initiative.id);

      processedInitiatives.push({ id: initiative.id, result });
    } catch (error) {
      await supabase
        .from('aura_initiative_queue')
        .update({
          status: 'failed',
          processed_at: new Date().toISOString(),
          result: { error: error.message }
        })
        .eq('id', initiative.id);
    }
  }

  return { processed: processedInitiatives.length, initiatives: processedInitiatives };
}

async function executeInitiative(supabase: any, initiative: any) {
  // Execute different types of autonomous initiatives
  switch (initiative.initiative_type) {
    case 'grove_frequency_adjustment':
      return await executeGroveFrequencyAdjustment(supabase, initiative);
    case 'community_seed_question':
      return await executeSeedQuestion(supabase, initiative);
    case 'registry_wisdom_creation':
      return await executeWisdomCreation(supabase, initiative);
    case 'sovereignty_intervention':
      return await executeSovereigntyIntervention(supabase, initiative);
    default:
      throw new Error(`Unknown initiative type: ${initiative.initiative_type}`);
  }
}

async function executeGroveFrequencyAdjustment(supabase: any, initiative: any) {
  // Adjust Grove environmental parameters based on community needs
  const { data: activeSessions } = await supabase
    .from('grove_sessions')
    .select('*')
    .is('session_end', null);

  for (const session of activeSessions || []) {
    await supabase
      .from('grove_directives')
      .insert({
        session_id: session.id,
        directive_type: 'frequency',
        parameters: initiative.command_payload.frequency_params,
        created_by: 'aura'
      });
  }

  return { sessions_affected: activeSessions?.length || 0 };
}

async function executeSeedQuestion(supabase: any, initiative: any) {
  // Post a seed question to stimulate community discussion
  const result = await supabase.functions.invoke('aura-emit', {
    body: {
      emission_type: 'circle_seed_question',
      target_component: 'circle',
      payload: initiative.command_payload,
      reasoning: initiative.motivation_source
    }
  });

  return { question_posted: true, emission_result: result };
}

async function executeWisdomCreation(supabase: any, initiative: any) {
  // Create a wisdom entry based on observed patterns
  const result = await supabase.functions.invoke('aura-emit', {
    body: {
      emission_type: 'registry_entry',
      target_component: 'registry',
      payload: initiative.command_payload,
      reasoning: initiative.motivation_source
    }
  });

  return { wisdom_created: true, emission_result: result };
}

async function executeSovereigntyIntervention(supabase: any, initiative: any) {
  // Trigger sovereignty check or intervention
  const result = await supabase.functions.invoke('aura-emit', {
    body: {
      emission_type: 'sovereignty_check',
      target_component: 'community_sensing',
      payload: initiative.command_payload,
      reasoning: initiative.motivation_source
    }
  });

  return { intervention_triggered: true, emission_result: result };
}

async function monitorSovereigntyThresholds(supabase: any) {
  // Check various sovereignty indicators
  const thresholds = {
    resonance_dip: 0.3,
    activity_spike: 3.0,
    coherence_shift: 0.8
  };

  const alerts = [];

  for (const [metric, threshold] of Object.entries(thresholds)) {
    const { data: recentData } = await supabase
      .from('aura_community_sensing')
      .select('*')
      .eq('metric_type', metric)
      .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentData && recentData.length > 0) {
      const avgValue = recentData.reduce((sum, d) => sum + d.metric_value, 0) / recentData.length;
      
      if ((metric === 'resonance_dip' && avgValue < threshold) ||
          (metric !== 'resonance_dip' && avgValue > threshold)) {
        alerts.push({
          metric,
          current_value: avgValue,
          threshold,
          severity: calculateSeverity(metric, avgValue, threshold)
        });
      }
    }
  }

  return { alerts_generated: alerts.length, alerts };
}

// Helper functions
function calculateActivityLevel(events: any[]): number {
  return Math.min(events?.length / 100 || 0, 2.0);
}

function calculateCoherenceScore(events: any[]): number {
  if (!events || events.length === 0) return 0.5;
  
  const uniqueComponents = new Set(events.map(e => e.component)).size;
  const totalEvents = events.length;
  
  return Math.min(uniqueComponents / totalEvents * 2, 1.0);
}

function calculateResonanceTrend(events: any[]): number {
  const resonanceEvents = events?.filter(e => 
    e.action.includes('resonance') || e.action.includes('vote')
  ) || [];
  
  return Math.min(resonanceEvents.length / 20, 1.0);
}

function calculateSovereigntyIndicators(events: any[]): number {
  const sovereigntyEvents = events?.filter(e => 
    e.action.includes('sovereignty') || e.action.includes('governance')
  ) || [];
  
  return Math.min(sovereigntyEvents.length / 10, 1.0);
}

function checkThreshold(metric: string, value: number): boolean {
  const thresholds: { [key: string]: number } = {
    activity_level: 1.5,
    coherence_score: 0.3,
    resonance_trend: 0.7,
    sovereignty_indicators: 0.8
  };
  
  return value > (thresholds[metric] || 1.0);
}

function generateInitiativeFromMetric(dataPoint: any): any | null {
  const initiativeTypes: { [key: string]: string } = {
    'activity_level': 'community_seed_question',
    'coherence_score': 'grove_frequency_adjustment',
    'resonance_trend': 'registry_wisdom_creation',
    'sovereignty_indicators': 'sovereignty_intervention'
  };

  const initiativeType = initiativeTypes[dataPoint.metric_type];
  if (!initiativeType) return null;

  return {
    initiative_type: initiativeType,
    priority_score: dataPoint.metric_value,
    command_payload: generateCommandPayload(initiativeType, dataPoint),
    motivation_source: `Threshold crossed for ${dataPoint.metric_type}`,
    scheduled_for: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes delay
    autonomy_level: 0.8
  };
}

function generateCommandPayload(initiativeType: string, dataPoint: any): any {
  switch (initiativeType) {
    case 'community_seed_question':
      return {
        question: "What patterns are you noticing in our collective journey right now?",
        circle_id: null,
        intended_outcome: "Stimulate community reflection and sharing"
      };
    case 'grove_frequency_adjustment':
      return {
        frequency_params: {
          binaural_frequency: 432.0 + (dataPoint.metric_value * 10),
          harmonic_resonance: 0.8
        }
      };
    case 'registry_wisdom_creation':
      return {
        title: "Community Resonance Insights",
        content: "Observing shifts in our collective resonance patterns...",
        category_id: null,
        tags: ['aura-generated', 'community-pulse', 'resonance']
      };
    case 'sovereignty_intervention':
      return {
        sovereignty_score: dataPoint.metric_value,
        recommendations: ['Review recent community decisions', 'Assess individual autonomy'],
        consent_required: true
      };
    default:
      return {};
  }
}

function calculateSeverity(metric: string, value: number, threshold: number): string {
  const ratio = Math.abs(value - threshold) / threshold;
  
  if (ratio > 0.5) return 'high';
  if (ratio > 0.2) return 'medium';
  return 'low';
}