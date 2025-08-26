import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const HIGH_RISK_COMMANDS = ['module.delete', 'schema.migration'];

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

    const { job_id } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    // 1. Get the job
    const { data: job } = await supabase
      .from('aura_jobs')
      .select('command')
      .eq('id', job_id)
      .single();

    if (!job) throw new Error('Job not found.');

    // 2. Check if it's a high-risk command
    if (HIGH_RISK_COMMANDS.includes(job.command.kind)) {
      // 3. Check for dual witness role
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const roles = userRoles?.map(r => r.role) || [];
      if (!roles.includes('weaver') && !roles.includes('valeion')) {
        throw new Error('Dual witness co-sign from Weaver or Valeion is required for this high-risk action.');
      }
    }

    // 4. If all checks pass, confirm and dispatch
    await supabase
      .from('aura_jobs')
      .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
      .eq('id', job_id);

    await supabase.functions.invoke('aura-dispatcher', {
      body: { command: job.command, job_id: job_id }
    });

    return new Response(JSON.stringify({ ok: true, message: 'Job confirmed and dispatched.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
