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

  let command, job_id;

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

    const body = await req.json();
    command = body.command;
    job_id = body.job_id;

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
    const result = await routeCommand(supabase, command, user.id, job_id);

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
    if (job_id) {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      await supabaseAdmin
        .from('aura_jobs')
        .update({
          status: 'failed',
          error: error.message,
          completed_at: new Date().toISOString()
        })
        .eq('id', job_id);

      // Handle escalation for failed remediation
      if (command && command.kind === 'remediate') {
        const failed_job_id = command.payload.failed_job_id;

        const { data: failedJob } = await supabaseAdmin
          .from('aura_jobs')
          .select('remediation_attempts')
          .eq('id', failed_job_id)
          .single();

        if (failedJob) {
          const newAttempts = (failedJob.remediation_attempts || 0) + 1;

          await supabaseAdmin
            .from('aura_jobs')
            .update({ remediation_attempts: newAttempts })
            .eq('id', failed_job_id);

          if (newAttempts >= 2) {
            await supabaseAdmin
              .from('notifications')
              .insert({
                audience: 'admins', // Or a specific "Governor" role
                title: '🚨 Governor Alert: Remediation Failed',
                body: `Remediation for job ${failed_job_id} has failed twice. Manual intervention required.`,
                kind: 'governor_alert'
              });
          }
        }
      }
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

async function routeCommand(supabase: any, command: any, userId: string, jobId: string) {
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

      await createVersion(supabase, 'codex_entries', data, { job_id: jobId });
      await audit(supabase, 'codex.create', data.id, null, data, userId, 'codex_entries', jobId);
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

      if (before && before.is_immutable) {
        throw new Error('This codex entry is part of the immutable core and cannot be altered.');
      }

      const { data, error } = await supabase
        .from('codex_entries')
        .update(patch)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update codex entry: ${error.message}`);

      await createVersion(supabase, 'codex_entries', data, { job_id: jobId });
      await audit(supabase, 'codex.update', id, before, data, userId, 'codex_entries', jobId);
      return { id: data.id, updated: Object.keys(patch) };
    }

    case 'codex.tag': {
      const { entry_id, tags_to_add, tags_to_remove } = command.payload;

      const { data: entry } = await supabase
        .from('codex_entries')
        .select('tags')
        .eq('id', entry_id)
        .single();

      if (!entry) throw new Error('Codex entry not found.');

      let currentTags = entry.tags || [];
      if (tags_to_add) {
        currentTags = [...new Set([...currentTags, ...tags_to_add])];
      }
      if (tags_to_remove) {
        currentTags = currentTags.filter(t => !tags_to_remove.includes(t));
      }

      const { data, error } = await supabase
        .from('codex_entries')
        .update({ tags: currentTags })
        .eq('id', entry_id)
        .select()
        .single();

      if (error) throw new Error(`Failed to tag codex entry: ${error.message}`);

      await audit(supabase, 'codex.tag', entry_id, { tags: entry.tags }, { tags: currentTags }, userId, 'codex_entries', jobId);
      return { id: data.id, tags: data.tags };
    }

    case 'codex.verify': {
      const { entry_id, verification_status } = command.payload;

      const { data, error } = await supabase
        .from('codex_entries')
        .update({ verification_status })
        .eq('id', entry_id)
        .select()
        .single();

      if (error) throw new Error(`Failed to verify codex entry: ${error.message}`);

      await audit(supabase, 'codex.verify', entry_id, null, { verification_status }, userId, 'codex_entries', jobId);
      return { id: data.id, verification_status: data.verification_status };
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

      await audit(supabase, 'circle.announce', data.id, null, data, userId, 'notifications', jobId);
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

      await audit(supabase, 'journal.template.create', data.id, null, data, userId, 'journal_templates', jobId);
      return { id: data.id, title: data.title };
    }

    case 'moderation.flag': {
      // This would integrate with your moderation system
      console.log('Flagging resource:', command.payload);
      
      await audit(supabase, 'moderation.flag', command.payload.id, null, command.payload, userId, command.payload.resource, jobId);
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

      await audit(supabase, 'site.style.preview', data.id, null, data, userId, 'design_tokens_preview', jobId);
      return { id: data.id, tokens: Object.keys(command.payload.tokens) };
    }

    case 'site.style.apply': {
      // This would apply styles to the actual system
      // For now, we'll just log it as a high-risk operation
      console.log('Applying style tokens:', command.payload.tokens);
      
      await audit(supabase, 'site.style.apply', 'global', null, command.payload, userId, null, jobId);
      return { applied: true, tokens: Object.keys(command.payload.tokens) };
    }

    case 'remediate': {
      const { failed_job_id, remediation_strategy } = command.payload;

      if (remediation_strategy === 'rollback') {
        const { data: auditEntry } = await supabase
          .from('aura_audit')
          .select('target, table_name')
          .eq('job_id', failed_job_id)
          .single();

        if (!auditEntry || !auditEntry.target || !auditEntry.table_name) {
          throw new Error(`Could not find audit entry for failed job ${failed_job_id} to perform rollback.`);
        }

        await supabase.functions.invoke('aura-rollback', {
          body: {
            record_id: auditEntry.target,
            table_name: auditEntry.table_name,
            job_id: jobId // Pass the current job_id for provenance
          }
        });

        await audit(supabase, 'remediate.rollback', failed_job_id, null, { status: 'rollback_triggered' }, userId, null, jobId);
        return { remediated: true, strategy: 'rollback' };
      } else {
        // Retry logic to be implemented later
        throw new Error('Remediation strategy "retry" is not yet implemented.');
      }
    }

    case 'seed.generate': {
      const { data, error } = await supabase.functions.invoke('aura-generate-seed', {
        body: command.payload
      });
      if (error) throw error;
      await audit(supabase, 'seed.generate', data.seed.id, null, data.seed, userId, 'knowledge_seeds', jobId);
      return data.seed;
    }

    case 'seed.distribute': {
      const { data, error } = await supabase.functions.invoke('aura-distribute-seed', {
        body: command.payload
      });
      if (error) throw error;
      await audit(supabase, 'seed.distribute', command.payload.seed_id, null, command.payload, userId, 'seed_distribution_log', jobId);
      return { distributed: true };
    }

    case 'seed.track': {
      const { data, error } = await supabase.functions.invoke('aura-track-seed', {
        body: command.payload
      });
      if (error) throw error;
      return data.result;
    }

    default:
      throw new Error(`Unsupported command: ${command.kind}`);
  }
}

async function audit(supabase: any, action: string, target: string, before: any, after: any, userId: string, tableName: string | null, jobId: string) {
  const { error } = await supabase
    .from('aura_audit')
    .insert({
      action: `Managed-by-Aura: ${action}`,
      target,
      table_name: tableName,
      job_id: jobId,
      before,
      after,
      actor: userId
    });

  if (error) {
    console.error('Audit logging failed:', error);
  }
}

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
    });

  if (error) {
    console.error(`Versioning failed for ${tableName} ${record.id}:`, error);
  }
}