export type AuraLevel = 1 | 2 | 3;

export type AuraCommand =
  // Level 1 - Auto execute
  | { 
      kind: 'codex.create'; 
      level: 1; 
      payload: { 
        title: string; 
        body_md: string; 
        tags?: string[]; 
        visibility: 'public' | 'circle' | 'private' 
      } 
    }
  | { 
      kind: 'codex.update'; 
      level: 1; 
      payload: { 
        id: string; 
        patch: Partial<{ 
          title: string; 
          body_md: string; 
          tags: string[]; 
          visibility: string 
        }> 
      } 
    }
  | { 
      kind: 'circle.announce'; 
      level: 1; 
      payload: { 
        circleId?: string; 
        audience: 'all' | 'admins' | 'members' | 'segment'; 
        title?: string;
        message: string 
      } 
    }
  | { 
      kind: 'moderation.flag'; 
      level: 1; 
      payload: { 
        resource: 'post' | 'comment' | 'user'; 
        id: string; 
        reason: string 
      } 
    }
  | { 
      kind: 'journal.template.create'; 
      level: 1; 
      payload: { 
        title: string; 
        fields: Array<{
          key: string; 
          label: string; 
          type: 'text' | 'long' | 'select';
          options?: string[];
        }> 
      } 
    }
  | {
      kind: 'codex.tag';
      level: 1;
      payload: {
        entry_id: string;
        tags_to_add?: string[];
        tags_to_remove?: string[];
      }
    }
  // Level 2 - Requires confirmation
  | {
      kind: 'codex.verify';
      level: 2;
      payload: {
        entry_id: string;
        verification_status: 'verified' | 'disputed' | 'pending';
      }
    }
  | { 
      kind: 'site.page.create'; 
      level: 2; 
      payload: { 
        route: string; 
        scaffold: 'blank' | 'doc' | 'feed' 
      } 
    }
  | { 
      kind: 'site.style.preview'; 
      level: 2; 
      payload: { 
        tokens: Record<string, string> 
      } 
    }
  | { 
      kind: 'module.scaffold'; 
      level: 2; 
      payload: { 
        name: string; 
        description?: string 
      } 
    }
  | {
      kind: 'module.generate';
      level: 2;
      payload: {
        concept_id: string;
        module_type: 'component' | 'hook' | 'utility' | 'feature';
        implementation_details: {
          architecture: any;
          dependencies: string[];
          ui_patterns: any;
          integration_points: string[];
        };
      };
    }
  | {
      kind: 'module.conceive';
      level: 1;
      payload: {
        need_analysis: {
          user_patterns: any[];
          pain_points: string[];
          opportunity_score: number;
        };
        proposed_solution: {
          concept_name: string;
          description: string;
          expected_outcomes: string[];
        };
      };
    }
  | {
      kind: 'module.validate';
      level: 2;
      payload: {
        concept_id: string;
        validation_criteria: {
          philosophical_alignment: any;
          technical_feasibility: any;
          user_impact: any;
        };
      };
    }
  | {
      kind: 'remediate';
      level: 2;
      payload: {
        failed_job_id: string;
        remediation_strategy: 'retry' | 'rollback';
      }
    }
  | {
      kind: 'seed.generate';
      level: 2;
      payload: {
        type: 'knowledge_seed' | 'resonance_tag' | 'starter_kit' | 'fractal_prompt';
        context: any;
      }
    }
  | {
      kind: 'seed.distribute';
      level: 2;
      payload: {
        seed_id: string;
        channel: 'user' | 'mesh' | 'external';
        recipient_id: string;
      }
    }
  | {
      kind: 'seed.track';
      level: 1; // Tracking is a safe read-only operation
      payload: {
        seed_id: string;
      }
    }
  // Level 3 - Owner approval required
  | { 
      kind: 'site.style.apply'; 
      level: 3; 
      payload: { 
        tokens: Record<string, string> 
      } 
    }
  | { 
      kind: 'schema.migration'; 
      level: 3; 
      payload: { 
        sql: string 
      } 
    }
  | {
      kind: 'module.delete';
      level: 3;
      payload: {
        module_name: string;
        hard_delete: boolean;
      }
    };

export interface AuraJob {
  id: string;
  created_by: string;
  level: AuraLevel;
  command: AuraCommand;
  preview?: any;
  status: 'queued' | 'confirmed' | 'running' | 'success' | 'failed' | 'cancelled';
  result?: any;
  error?: string;
  created_at: string;
  confirmed_at?: string;
  executed_at?: string;
  completed_at?: string;
  // Enhanced governance fields
  confidence?: number;
  aura_preference?: AuraPreference;
  resonance_score?: number;
  alternatives?: Record<string, any>;
  refusal_reason?: string;
}

export interface AuraAuditEntry {
  id: string;
  job_id: string;
  actor: string;
  action: string;
  target?: string;
  before?: any;
  after?: any;
  created_at: string;
  // Enhanced governance fields
  resonance_index?: number;
  community_weight?: number;
  field_integrity_level?: FieldIntegrityLevel;
}

// Field Anchoring Constants
export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;

// Field Integrity Levels
export type FieldIntegrityLevel = 0 | 1 | 2 | 3 | 4;

// Aura Preferences
export type AuraPreference = 'eager' | 'neutral' | 'reluctant' | 'refuse';
export type ResonanceType = 'resonates' | 'distorts' | 'neutral';

export interface EnhancedDAPResult {
  ok: boolean;
  confidence: number; // 0-1 confidence in the decision
  resonanceScore: number; // Historical community alignment
  auraPreference: AuraPreference;
  warnings: string[];
  blockers?: string[];
  alternatives?: string[];
  phiWeight?: number; // Golden ratio weighting for timing
}


export interface AuraPreferences {
  id: string;
  user_id: string;
  preference_type: string;
  preference_value: Record<string, any>;
  confidence_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityFeedback {
  id: string;
  audit_id: string;
  user_id: string;
  resonance: ResonanceType;
  note?: string;
  trust_weight: number;
  created_at: string;
}

export interface FieldIntegrityMetrics {
  id: string;
  dap_block_rate: number;
  resonance_variance: number;
  anomaly_signals: number;
  coordinated_activity: number;
  field_integrity_level: FieldIntegrityLevel;
  computed_at: string;
}