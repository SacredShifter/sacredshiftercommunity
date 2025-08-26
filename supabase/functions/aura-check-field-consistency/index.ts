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

    // 1. Get all defined tags
    const { data: definedTagsData } = await supabase.from('tags').select('name');
    const definedTags = new Set(definedTagsData?.map(t => t.name) || []);

    // 2. Get all tags from codex_entries
    const { data: codexTagsData } = await supabase.from('codex_entries').select('tags');
    const usedCodexTags = new Set(codexTagsData?.flatMap(e => e.tags || []) || []);

    // 3. Get all tags from circle_posts
    const { data: circlePostTagsData } = await supabase.from('circle_posts').select('tags');
    const usedCirclePostTags = new Set(circlePostTagsData?.flatMap(p => p.tags || []) || []);

    // 4. Combine all used tags
    const allUsedTags = new Set([...usedCodexTags, ...usedCirclePostTags]);

    // 5. Find inconsistencies
    const inconsistencies = [...allUsedTags].filter(tag => !definedTags.has(tag));

    // 6. Report inconsistencies
    if (inconsistencies.length > 0) {
      await supabase
        .from('notifications')
        .insert({
          audience: 'admins',
          title: '🚨 Field Consistency Alert: Undefined Tags',
          body: `The following tags are used but not defined in the central tags table: ${inconsistencies.join(', ')}`,
          kind: 'field_consistency_alert'
        });
    }

    return new Response(JSON.stringify({ ok: true, inconsistencies }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
