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

    const { invitation_id } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // Get invitation
    const { data: invitation } = await supabase
      .from('circle_invitations')
      .select('*')
      .eq('id', invitation_id)
      .single();

    if (!invitation) throw new Error('Invitation not found.');

    // Check if user is invitee or circle admin
    let isAuthorized = (invitation.invitee_id === user.id);
    if (!isAuthorized) {
      const { data: membership } = await supabase
        .from('circle_group_members')
        .select('role')
        .eq('group_id', invitation.circle_id)
        .eq('user_id', user.id)
        .single();
      if (membership && membership.role === 'admin') {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) throw new Error('You are not authorized to reject this invitation.');
    if (invitation.status !== 'pending') throw new Error('This invitation is no longer pending.');

    // Update invitation status
    await supabase
      .from('circle_invitations')
      .update({ status: 'rejected' })
      .eq('id', invitation_id);

    return new Response(JSON.stringify({ ok: true, message: 'Invitation rejected.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
