export interface LiberationSession {
  id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  stage_max: string;
  arousal_selfscore: number;
  device: string;
  perf_flags: string[];
}