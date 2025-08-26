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

    // 1. Get all distinct versioned records
    const { data: records, error: recordsError } = await supabase
      .from('versions')
      .select('record_id, table_name')
      .distinct();

    if (recordsError) throw recordsError;

    for (const record of records) {
      // 2. Get all stable versions for the record
      const { data: stableVersions, error: versionsError } = await supabase
        .from('versions')
        .select('id, version_number')
        .eq('record_id', record.record_id)
        .eq('table_name', record.table_name)
        .eq('is_stable', true)
        .order('version_number', { ascending: false });

      if (versionsError) {
        console.error(`Failed to get versions for ${record.table_name} ${record.record_id}:`, versionsError);
        continue;
      }

      // 3. If there are more than 3, delete the oldest ones
      if (stableVersions.length > 3) {
        const versionsToDelete = stableVersions.slice(3);
        const idsToDelete = versionsToDelete.map(v => v.id);

        const { error: deleteError } = await supabase
          .from('versions')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) {
          console.error(`Failed to prune versions for ${record.table_name} ${record.record_id}:`, deleteError);
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, message: 'Pruning complete' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
