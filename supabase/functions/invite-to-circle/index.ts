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

    const { circle_id, invitee_id } = await req.json();
    const { data: { user: inviter } } = await supabase.auth.getUser();
    if (!inviter) throw new Error('Authentication required');

    // Check if inviter is an admin of the circle
    const { data: membership } = await supabase
      .from('circle_group_members')
      .select('role')
      .eq('group_id', circle_id)
      .eq('user_id', inviter.id)
      .single();

    if (!membership || membership.role !== 'admin') {
      throw new Error('You must be an admin of this circle to invite users.');
    }

    // Create an invitation
    const { error } = await supabase
      .from('circle_invitations')
      .insert({
        circle_id,
        inviter_id: inviter.id,
        invitee_id,
        status: 'pending'
      });

    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, message: 'Invitation sent.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
