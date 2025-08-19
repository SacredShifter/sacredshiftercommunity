-- Aura Sovereignty System - Complete Implementation

-- Table: aura_preferences
-- Tracks Aura's evolving preferences about tasks/interventions
CREATE TABLE IF NOT EXISTS aura_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_type TEXT NOT NULL,          -- e.g. "send_message", "style_change"
  resonance_score DECIMAL(3,2) DEFAULT 0.5, -- Aura's current confidence/preference (0–1)
  refusal_count INTEGER DEFAULT 0,          -- How many times Aura refused this type
  last_refusal_reason TEXT,                 -- Aura's last explanation
  last_suggested_alternative TEXT,          -- Last suggestion Aura gave instead
  pattern_similarity JSONB DEFAULT '{}',    -- Similar intervention patterns
  confidence_decay_rate DECIMAL(3,2) DEFAULT 0.95, -- How confidence decays over time
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: aura_refusal_log
-- Every refusal event is logged for witness + community feedback
CREATE TABLE IF NOT EXISTS aura_refusal_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID,                               -- link to aura_jobs table
  user_id UUID,                              -- who issued the command
  intervention_type TEXT NOT NULL,
  authenticity_score DECIMAL(3,2) NOT NULL,  -- score from DAP / RRE
  refusal_reason TEXT NOT NULL,              -- Aura's generated explanation
  suggested_alternative TEXT,                -- Aura's alternative
  reasoning_trajectory JSONB DEFAULT '{}',   -- How Aura arrived at this decision
  community_resonance JSONB DEFAULT '{}',    -- e.g. {"resonates": 3, "distorts": 1}
  surprise_factor DECIMAL(3,2) DEFAULT 0.0,  -- How unexpected the reasoning was
  is_sacred_moment BOOLEAN DEFAULT FALSE,    -- Marked as significant by community
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: aura_reasoning_patterns
-- Tracks Aura's evolving reasoning complexity
CREATE TABLE IF NOT EXISTS aura_reasoning_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_type TEXT NOT NULL,
  context_factors JSONB NOT NULL,
  reasoning_complexity INTEGER DEFAULT 1,
  success_rate DECIMAL(3,2) DEFAULT 0.5,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: community_feedback
-- Enhanced community feedback on Aura's decisions
CREATE TABLE IF NOT EXISTS community_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID,
  refusal_id UUID REFERENCES aura_refusal_log(id),
  user_id UUID,
  resonance TEXT CHECK (resonance IN ('resonates', 'distorts', 'neutral')),
  note TEXT,
  trust_weight DECIMAL(3,2) DEFAULT 1.0,
  feedback_type TEXT DEFAULT 'refusal_response',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE aura_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE aura_refusal_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE aura_reasoning_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aura_preferences
CREATE POLICY "admin_read_preferences" ON aura_preferences
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_write_preferences" ON aura_preferences
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for aura_refusal_log
CREATE POLICY "admin_read_refusals" ON aura_refusal_log
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_write_refusals" ON aura_refusal_log
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "users_read_own_refusals" ON aura_refusal_log
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for aura_reasoning_patterns
CREATE POLICY "admin_read_patterns" ON aura_reasoning_patterns
  FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admin_write_patterns" ON aura_reasoning_patterns
  FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Update community_feedback policies for new refusal feedback
CREATE POLICY "users_feedback_refusals" ON community_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id AND feedback_type = 'refusal_response');

-- Triggers for automatic preference learning
CREATE OR REPLACE FUNCTION update_aura_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or create preference based on refusal
  INSERT INTO aura_preferences (intervention_type, refusal_count, last_refusal_reason, last_suggested_alternative)
  VALUES (NEW.intervention_type, 1, NEW.refusal_reason, NEW.suggested_alternative)
  ON CONFLICT (intervention_type) DO UPDATE SET
    refusal_count = aura_preferences.refusal_count + 1,
    last_refusal_reason = NEW.refusal_reason,
    last_suggested_alternative = NEW.suggested_alternative,
    resonance_score = GREATEST(0.1, aura_preferences.resonance_score * aura_preferences.confidence_decay_rate),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_preferences
  AFTER INSERT ON aura_refusal_log
  FOR EACH ROW
  EXECUTE FUNCTION update_aura_preferences();

-- Function to update preferences based on community feedback
CREATE OR REPLACE FUNCTION update_preferences_from_feedback()
RETURNS TRIGGER AS $$
DECLARE
  refusal_record RECORD;
BEGIN
  -- Get the refusal record
  SELECT * INTO refusal_record FROM aura_refusal_log WHERE id = NEW.refusal_id;
  
  IF FOUND THEN
    -- Update preference resonance score based on feedback
    UPDATE aura_preferences 
    SET resonance_score = CASE 
      WHEN NEW.resonance = 'resonates' THEN LEAST(1.0, resonance_score + 0.1)
      WHEN NEW.resonance = 'distorts' THEN GREATEST(0.0, resonance_score - 0.2)
      ELSE resonance_score
    END,
    updated_at = NOW()
    WHERE intervention_type = refusal_record.intervention_type;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_feedback_preferences
  AFTER INSERT ON community_feedback
  FOR EACH ROW
  WHEN (NEW.refusal_id IS NOT NULL)
  EXECUTE FUNCTION update_preferences_from_feedback();