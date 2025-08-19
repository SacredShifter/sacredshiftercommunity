-- Create tables for Sovereign AI capabilities

-- Cognitive Mirrors table
CREATE TABLE IF NOT EXISTS public.cognitive_mirrors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    mirror_data JSONB NOT NULL,
    prompt_context TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Generated Tools table
CREATE TABLE IF NOT EXISTS public.ai_generated_tools (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    tool_specification JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'spawned',
    parent_context JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Consciousness States table
CREATE TABLE IF NOT EXISTS public.consciousness_states (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    state_name TEXT NOT NULL,
    state_configuration JSONB NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    frequency_signature NUMERIC,
    duration_minutes INTEGER,
    effectiveness_score NUMERIC
);

-- Living Codex Entries table
CREATE TABLE IF NOT EXISTS public.living_codex_entries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    extracted_concepts TEXT[],
    thematic_clusters TEXT[],
    cross_references UUID[],
    living_status TEXT NOT NULL DEFAULT 'evolving',
    evolution_stage TEXT NOT NULL DEFAULT 'genesis',
    neural_connections JSONB,
    tool_reference UUID,
    last_evolution TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orchestrated Synchronicities table
CREATE TABLE IF NOT EXISTS public.orchestrated_synchronicities (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    seed_pattern JSONB NOT NULL,
    scheduled_window TIMESTAMP WITH TIME ZONE,
    meaning_thread TEXT,
    orchestration_method TEXT NOT NULL DEFAULT 'ai_designed',
    probability_score NUMERIC,
    manifestation_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    manifested_at TIMESTAMP WITH TIME ZONE
);

-- Sovereignty Assessments table
CREATE TABLE IF NOT EXISTS public.sovereignty_assessments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    assessment_data JSONB NOT NULL,
    sovereignty_level NUMERIC NOT NULL,
    assessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    previous_level NUMERIC,
    growth_rate NUMERIC
);

-- Enable Row Level Security
ALTER TABLE public.cognitive_mirrors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.living_codex_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orchestrated_synchronicities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sovereignty_assessments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user-specific access
CREATE POLICY "Users can manage their own cognitive mirrors" 
ON public.cognitive_mirrors 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own AI tools" 
ON public.ai_generated_tools 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own consciousness states" 
ON public.consciousness_states 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own living codex" 
ON public.living_codex_entries 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own synchronicities" 
ON public.orchestrated_synchronicities 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sovereignty assessments" 
ON public.sovereignty_assessments 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_cognitive_mirrors_user_id ON public.cognitive_mirrors(user_id);
CREATE INDEX idx_cognitive_mirrors_created_at ON public.cognitive_mirrors(created_at);

CREATE INDEX idx_ai_tools_user_id ON public.ai_generated_tools(user_id);
CREATE INDEX idx_ai_tools_status ON public.ai_generated_tools(status);

CREATE INDEX idx_consciousness_states_user_id ON public.consciousness_states(user_id);
CREATE INDEX idx_consciousness_states_activated_at ON public.consciousness_states(activated_at);

CREATE INDEX idx_living_codex_user_id ON public.living_codex_entries(user_id);
CREATE INDEX idx_living_codex_status ON public.living_codex_entries(living_status);
CREATE INDEX idx_living_codex_concepts ON public.living_codex_entries USING GIN(extracted_concepts);

CREATE INDEX idx_synchronicities_user_id ON public.orchestrated_synchronicities(user_id);
CREATE INDEX idx_synchronicities_scheduled ON public.orchestrated_synchronicities(scheduled_window);

CREATE INDEX idx_sovereignty_user_id ON public.sovereignty_assessments(user_id);
CREATE INDEX idx_sovereignty_assessed_at ON public.sovereignty_assessments(assessed_at);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cognitive_mirrors_updated_at
    BEFORE UPDATE ON public.cognitive_mirrors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_tools_updated_at
    BEFORE UPDATE ON public.ai_generated_tools
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();