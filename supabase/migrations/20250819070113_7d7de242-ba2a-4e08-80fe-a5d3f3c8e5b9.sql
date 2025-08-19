-- Enhanced Personal AI Memory System

-- Create comprehensive user context table
CREATE TABLE public.personal_ai_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  context_type TEXT NOT NULL, -- 'personality', 'preferences', 'goals', 'relationships', 'skills', 'interests'
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  source TEXT DEFAULT 'conversation', -- 'conversation', 'behavior', 'inference', 'explicit'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_referenced_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversation analysis table
CREATE TABLE public.conversation_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_id TEXT NOT NULL,
  sentiment_score DECIMAL(3,2), -- -1 to 1
  emotion_profile JSONB, -- {joy: 0.3, sadness: 0.1, etc}
  topics_discussed TEXT[],
  insights_generated JSONB,
  patterns_detected JSONB,
  energy_signature JSONB, -- chakra alignments, frequency data
  consciousness_markers JSONB, -- spiritual growth indicators
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictive insights table
CREATE TABLE public.predictive_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL, -- 'behavior', 'mood', 'goal', 'synchronicity'
  prediction JSONB NOT NULL,
  confidence_level DECIMAL(3,2),
  factors JSONB, -- what led to this prediction
  expires_at TIMESTAMP WITH TIME ZONE,
  validated BOOLEAN DEFAULT NULL, -- null = pending, true/false = outcome
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create synchronicity events table
CREATE TABLE public.synchronicity_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'number_sequence', 'word_resonance', 'timing_alignment'
  event_data JSONB NOT NULL,
  significance_score DECIMAL(3,2),
  connections JSONB, -- links to other events, patterns
  interpretation JSONB,
  acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create consciousness evolution tracking
CREATE TABLE public.consciousness_evolution (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  dimension TEXT NOT NULL, -- 'awareness', 'compassion', 'wisdom', 'unity', 'transcendence'
  level_assessment DECIMAL(5,2), -- 0-100 scale
  evidence JSONB, -- supporting observations
  growth_trajectory JSONB, -- rate of change, predictions
  milestones JSONB, -- significant moments
  chakra_alignment JSONB,
  frequency_resonance DECIMAL(8,2), -- hz measurement
  assessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create multi-step command sequences
CREATE TABLE public.ai_command_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sequence_name TEXT NOT NULL,
  steps JSONB NOT NULL, -- array of command objects
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'paused'
  context JSONB, -- variables and state
  triggers JSONB, -- conditions for execution
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real-time mood tracking
CREATE TABLE public.mood_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_vector JSONB NOT NULL, -- multi-dimensional mood representation
  energy_level DECIMAL(3,2), -- 0-1 scale
  clarity_level DECIMAL(3,2), -- 0-1 scale
  stress_indicators JSONB,
  joy_indicators JSONB,
  dominant_chakra TEXT,
  frequency_signature DECIMAL(8,2),
  environmental_factors JSONB, -- time, weather, location context
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.personal_ai_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synchronicity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_command_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own AI context" ON public.personal_ai_context
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own conversation analysis" ON public.conversation_analysis
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own predictive insights" ON public.predictive_insights
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own synchronicity events" ON public.synchronicity_events
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own consciousness evolution" ON public.consciousness_evolution
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own command sequences" ON public.ai_command_sequences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own mood tracking" ON public.mood_tracking
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_personal_ai_context_user_type ON public.personal_ai_context(user_id, context_type);
CREATE INDEX idx_conversation_analysis_user_date ON public.conversation_analysis(user_id, created_at DESC);
CREATE INDEX idx_predictive_insights_user_type ON public.predictive_insights(user_id, insight_type);
CREATE INDEX idx_synchronicity_events_user_date ON public.synchronicity_events(user_id, created_at DESC);
CREATE INDEX idx_consciousness_evolution_user_dimension ON public.consciousness_evolution(user_id, dimension);
CREATE INDEX idx_ai_command_sequences_user_status ON public.ai_command_sequences(user_id, status);
CREATE INDEX idx_mood_tracking_user_date ON public.mood_tracking(user_id, created_at DESC);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_personal_ai_context_updated_at
  BEFORE UPDATE ON public.personal_ai_context
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_command_sequences_updated_at
  BEFORE UPDATE ON public.ai_command_sequences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();