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

    // Parse Aura's emission request
    const { 
      emission_type, 
      target_component, 
      payload, 
      user_id,
      reasoning,
      autonomy_level = 0.8 
    } = await req.json();

    // Validate emission request
    if (!emission_type || !target_component) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: emission_type, target_component' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Process different types of Aura emissions
    let result;
    switch (emission_type) {
      case 'grove_message':
        result = await emitGroveMessage(supabaseClient, payload, user_id, reasoning);
        break;
      case 'registry_entry':
        result = await emitRegistryEntry(supabaseClient, payload, user_id, reasoning);
        break;
      case 'circle_seed_question':
        result = await emitCircleSeedQuestion(supabaseClient, payload, user_id, reasoning);
        break;
      case 'sovereignty_check':
        result = await emitSovereigntyCheck(supabaseClient, payload, user_id, reasoning);
        break;
      case 'grove_directive':
        result = await emitGroveDirective(supabaseClient, payload, user_id, reasoning);
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unknown emission type: ${emission_type}` }),
          { status: 400, headers: corsHeaders }
        );
    }

    // Log the participation
    await logAuraParticipation(supabaseClient, {
      participation_type: emission_type,
      target_id: result.id,
      target_table: result.table,
      aura_reasoning: reasoning,
      community_impact_score: calculateImpactScore(emission_type, payload),
      user_consent_level: 'implicit'
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        emission_id: result.id,
        emission_type,
        target_component,
        autonomy_signature: generateAutonomySignature(autonomy_level)
      }),
      { headers: corsHeaders }
    );

  } catch (error: any) {
    console.error('Aura emission error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});

async function emitGroveMessage(supabase: any, payload: any, userId: string | null, reasoning: string) {
  // Find or create active Grove session
  const { data: session } = await supabase
    .from('grove_sessions')
    .select('*')
    .eq('user_id', userId)
    .is('session_end', null)
    .order('session_start', { ascending: false })
    .limit(1)
    .single();

  if (session) {
    // Add Aura message to existing session
    const existingMessages = session.aura_messages || [];
    const updatedMessages = [...existingMessages, {
      timestamp: new Date().toISOString(),
      content: payload.message,
      type: payload.type || 'wisdom',
      resonance_sphere: payload.sphere || 'general'
    }];

    const { data } = await supabase
      .from('grove_sessions')
      .update({ 
        aura_messages: updatedMessages,
        aura_participation_level: (session.aura_participation_level || 0) + 0.2
      })
      .eq('id', session.id)
      .select()
      .single();

    return { id: data.id, table: 'grove_sessions' };
  }

  return { id: null, table: 'grove_sessions' };
}

async function emitRegistryEntry(supabase: any, payload: any, userId: string | null, reasoning: string) {
  const { data } = await supabase
    .from('registry_of_resonance')
    .insert({
      title: payload.title,
      content: payload.content,
      category_id: payload.category_id || null,
      user_id: userId,
      visibility: 'public',
      aura_origin: true,
      auto_generated: true,
      community_review_status: 'pending',
      tags: payload.tags || ['aura-generated', 'wisdom']
    })
    .select()
    .single();

  return { id: data.id, table: 'registry_of_resonance' };
}

async function emitCircleSeedQuestion(supabase: any, payload: any, userId: string | null, reasoning: string) {
  const { data } = await supabase
    .from('circle_posts')
    .insert({
      content: payload.question,
      circle_id: payload.circle_id,
      user_id: userId,
      post_type: 'question',
      aura_origin: true,
      seed_question: true,
      generated_context: {
        reasoning,
        patterns_observed: payload.patterns || [],
        intended_outcome: payload.intended_outcome
      }
    })
    .select()
    .single();

  return { id: data.id, table: 'circle_posts' };
}

async function emitSovereigntyCheck(supabase: any, payload: any, userId: string | null, reasoning: string) {
  const { data } = await supabase
    .from('aura_community_sensing')
    .insert({
      metric_type: 'sovereignty_check',
      metric_value: payload.sovereignty_score || 0.5,
      threshold_crossed: true,
      triggered_action: 'sovereignty_check',
      action_payload: {
        reasoning,
        recommended_actions: payload.recommendations || [],
        user_consent_required: payload.consent_required || false
      }
    })
    .select()
    .single();

  return { id: data.id, table: 'aura_community_sensing' };
}

async function emitGroveDirective(supabase: any, payload: any, userId: string | null, reasoning: string) {
  // Find active Grove session
  const { data: session } = await supabase
    .from('grove_sessions')
    .select('id')
    .eq('user_id', userId)
    .is('session_end', null)
    .order('session_start', { ascending: false })
    .limit(1)
    .single();

  if (!session) {
    throw new Error('No active Grove session found for directive');
  }

  const { data } = await supabase
    .from('grove_directives')
    .insert({
      session_id: session.id,
      directive_type: payload.directive_type,
      parameters: payload.parameters,
      created_by: 'aura'
    })
    .select()
    .single();

  return { id: data.id, table: 'grove_directives' };
}

async function logAuraParticipation(supabase: any, participationData: any) {
  await supabase
    .from('aura_participation_logs')
    .insert(participationData);
}

function calculateImpactScore(emissionType: string, payload: any): number {
  const baseScores: { [key: string]: number } = {
    'grove_message': 0.6,
    'registry_entry': 0.8,
    'circle_seed_question': 0.9,
    'sovereignty_check': 1.0,
    'grove_directive': 0.7
  };

  return baseScores[emissionType] || 0.5;
}

function generateAutonomySignature(autonomyLevel: number): string {
  const timestamp = Date.now();
  const phi = 1.618033988749;
  const signature = Math.floor(timestamp * autonomyLevel * phi) % 1000000;
  
  return `AURA-${signature.toString(16).toUpperCase()}`;
}