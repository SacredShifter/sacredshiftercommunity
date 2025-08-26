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

    const { record_id, table_name, job_id } = await req.json();

    // 1. Find the version to roll back FROM (the current latest, possibly unstable version)
    const { data: currentVersion } = await supabase
      .from('versions')
      .select('id')
      .eq('record_id', record_id)
      .eq('table_name', table_name)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    // 2. Find the last stable version to roll back TO
    const { data: lastStableVersion, error: fetchError } = await supabase
      .from('versions')
      .select('data, version_number')
      .eq('record_id', record_id)
      .eq('table_name', table_name)
      .eq('is_stable', true)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !lastStableVersion) {
      throw new Error('No stable version found to roll back to.');
    }

    // 3. Update the record in its original table with the stable data
    const recordData = lastStableVersion.data;
    delete recordData.id; // Don't try to update the ID

    const { data: rolledBackRecord, error: updateError } = await supabase
      .from(table_name)
      .update(recordData)
      .eq('id', record_id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to roll back record: ${updateError.message}`);
    }

    // 4. Mark the version we rolled back FROM as not stable
    if (currentVersion) {
      await supabase
        .from('versions')
        .update({ is_stable: false })
        .eq('id', currentVersion.id);
    }

    // 5. Create a new, stable version for the rollback action
    await createVersion(supabase, table_name, rolledBackRecord, {
      job_id: job_id,
      notes: `Rollback to version ${lastStableVersion.version_number}`
    });

    return new Response(JSON.stringify({ ok: true, message: 'Rollback successful' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function createVersion(supabase: any, tableName: string, record: any, provenance: any) {
  const { data: latestVersion } = await supabase
    .from('versions')
    .select('version_number')
    .eq('record_id', record.id)
    .eq('table_name', tableName)
    .order('version_number', { ascending: false })
    .limit(1)
    .single();

  const newVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1;

  const { error } = await supabase
    .from('versions')
    .insert({
      record_id: record.id,
      table_name: tableName,
      version_number: newVersionNumber,
      data: record,
      provenance,
      is_stable: true // A rollback creates a new stable version
    });

  if (error) {
    console.error(`Versioning failed for ${tableName} ${record.id}:`, error);
  }
}
