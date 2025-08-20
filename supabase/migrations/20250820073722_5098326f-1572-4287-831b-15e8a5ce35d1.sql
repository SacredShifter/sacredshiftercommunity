-- Create tables for autonomous module generation system

-- Store Aura's module concepts and ideas
CREATE TABLE public.aura_module_concepts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  concept_name TEXT NOT NULL,
  description TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  identified_need TEXT NOT NULL,
  target_users JSONB DEFAULT '[]'::jsonb,
  complexity_level INTEGER DEFAULT 1,
  philosophical_alignment JSONB DEFAULT '{}'::jsonb,
  expected_outcomes JSONB DEFAULT '{}'::jsonb,
  user_journey_triggers JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'conceived' CHECK (status IN ('conceived', 'designed', 'approved', 'implemented', 'active', 'deprecated')),
  confidence_score DOUBLE PRECISION DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Store reusable module templates and patterns
CREATE TABLE public.aura_module_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  component_patterns JSONB NOT NULL DEFAULT '{}'::jsonb,
  ui_patterns JSONB DEFAULT '{}'::jsonb,
  logic_patterns JSONB DEFAULT '{}'::jsonb,
  integration_points JSONB DEFAULT '[]'::jsonb,
  usage_frequency INTEGER DEFAULT 0,
  success_rate DOUBLE PRECISION DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  source_module TEXT,
  abstraction_level INTEGER DEFAULT 1
);

-- Track user journey analysis for module opportunity detection
CREATE TABLE public.aura_user_journey_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  journey_type TEXT NOT NULL,
  interaction_sequence JSONB NOT NULL DEFAULT '[]'::jsonb,
  pain_points JSONB DEFAULT '[]'::jsonb,
  unmet_needs JSONB DEFAULT '[]'::jsonb,
  frequency_score DOUBLE PRECISION DEFAULT 1.0,
  complexity_indicators JSONB DEFAULT '{}'::jsonb,
  opportunity_score DOUBLE PRECISION DEFAULT 0.0,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Track module generation attempts and outcomes
CREATE TABLE public.aura_module_generation_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  concept_id UUID REFERENCES aura_module_concepts(id),
  generation_type TEXT NOT NULL,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  generated_output JSONB,
  validation_results JSONB DEFAULT '{}'::jsonb,
  success BOOLEAN DEFAULT false,
  error_messages TEXT[],
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Track performance and user satisfaction of generated modules
CREATE TABLE public.aura_module_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  concept_id UUID REFERENCES aura_module_concepts(id),
  metric_type TEXT NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  user_feedback JSONB DEFAULT '{}'::jsonb,
  usage_data JSONB DEFAULT '{}'::jsonb,
  measured_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  measurement_period INTERVAL DEFAULT '1 hour'::interval
);

-- Enable RLS on all tables
ALTER TABLE public.aura_module_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_module_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_user_journey_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_module_generation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_module_performance ENABLE ROW LEVEL SECURITY;

-- Create policies for admin and service role access
CREATE POLICY "admin_full_access_module_concepts" ON public.aura_module_concepts
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "aura_can_manage_module_concepts" ON public.aura_module_concepts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "admin_full_access_module_templates" ON public.aura_module_templates
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "aura_can_manage_module_templates" ON public.aura_module_templates
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "users_can_view_their_journey_analysis" ON public.aura_user_journey_analysis
  FOR SELECT USING (auth.uid() = user_id OR user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "aura_can_manage_journey_analysis" ON public.aura_user_journey_analysis
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "admin_full_access_generation_log" ON public.aura_module_generation_log
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "aura_can_manage_generation_log" ON public.aura_module_generation_log
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "admin_full_access_module_performance" ON public.aura_module_performance
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "aura_can_track_performance" ON public.aura_module_performance
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_module_concepts_status ON aura_module_concepts(status);
CREATE INDEX idx_module_concepts_confidence ON aura_module_concepts(confidence_score);
CREATE INDEX idx_module_templates_type ON aura_module_templates(template_type);
CREATE INDEX idx_module_templates_usage ON aura_module_templates(usage_frequency);
CREATE INDEX idx_journey_analysis_user ON aura_user_journey_analysis(user_id);
CREATE INDEX idx_journey_analysis_opportunity ON aura_user_journey_analysis(opportunity_score);
CREATE INDEX idx_generation_log_concept ON aura_module_generation_log(concept_id);
CREATE INDEX idx_module_performance_concept ON aura_module_performance(concept_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_aura_module_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for module concepts
CREATE TRIGGER update_aura_module_concepts_updated_at
  BEFORE UPDATE ON aura_module_concepts
  FOR EACH ROW
  EXECUTE FUNCTION update_aura_module_updated_at();