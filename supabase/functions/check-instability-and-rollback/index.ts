import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INSTABILITY_THRESHOLD = 5; // 5 "distorts" votes
const INSTABILITY_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

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

    const { record } = await req.json(); // The new community_feedback record

    // 1. Count recent "distorts" votes for this record
    const { count, error: countError } = await supabase
      .from('community_feedback')
      .select('*', { count: 'exact' })
      .eq('audit_id', record.audit_id) // Assuming feedback is on an audit entry
      .eq('resonance', 'distorts')
      .gt('created_at', new Date(Date.now() - INSTABILITY_WINDOW).toISOString());

    if (countError) throw countError;

    // 2. If threshold is exceeded, trigger rollback
    if (count && count > INSTABILITY_THRESHOLD) {
      // We need to get the record_id and table_name from the audit entry
      const { data: auditEntry } = await supabase
        .from('aura_audit')
        .select('target, table_name')
        .eq('id', record.audit_id)
        .single();

      if (auditEntry && auditEntry.target && auditEntry.table_name) {
        await supabase.functions.invoke('aura-rollback', {
          body: {
            record_id: auditEntry.target,
            table_name: auditEntry.table_name
          }
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
