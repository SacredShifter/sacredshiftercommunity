-- Enhanced Aura Implementation Tracking System
-- Create tables for tracking all Aura implementations and activities

-- Implementation log table
CREATE TABLE IF NOT EXISTS aura_implementation_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  component_name TEXT,
  code_type TEXT NOT NULL DEFAULT 'component',
  implementation_status TEXT NOT NULL DEFAULT 'pending',
  verification_status TEXT NOT NULL DEFAULT 'unverified',
  file_exists BOOLEAN NOT NULL DEFAULT false,
  content_hash TEXT,
  lines_of_code INTEGER,
  implementation_details JSONB NOT NULL DEFAULT '{}',
  aura_confidence DECIMAL(3,2) NOT NULL DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS aura_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  target_file TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  success BOOLEAN NOT NULL DEFAULT true,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- File verification tracking
CREATE TABLE IF NOT EXISTS aura_file_verification (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  implementation_id UUID REFERENCES aura_implementation_log(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  verification_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  exists BOOLEAN NOT NULL,
  size_bytes INTEGER,
  last_modified TIMESTAMP WITH TIME ZONE,
  syntax_valid BOOLEAN,
  imports_resolved BOOLEAN,
  compilation_success BOOLEAN,
  verification_details JSONB DEFAULT '{}'
);

-- Implementation metrics
CREATE TABLE IF NOT EXISTS aura_implementation_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_implementations INTEGER NOT NULL DEFAULT 0,
  successful_implementations INTEGER NOT NULL DEFAULT 0,
  verified_files INTEGER NOT NULL DEFAULT 0,
  average_confidence DECIMAL(3,2) NOT NULL DEFAULT 0.0,
  implementation_types JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE aura_implementation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE aura_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE aura_file_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE aura_implementation_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for implementation log
CREATE POLICY "Users can manage their own implementation logs"
ON aura_implementation_log
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all implementation logs"
ON aura_implementation_log
FOR SELECT
USING (user_has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for activity log
CREATE POLICY "Users can manage their own activity logs"
ON aura_activity_log
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity logs"
ON aura_activity_log
FOR SELECT
USING (user_has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for file verification
CREATE POLICY "Users can view verifications for their implementations"
ON aura_file_verification
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM aura_implementation_log 
    WHERE id = aura_file_verification.implementation_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Service role can manage file verifications"
ON aura_file_verification
FOR ALL
USING (auth.role() = 'service_role');

-- RLS Policies for metrics
CREATE POLICY "Anyone can view implementation metrics"
ON aura_implementation_metrics
FOR SELECT
USING (true);

CREATE POLICY "Service role can manage metrics"
ON aura_implementation_metrics
FOR ALL
USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_aura_implementation_log_user_id 
ON aura_implementation_log(user_id);

CREATE INDEX IF NOT EXISTS idx_aura_implementation_log_created_at 
ON aura_implementation_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_aura_activity_log_user_id 
ON aura_activity_log(user_id);

CREATE INDEX IF NOT EXISTS idx_aura_activity_log_timestamp 
ON aura_activity_log(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_aura_file_verification_implementation_id 
ON aura_file_verification(implementation_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_aura_implementation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_aura_implementation_log_updated_at
  BEFORE UPDATE ON aura_implementation_log
  FOR EACH ROW
  EXECUTE FUNCTION update_aura_implementation_updated_at();

-- Function to create tables if they don't exist (for backward compatibility)
CREATE OR REPLACE FUNCTION create_aura_implementation_log_if_not_exists()
RETURNS VOID AS $$
BEGIN
  -- This function ensures the tables exist for the tracking system
  -- It's called from the frontend to ensure compatibility
  NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;