-- Phase 1: Unified Event System & Governance Tables
CREATE TABLE IF NOT EXISTS public.platform_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  component TEXT NOT NULL,
  action TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id TEXT,
  sanctuary_flag BOOLEAN DEFAULT false,
  anonymized_data JSONB DEFAULT '{}',
  aura_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phase 2: Grove Environmental Control Tables
CREATE TABLE IF NOT EXISTS public.grove_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  grove_component TEXT NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  aura_participation_level NUMERIC DEFAULT 0.0,
  environmental_state JSONB DEFAULT '{}',
  binaural_frequency NUMERIC DEFAULT 432.0,
  light_parameters JSONB DEFAULT '{}',
  aura_messages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.grove_directives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.grove_sessions,
  directive_type TEXT NOT NULL, -- 'frequency', 'lighting', 'ambiance', 'message'
  parameters JSONB NOT NULL DEFAULT '{}',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by TEXT DEFAULT 'aura',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phase 3: Autonomous Participation Enhancement (use correct table names)
ALTER TABLE public.registry_of_resonance 
ADD COLUMN IF NOT EXISTS aura_origin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS community_review_status TEXT DEFAULT 'pending';

ALTER TABLE public.circle_posts 
ADD COLUMN IF NOT EXISTS aura_origin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seed_question BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS generated_context JSONB DEFAULT '{}';

-- Phase 4: Governance & Tracking Tables
CREATE TABLE IF NOT EXISTS public.aura_participation_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participation_type TEXT NOT NULL, -- 'grove_message', 'registry_entry', 'circle_post', 'sovereignty_check'
  target_id UUID, -- references the created content
  target_table TEXT, -- which table the content was created in
  aura_reasoning TEXT,
  community_impact_score NUMERIC DEFAULT 0.0,
  user_consent_level TEXT DEFAULT 'implicit', -- 'explicit', 'implicit', 'revoked'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_status TEXT DEFAULT 'pending' -- 'pending', 'approved', 'flagged', 'hidden'
);

CREATE TABLE IF NOT EXISTS public.aura_community_sensing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'resonance_dip', 'activity_spike', 'coherence_shift'
  metric_value NUMERIC NOT NULL,
  threshold_crossed BOOLEAN DEFAULT false,
  triggered_action TEXT, -- 'sovereignty_check', 'seed_question', 'grove_adjustment'
  action_payload JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all new tables
ALTER TABLE public.platform_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grove_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grove_directives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_participation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_community_sensing ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform_events
CREATE POLICY "Users can view their own events" ON public.platform_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events" ON public.platform_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all events" ON public.platform_events
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for grove_sessions
CREATE POLICY "Users can manage their grove sessions" ON public.grove_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage grove sessions" ON public.grove_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for grove_directives
CREATE POLICY "Users can view grove directives for their sessions" ON public.grove_directives
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.grove_sessions 
      WHERE grove_sessions.id = grove_directives.session_id 
      AND grove_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage grove directives" ON public.grove_directives
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for aura_participation_logs
CREATE POLICY "Admins can view all participation logs" ON public.aura_participation_logs
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage participation logs" ON public.aura_participation_logs
  FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for aura_community_sensing
CREATE POLICY "Admins can view community sensing data" ON public.aura_community_sensing
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage community sensing" ON public.aura_community_sensing
  FOR ALL USING (auth.role() = 'service_role');

-- Realtime subscriptions for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.platform_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grove_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.grove_directives;
ALTER PUBLICATION supabase_realtime ADD TABLE public.aura_participation_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.aura_community_sensing;