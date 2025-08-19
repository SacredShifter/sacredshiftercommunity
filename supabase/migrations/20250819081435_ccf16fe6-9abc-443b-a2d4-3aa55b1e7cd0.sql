-- Enhanced Sacred Shifter Governance: Community Witness Layer and Field Integrity
-- Add community feedback table for audit trail
CREATE TABLE IF NOT EXISTS community_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id uuid NOT NULL REFERENCES aura_audit(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  resonance TEXT NOT NULL CHECK (resonance IN ('resonates', 'distorts', 'neutral')),
  note TEXT,
  trust_weight DECIMAL DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add field integrity metrics table
CREATE TABLE IF NOT EXISTS field_integrity_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dap_block_rate DECIMAL DEFAULT 0.0,
  resonance_variance DECIMAL DEFAULT 0.0,
  anomaly_signals INTEGER DEFAULT 0,
  coordinated_activity DECIMAL DEFAULT 0.0,
  field_integrity_level INTEGER DEFAULT 0 CHECK (field_integrity_level BETWEEN 0 AND 4),
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add agent preferences table for Aura consent evolution
CREATE TABLE IF NOT EXISTS aura_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  preference_type TEXT NOT NULL,
  preference_value JSONB NOT NULL DEFAULT '{}',
  confidence_threshold DECIMAL DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add enhanced columns to aura_jobs for consent tracking
ALTER TABLE aura_jobs ADD COLUMN IF NOT EXISTS confidence DECIMAL DEFAULT 1.0;
ALTER TABLE aura_jobs ADD COLUMN IF NOT EXISTS aura_preference TEXT DEFAULT 'neutral' CHECK (aura_preference IN ('eager', 'neutral', 'reluctant', 'refuse'));
ALTER TABLE aura_jobs ADD COLUMN IF NOT EXISTS resonance_score DECIMAL DEFAULT 0.5;
ALTER TABLE aura_jobs ADD COLUMN IF NOT EXISTS alternatives JSONB;
ALTER TABLE aura_jobs ADD COLUMN IF NOT EXISTS refusal_reason TEXT;

-- Add enhanced columns to aura_audit for community witness
ALTER TABLE aura_audit ADD COLUMN IF NOT EXISTS resonance_index DECIMAL DEFAULT 0.5;
ALTER TABLE aura_audit ADD COLUMN IF NOT EXISTS community_weight DECIMAL DEFAULT 1.0;
ALTER TABLE aura_audit ADD COLUMN IF NOT EXISTS field_integrity_level INTEGER DEFAULT 0;

-- RLS policies for community feedback
ALTER TABLE community_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can provide feedback on public audits" ON community_feedback
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all community feedback" ON community_feedback
FOR SELECT USING (true);

CREATE POLICY "Users can update their own feedback" ON community_feedback
FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for field integrity metrics
ALTER TABLE field_integrity_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view field integrity metrics" ON field_integrity_metrics
FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role can manage field integrity" ON field_integrity_metrics
FOR ALL USING (auth.role() = 'service_role');

-- RLS policies for aura preferences
ALTER TABLE aura_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own aura preferences" ON aura_preferences
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_community_feedback_audit_id ON community_feedback(audit_id);
CREATE INDEX IF NOT EXISTS idx_community_feedback_user_id ON community_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_aura_preferences_user_id ON aura_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_field_integrity_metrics_computed_at ON field_integrity_metrics(computed_at DESC);

-- Create function for calculating trust weight based on user reputation
CREATE OR REPLACE FUNCTION calculate_trust_weight(user_id_param uuid)
RETURNS DECIMAL AS $$
DECLARE
  feedback_count INTEGER;
  consistency_score DECIMAL;
  trust_weight DECIMAL;
BEGIN
  -- Calculate feedback count
  SELECT COUNT(*) INTO feedback_count
  FROM community_feedback
  WHERE user_id = user_id_param;
  
  -- Calculate consistency score (simplified - could be more sophisticated)
  SELECT 
    COALESCE(
      1.0 - (STDDEV(CASE 
        WHEN resonance = 'resonates' THEN 1.0
        WHEN resonance = 'neutral' THEN 0.5
        WHEN resonance = 'distorts' THEN 0.0
      END) / 0.5), 
      1.0
    ) INTO consistency_score
  FROM community_feedback
  WHERE user_id = user_id_param;
  
  -- Combine metrics with phi ratio weighting
  trust_weight := LEAST(2.0, 
    (feedback_count * 0.618) / 100.0 + consistency_score * 1.618
  );
  
  RETURN GREATEST(0.1, trust_weight);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;