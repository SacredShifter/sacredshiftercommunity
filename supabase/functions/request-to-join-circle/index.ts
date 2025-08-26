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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization")!
          }
        }
      }
    );

    const { circle_id } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Check if circle is private
    const { data: circle } = await supabase
      .from('circle_groups')
      .select('is_private')
      .eq('id', circle_id)
      .single();

    if (!circle) throw new Error('Circle not found.');
    if (!circle.is_private) throw new Error('This circle is public. You can join directly.');

    // Create a request to join
    const { error } = await supabase
      .from('circle_invitations')
      .insert({
        circle_id,
        invitee_id: user.id,
        status: 'pending'
      });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, message: 'Request to join sent.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
