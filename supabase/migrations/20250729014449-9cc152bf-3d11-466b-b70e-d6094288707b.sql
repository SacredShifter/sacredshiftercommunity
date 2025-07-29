-- Create comprehensive privacy compliance tables for production

-- User privacy settings table
CREATE TABLE IF NOT EXISTS public.user_privacy_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analytics_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  profile_visibility BOOLEAN NOT NULL DEFAULT true,
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  data_retention_preference TEXT DEFAULT 'standard' CHECK (data_retention_preference IN ('minimal', 'standard', 'extended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Privacy consent audit trail
CREATE TABLE IF NOT EXISTS public.privacy_consent_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('analytics', 'marketing', 'profile_visibility', 'notifications', 'data_retention')),
  previous_value BOOLEAN,
  new_value BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  consent_method TEXT DEFAULT 'settings_page' CHECK (consent_method IN ('settings_page', 'onboarding', 'popup', 'api')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Data access requests (for exports and deletions)
CREATE TABLE IF NOT EXISTS public.data_access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'deletion', 'rectification', 'portability')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  request_details JSONB DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  file_path TEXT, -- For export files
  admin_notes TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Enhanced data access log for compliance
CREATE TABLE IF NOT EXISTS public.data_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accessed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Who accessed the data
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'edit', 'delete', 'export', 'share', 'admin_access')),
  table_name TEXT NOT NULL,
  record_id UUID,
  data_classification TEXT DEFAULT 'personal' CHECK (data_classification IN ('public', 'personal', 'sensitive', 'restricted')),
  purpose TEXT, -- Why the data was accessed
  legal_basis TEXT, -- Legal basis under Privacy Act
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Privacy notice acknowledgments
CREATE TABLE IF NOT EXISTS public.privacy_notice_acknowledgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notice_version TEXT NOT NULL,
  notice_type TEXT NOT NULL CHECK (notice_type IN ('privacy_policy', 'terms_of_service', 'cookie_policy', 'data_processing')),
  acknowledged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_consent_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_notice_acknowledgments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_privacy_settings
CREATE POLICY "Users can view their own privacy settings" 
ON public.user_privacy_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own privacy settings" 
ON public.user_privacy_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own privacy settings" 
ON public.user_privacy_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for privacy_consent_history
CREATE POLICY "Users can view their own consent history" 
ON public.privacy_consent_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert consent history" 
ON public.privacy_consent_history 
FOR INSERT 
WITH CHECK (true); -- Allow system to log consent changes

-- RLS Policies for data_access_requests
CREATE POLICY "Users can view their own data requests" 
ON public.data_access_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create data requests" 
ON public.data_access_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending requests" 
ON public.data_access_requests 
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

-- RLS Policies for data_access_log
CREATE POLICY "Users can view their own access logs" 
ON public.data_access_log 
FOR SELECT 
USING (auth.uid() = user_id OR auth.uid() = accessed_by);

CREATE POLICY "System can insert access logs" 
ON public.data_access_log 
FOR INSERT 
WITH CHECK (true);

-- RLS Policies for privacy_notice_acknowledgments
CREATE POLICY "Users can view their own acknowledgments" 
ON public.privacy_notice_acknowledgments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert acknowledgments" 
ON public.privacy_notice_acknowledgments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to log data access for compliance
CREATE OR REPLACE FUNCTION public.log_data_access(
  p_user_id UUID,
  p_access_type TEXT,
  p_table_name TEXT,
  p_record_id UUID DEFAULT NULL,
  p_purpose TEXT DEFAULT NULL,
  p_legal_basis TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.data_access_log (
    user_id,
    accessed_by,
    access_type,
    table_name,
    record_id,
    purpose,
    legal_basis,
    created_at
  ) VALUES (
    p_user_id,
    auth.uid(),
    p_access_type,
    p_table_name,
    p_record_id,
    p_purpose,
    p_legal_basis,
    now()
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update privacy settings with audit trail
CREATE OR REPLACE FUNCTION public.update_privacy_settings(
  p_analytics_consent BOOLEAN,
  p_marketing_consent BOOLEAN,
  p_profile_visibility BOOLEAN,
  p_notifications_enabled BOOLEAN,
  p_data_retention_preference TEXT DEFAULT 'standard'
) RETURNS UUID AS $$
DECLARE
  settings_id UUID;
  current_settings RECORD;
BEGIN
  -- Get current settings
  SELECT * INTO current_settings 
  FROM public.user_privacy_settings 
  WHERE user_id = auth.uid();
  
  -- Insert or update privacy settings
  INSERT INTO public.user_privacy_settings (
    user_id,
    analytics_consent,
    marketing_consent,
    profile_visibility,
    notifications_enabled,
    data_retention_preference,
    updated_at
  ) VALUES (
    auth.uid(),
    p_analytics_consent,
    p_marketing_consent,
    p_profile_visibility,
    p_notifications_enabled,
    p_data_retention_preference,
    now()
  ) 
  ON CONFLICT (user_id) 
  DO UPDATE SET
    analytics_consent = p_analytics_consent,
    marketing_consent = p_marketing_consent,
    profile_visibility = p_profile_visibility,
    notifications_enabled = p_notifications_enabled,
    data_retention_preference = p_data_retention_preference,
    updated_at = now()
  RETURNING id INTO settings_id;
  
  -- Log consent changes
  IF current_settings.id IS NOT NULL THEN
    -- Log analytics consent change
    IF current_settings.analytics_consent != p_analytics_consent THEN
      INSERT INTO public.privacy_consent_history (user_id, consent_type, previous_value, new_value)
      VALUES (auth.uid(), 'analytics', current_settings.analytics_consent, p_analytics_consent);
    END IF;
    
    -- Log marketing consent change
    IF current_settings.marketing_consent != p_marketing_consent THEN
      INSERT INTO public.privacy_consent_history (user_id, consent_type, previous_value, new_value)
      VALUES (auth.uid(), 'marketing', current_settings.marketing_consent, p_marketing_consent);
    END IF;
    
    -- Log profile visibility change
    IF current_settings.profile_visibility != p_profile_visibility THEN
      INSERT INTO public.privacy_consent_history (user_id, consent_type, previous_value, new_value)
      VALUES (auth.uid(), 'profile_visibility', current_settings.profile_visibility, p_profile_visibility);
    END IF;
    
    -- Log notifications change
    IF current_settings.notifications_enabled != p_notifications_enabled THEN
      INSERT INTO public.privacy_consent_history (user_id, consent_type, previous_value, new_value)
      VALUES (auth.uid(), 'notifications', current_settings.notifications_enabled, p_notifications_enabled);
    END IF;
  ELSE
    -- First time settings, log initial consents
    INSERT INTO public.privacy_consent_history (user_id, consent_type, previous_value, new_value)
    VALUES 
      (auth.uid(), 'analytics', NULL, p_analytics_consent),
      (auth.uid(), 'marketing', NULL, p_marketing_consent),
      (auth.uid(), 'profile_visibility', NULL, p_profile_visibility),
      (auth.uid(), 'notifications', NULL, p_notifications_enabled);
  END IF;
  
  -- Log the settings update
  PERFORM public.log_data_access(
    auth.uid(),
    'edit',
    'user_privacy_settings',
    settings_id,
    'User updated privacy settings',
    'Legitimate interest - user account management'
  );
  
  RETURN settings_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create automatic timestamp update trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_privacy_settings_updated_at
  BEFORE UPDATE ON public.user_privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_privacy_settings_user_id ON public.user_privacy_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_consent_history_user_id ON public.privacy_consent_history(user_id);
CREATE INDEX IF NOT EXISTS idx_privacy_consent_history_created_at ON public.privacy_consent_history(created_at);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_user_id ON public.data_access_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_access_requests_status ON public.data_access_requests(status);
CREATE INDEX IF NOT EXISTS idx_data_access_log_user_id ON public.data_access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_data_access_log_created_at ON public.data_access_log(created_at);
CREATE INDEX IF NOT EXISTS idx_privacy_notice_ack_user_id ON public.privacy_notice_acknowledgments(user_id);