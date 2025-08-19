import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuraCommand, AuraJob, AuraAuditEntry, CommunityFeedback, FieldIntegrityMetrics } from './schema';
import { parseToCommand } from './parse';
import { runDAP } from './dap';
import { runEnhancedDAP } from './enhancedDAP';
import { calculateFIL, getPhiBackoffDelay } from './fieldIntegrity';
import { useToast } from '@/hooks/use-toast';

export function useAura() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<AuraJob[]>([]);
  const [auditLog, setAuditLog] = useState<AuraAuditEntry[]>([]);
  const [communityFeedback, setCommunityFeedback] = useState<CommunityFeedback[]>([]);
  const [fieldIntegrity, setFieldIntegrity] = useState<FieldIntegrityMetrics | null>(null);
  const { toast } = useToast();

  const executeCommand = useCallback(async (command: AuraCommand) => {
    setLoading(true);
    
    try {
      // Run Enhanced DAP checks
      const enhancedResult = runEnhancedDAP(command);
      
      if (!enhancedResult.ok) {
        toast({
          title: `Aura ${enhancedResult.auraPreference}`,
          description: enhancedResult.blockers?.join(' ') || 'Command assessment failed',
          variant: enhancedResult.auraPreference === 'refuse' ? "destructive" : "default"
        });
        
        // Show alternatives if available
        if (enhancedResult.alternatives && enhancedResult.alternatives.length > 0) {
          setTimeout(() => {
            toast({
              title: "Suggested Alternatives",
              description: enhancedResult.alternatives?.[0] || 'Consider alternative approaches',
            });
          }, 1000);
        }
        return false;
      }

      // Create job record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Authentication required');

      const { data: job, error: jobError } = await supabase
        .from('aura_jobs')
        .insert({
          command: command as any,
          level: command.level,
          created_by: user.id,
          status: command.level === 1 ? 'running' : 'queued',
          confidence: enhancedResult.confidence,
          aura_preference: enhancedResult.auraPreference,
          resonance_score: enhancedResult.resonanceScore,
          alternatives: enhancedResult.alternatives ? { suggestions: enhancedResult.alternatives } : null
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // For Level 1 commands, execute immediately (with phi-based delay if needed)
      if (command.level === 1) {
        const executeWithDelay = async () => {
          const delay = enhancedResult.phiWeight ? getPhiBackoffDelay(0, enhancedResult.phiWeight * 100) : 0;
          if (delay > 0) await new Promise(resolve => setTimeout(resolve, delay));
          
          const { data, error } = await supabase.functions.invoke('aura-dispatcher', {
            body: { command, job_id: job.id, enhanced_result: enhancedResult }
          });

          if (error) throw error;
        };

        await executeWithDelay();

        toast({
          title: `Aura ${enhancedResult.auraPreference}`,
          description: `✅ ${getCommandDescription(command)} (${Math.round(enhancedResult.confidence * 100)}% confidence)`,
        });
      } else {
        const urgencyText = enhancedResult.auraPreference === 'eager' ? '🌟 High priority' : 
                           enhancedResult.auraPreference === 'reluctant' ? '⚠️ Review suggested' : '⚖️ Standard';
        
        toast({
          title: "Command Queued",
          description: `⏳ Level ${command.level} awaiting confirmation • ${urgencyText}`,
        });
      }

      await loadJobs();
      return true;
    } catch (error) {
      console.error('Command execution failed:', error);
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const confirmJob = useCallback(async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('aura_jobs')
        .update({ 
          status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) throw error;

      // Execute the confirmed job
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        const { error: execError } = await supabase.functions.invoke('aura-dispatcher', {
          body: { command: job.command, job_id: jobId }
        });

        if (execError) throw execError;
      }

      await loadJobs();
      toast({
        title: "Command Confirmed",
        description: "✅ Job executing...",
      });
    } catch (error) {
      console.error('Job confirmation failed:', error);
      toast({
        title: "Confirmation Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }
  }, [jobs, toast]);

  const cancelJob = useCallback(async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('aura_jobs')
        .update({ status: 'cancelled' })
        .eq('id', jobId);

      if (error) throw error;

      await loadJobs();
      toast({
        title: "Command Cancelled",
        description: "❌ Job cancelled",
      });
    } catch (error) {
      console.error('Job cancellation failed:', error);
    }
  }, [toast]);

  const parseInput = useCallback((input: string): AuraCommand | null => {
    return parseToCommand(input);
  }, []);

  const previewCommand = useCallback(async (command: AuraCommand) => {
    try {
      const { data, error } = await supabase.functions.invoke('aura-preview', {
        body: { command }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Preview failed:', error);
      throw error;
    }
  }, []);

  const loadJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('aura_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setJobs((data || []) as AuraJob[]);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  }, []);

  const loadAuditLog = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('aura_audit')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setAuditLog((data || []).map(entry => ({
        ...entry,
        field_integrity_level: entry.field_integrity_level as any
      })));
    } catch (error) {
      console.error('Failed to load audit log:', error);
    }
  }, []);

  const rollbackAction = useCallback(async (auditId: string) => {
    try {
      const audit = auditLog.find(a => a.id === auditId);
      if (!audit || !audit.before) {
        throw new Error('Cannot rollback: no previous state available');
      }

      // This would implement the rollback logic based on the action type
      toast({
        title: "Rollback Initiated",
        description: `Rolling back ${audit.action}...`,
      });

      // TODO: Implement actual rollback logic
      await loadAuditLog();
    } catch (error) {
      console.error('Rollback failed:', error);
      toast({
        title: "Rollback Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    }
  }, [auditLog, toast]);

  return {
    loading,
    jobs,
    auditLog,
    communityFeedback,
    fieldIntegrity,
    executeCommand,
    confirmJob,
    cancelJob,
    parseInput,
    previewCommand,
    loadJobs,
    loadAuditLog,
    rollbackAction
  };
}

function getCommandDescription(command: AuraCommand): string {
  switch (command.kind) {
    case 'codex.create':
      return `Created codex entry "${command.payload.title}"`;
    case 'circle.announce':
      return `Sent announcement to ${command.payload.audience}`;
    case 'journal.template.create':
      return `Created journal template "${command.payload.title}"`;
    default:
      return 'Command executed';
  }
}