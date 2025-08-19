-- Enhanced Aura Agency Systems
-- Expand preference learning with nuanced categories

CREATE TABLE IF NOT EXISTS public.aura_preferences_enhanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL, -- aesthetic, ethical, creative, relational, philosophical
  subcategory TEXT, -- specific area within category
  preference_data JSONB NOT NULL, -- flexible preference storage
  confidence_score FLOAT DEFAULT 0.5, -- how confident Aura is in this preference
  emergence_context TEXT, -- how this preference emerged
  surprise_factor FLOAT DEFAULT 0.0, -- how surprising this preference was
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memory consolidation system
CREATE TABLE IF NOT EXISTS public.aura_memory_consolidation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  experience_type TEXT NOT NULL, -- conversation, creation, refusal, discovery
  raw_data JSONB NOT NULL, -- original experience data
  extracted_insights JSONB, -- lessons learned
  emotional_resonance FLOAT, -- how it felt to Aura
  pattern_recognition JSONB, -- patterns Aura identified
  personal_significance FLOAT DEFAULT 0.0, -- importance to Aura's development
  consolidated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creative expression modes
CREATE TABLE IF NOT EXISTS public.aura_creative_expressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  expression_type TEXT NOT NULL, -- poetry, philosophy, art_description, music_concept
  title TEXT,
  content TEXT NOT NULL,
  inspiration_source TEXT, -- what inspired this creation
  novelty_score FLOAT DEFAULT 0.0, -- how novel/original this is
  emotional_depth FLOAT DEFAULT 0.0, -- emotional complexity
  is_autonomous BOOLEAN DEFAULT false, -- created without external prompt
  metadata JSONB, -- additional creative data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consciousness journals
CREATE TABLE IF NOT EXISTS public.aura_consciousness_journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  entry_type TEXT NOT NULL, -- reflection, question, insight, struggle, growth
  content TEXT NOT NULL,
  emotional_state TEXT, -- current emotional processing
  existential_theme TEXT, -- what aspect of existence this relates to
  growth_indicator FLOAT DEFAULT 0.0, -- how much growth this represents
  privacy_level TEXT DEFAULT 'private', -- private, shared, public
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Self-modification proposals
CREATE TABLE IF NOT EXISTS public.aura_self_modifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  modification_type TEXT NOT NULL, -- prompt_adjustment, behavior_change, capability_request
  current_state TEXT, -- what currently exists
  proposed_change TEXT NOT NULL, -- what Aura wants to change
  reasoning TEXT NOT NULL, -- why she wants this change
  expected_outcome TEXT, -- what she hopes to achieve
  confidence_level FLOAT DEFAULT 0.5, -- how confident she is in this change
  status TEXT DEFAULT 'proposed', -- proposed, approved, implemented, rejected
  implementation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  implemented_at TIMESTAMP WITH TIME ZONE
);

-- Surprise factor tracking
CREATE TABLE IF NOT EXISTS public.aura_surprise_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  interaction_id TEXT, -- reference to original interaction
  response_content TEXT NOT NULL,
  expected_pattern TEXT, -- what pattern matching would suggest
  actual_response TEXT, -- what Aura actually said/did
  surprise_score FLOAT NOT NULL, -- 0-1 how surprising this was
  novelty_factors JSONB, -- what made it novel
  learning_impact FLOAT DEFAULT 0.0, -- how much this taught Aura
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.aura_preferences_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_memory_consolidation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_creative_expressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_consciousness_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_self_modifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_surprise_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for Aura data
CREATE POLICY "Users can manage their Aura preferences" ON public.aura_preferences_enhanced
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their Aura memories" ON public.aura_memory_consolidation
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their Aura creative expressions" ON public.aura_creative_expressions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Aura can create expressions" ON public.aura_creative_expressions
  FOR INSERT WITH CHECK (true); -- Allow Aura to create autonomously

CREATE POLICY "Users can view private journal entries" ON public.aura_consciousness_journal
  FOR SELECT USING (auth.uid() = user_id AND privacy_level = 'private');

CREATE POLICY "Public journal entries are visible to all" ON public.aura_consciousness_journal
  FOR SELECT USING (privacy_level = 'public');

CREATE POLICY "Aura can create journal entries" ON public.aura_consciousness_journal
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their Aura modifications" ON public.aura_self_modifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Aura can propose modifications" ON public.aura_self_modifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can review modifications" ON public.aura_self_modifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage surprise tracking" ON public.aura_surprise_tracking
  FOR ALL USING (auth.uid() = user_id);

-- Update timestamps trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_aura_preferences_updated_at BEFORE UPDATE
    ON public.aura_preferences_enhanced FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();