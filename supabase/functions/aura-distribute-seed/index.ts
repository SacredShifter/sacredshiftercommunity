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

    const { seed_id, channel, recipient_id } = await req.json();

    // 1. Check for consent
    let consent_given = false;
    if (channel === 'user') {
      const { data: preference } = await supabase
        .from('user_preferences')
        .select('receive_seeds')
        .eq('user_id', recipient_id)
        .single();
      if (preference && preference.receive_seeds) {
        consent_given = true;
      }
    } else {
      // For mesh and external, consent is assumed to be handled by the other system
      consent_given = true;
    }

    if (!consent_given) {
      throw new Error('User has not consented to receive seeds.');
    }

    // 2. Distribute seed
    const { data: seed } = await supabase
      .from('knowledge_seeds')
      .select('content')
      .eq('id', seed_id)
      .single();

    if (!seed) throw new Error('Seed not found.');

    if (channel === 'user') {
      await supabase.from('notifications').insert({
        user_id: recipient_id,
        title: `A new knowledge seed has germinated: ${seed.content.title}`,
        body: seed.content.body,
        kind: 'new_seed'
      });
    } else if (channel === 'mesh') {
      // This would require invoking the SacredMesh to send a message
      // For now, we'll just log it
      console.log(`Distributing seed ${seed_id} to mesh node ${recipient_id}`);
    } else if (channel === 'external') {
      // This would send a webhook
      console.log(`Distributing seed ${seed_id} to external system ${recipient_id}`);
    }

    // 3. Log distribution
    await supabase.from('seed_distribution_log').insert({
      seed_id,
      recipient_id,
      distribution_channel: channel,
      status: 'sent',
      consent_given
    });

    return new Response(JSON.stringify({ ok: true, message: 'Seed distributed.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
