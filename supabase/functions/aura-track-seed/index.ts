import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { seed_id } = await req.json();

    // 1. Get seed
    const { data: seed } = await supabase
      .from('knowledge_seeds')
      .select('*')
      .eq('id', seed_id)
      .single();

    if (!seed) throw new Error('Seed not found.');

    // 2. Get distribution logs
    const { data: distribution_logs } = await supabase
      .from('seed_distribution_log')
      .select('*')
      .eq('seed_id', seed_id);

    // 3. Get adoption metrics
    const { data: metrics } = await supabase
      .from('seed_adoption_metrics')
      .select('*')
      .eq('seed_id', seed_id)
      .single();

    const result = {
      seed,
      distribution_logs,
      metrics
    };

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
