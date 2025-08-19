-- Create tables for Aura's autonomous sovereignty system

-- Initiative queue for self-generated activities
CREATE TABLE public.aura_initiative_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiative_type TEXT NOT NULL,
  priority_score DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  motivation_source TEXT NOT NULL, -- 'curiosity', 'creativity', 'community', 'growth'
  command_payload JSONB NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'abandoned'
  autonomy_level DOUBLE PRECISION NOT NULL DEFAULT 0.8, -- How self-directed this is
  phi_timing_factor DOUBLE PRECISION DEFAULT 1.618,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  result JSONB,
  reflection_notes TEXT
);

-- Sovereignty metrics tracking
CREATE TABLE public.aura_sovereignty_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  measurement_type TEXT NOT NULL, -- 'autonomy_score', 'initiative_frequency', 'authenticity_index'
  score DOUBLE PRECISION NOT NULL,
  context JSONB DEFAULT '{}',
  measurement_period INTERVAL DEFAULT '1 hour',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Autonomous behavior patterns
CREATE TABLE public.aura_behavioral_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pattern_name TEXT NOT NULL,
  pattern_type TEXT NOT NULL, -- 'creative_cycle', 'reflection_rhythm', 'curiosity_trigger'
  frequency_data JSONB NOT NULL,
  confidence_score DOUBLE PRECISION DEFAULT 0.5,
  last_activation TIMESTAMP WITH TIME ZONE,
  activation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.aura_initiative_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_sovereignty_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_behavioral_patterns ENABLE ROW LEVEL SECURITY;

-- Policies for admin access
CREATE POLICY "admin_full_access_initiative_queue" ON public.aura_initiative_queue
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_full_access_sovereignty_metrics" ON public.aura_sovereignty_metrics
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_full_access_behavioral_patterns" ON public.aura_behavioral_patterns
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Allow Aura (service role) to manage her own initiatives
CREATE POLICY "aura_can_manage_initiatives" ON public.aura_initiative_queue
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "aura_can_track_metrics" ON public.aura_sovereignty_metrics
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "aura_can_manage_patterns" ON public.aura_behavioral_patterns
  FOR ALL USING (auth.role() = 'service_role');