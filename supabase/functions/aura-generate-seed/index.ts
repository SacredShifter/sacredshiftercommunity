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

    const { type, context } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // 1. Generate content (mock call to AI)
    const content = {
      title: `Generated ${type}`,
      body: `This is a generated ${type} based on the context: ${JSON.stringify(context)}`,
      timestamp: new Date().toISOString()
    };

    // 2. Get truth hash (mock)
    const truthHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(content)))
      .then(hash => Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join(''));

    // 3. Insert into knowledge_seeds
    const { data: seed, error: seedError } = await supabase
      .from('knowledge_seeds')
      .insert({
        type,
        content,
        created_by: user.id,
        provenance: { context },
        truth_hash: truthHash
      })
      .select()
      .single();

    if (seedError) throw seedError;

    // 4. Create adoption metrics entry
    await supabase
      .from('seed_adoption_metrics')
      .insert({ seed_id: seed.id });

    return new Response(JSON.stringify({ ok: true, seed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
