import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: { 
          headers: { 
            Authorization: req.headers.get("Authorization")! 
          } 
        }
      }
    );

    const { command, job_id } = await req.json();

    // Verify user has admin role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      throw new Error('Admin role required');
    }

    // Update job status to running
    await supabase
      .from('aura_jobs')
      .update({ 
        status: 'running',
        executed_at: new Date().toISOString()
      })
      .eq('id', job_id);

    // Route command to appropriate handler
    const result = await routeCommand(supabase, command, user.id);

    // Update job with success
    await supabase
      .from('aura_jobs')
      .update({ 
        status: 'success',
        result,
        completed_at: new Date().toISOString()
      })
      .eq('id', job_id);

    return new Response(
      JSON.stringify({ ok: true, result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Aura dispatcher error:', error);

    // Update job with failure if job_id is available
    try {
      const { job_id } = await req.json();
      if (job_id) {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        await supabase
          .from('aura_jobs')
          .update({ 
            status: 'failed',
            error: error.message,
            completed_at: new Date().toISOString()
          })
          .eq('id', job_id);
      }
    } catch (updateError) {
      console.error('Failed to update job with error:', updateError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function routeCommand(supabase: any, command: any, userId: string) {
  console.log('Executing command:', command.kind);

  switch (command.kind) {
    case 'codex.create': {
      const { data, error } = await supabase
        .from('codex_entries')
        .insert({
          title: command.payload.title,
          content: command.payload.body_md,
          created_by: userId,
          status: 'published',
          visibility: command.payload.visibility || 'public'
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create codex entry: ${error.message}`);

      await audit(supabase, 'codex.create', data.id, null, data, userId);
      return { id: data.id, title: data.title };
    }

    case 'codex.update': {
      const { id, patch } = command.payload;

      // Get current state for audit
      const { data: before } = await supabase
        .from('codex_entries')
        .select('*')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('codex_entries')
        .update(patch)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update codex entry: ${error.message}`);

      await audit(supabase, 'codex.update', id, before, data, userId);
      return { id: data.id, updated: Object.keys(patch) };
    }

    case 'circle.announce': {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          audience: command.payload.audience,
          title: command.payload.title || 'Announcement',
          body: command.payload.message,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create announcement: ${error.message}`);

      await audit(supabase, 'circle.announce', data.id, null, data, userId);
      return { id: data.id, audience: command.payload.audience };
    }

    case 'journal.template.create': {
      const { data, error } = await supabase
        .from('journal_templates')
        .insert({
          title: command.payload.title,
          fields: command.payload.fields,
          created_by: userId
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create journal template: ${error.message}`);

      await audit(supabase, 'journal.template.create', data.id, null, data, userId);
      return { id: data.id, title: data.title };
    }

    case 'moderation.flag': {
      // This would integrate with your moderation system
      console.log('Flagging resource:', command.payload);
      
      await audit(supabase, 'moderation.flag', command.payload.id, null, command.payload, userId);
      return { 
        resource: command.payload.resource,
        id: command.payload.id,
        flagged: true 
      };
    }

    case 'site.style.preview': {
      // Store preview tokens
      const { data, error } = await supabase
        .from('design_tokens_preview')
        .insert({
          tokens: command.payload.tokens,
          created_by: userId,
          is_active: true
        })
        .select()
        .single();

      if (error) throw new Error(`Failed to create style preview: ${error.message}`);

      await audit(supabase, 'site.style.preview', data.id, null, data, userId);
      return { id: data.id, tokens: Object.keys(command.payload.tokens) };
    }

    case 'site.style.apply': {
      // This would apply styles to the actual system
      // For now, we'll just log it as a high-risk operation
      console.log('Applying style tokens:', command.payload.tokens);
      
      await audit(supabase, 'site.style.apply', 'global', null, command.payload, userId);
      return { applied: true, tokens: Object.keys(command.payload.tokens) };
    }

    default:
      throw new Error(`Unsupported command: ${command.kind}`);
  }
}

async function audit(supabase: any, action: string, target: string, before: any, after: any, userId: string) {
  const { error } = await supabase
    .from('aura_audit')
    .insert({
      action,
      target,
      before,
      after,
      actor: userId
    });

  if (error) {
    console.error('Audit logging failed:', error);
  }
}