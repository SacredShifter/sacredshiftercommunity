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
  // Level 2 - Requires confirmation
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
}

export interface DAPResult {
  ok: boolean;
  warnings: string[];
  blockers?: string[];
}