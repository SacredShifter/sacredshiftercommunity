-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  reason TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create waitlist_signups table
CREATE TABLE IF NOT EXISTS public.waitlist_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  interest TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for contact_submissions
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read contact submissions" ON public.contact_submissions
FOR SELECT USING (auth.role() = 'service_role');

-- Create RLS policies for waitlist_signups
CREATE POLICY "Anyone can join waitlist" ON public.waitlist_signups
FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can read waitlist signups" ON public.waitlist_signups
FOR SELECT USING (auth.role() = 'service_role');

-- Create user_privacy_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_privacy_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analytics_consent BOOLEAN DEFAULT false,
  marketing_consent BOOLEAN DEFAULT false,
  profile_visibility BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  data_retention_preference TEXT DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for user_privacy_settings
ALTER TABLE public.user_privacy_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_privacy_settings
CREATE POLICY "Users can manage their own privacy settings" ON public.user_privacy_settings
FOR ALL USING (auth.uid() = user_id);

-- Create function to update privacy settings
CREATE OR REPLACE FUNCTION public.update_privacy_settings(
  p_analytics_consent BOOLEAN,
  p_marketing_consent BOOLEAN,
  p_profile_visibility BOOLEAN,
  p_notifications_enabled BOOLEAN,
  p_data_retention_preference TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_privacy_settings (
    user_id,
    analytics_consent,
    marketing_consent,
    profile_visibility,
    notifications_enabled,
    data_retention_preference,
    updated_at
  )
  VALUES (
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
    analytics_consent = EXCLUDED.analytics_consent,
    marketing_consent = EXCLUDED.marketing_consent,
    profile_visibility = EXCLUDED.profile_visibility,
    notifications_enabled = EXCLUDED.notifications_enabled,
    data_retention_preference = EXCLUDED.data_retention_preference,
    updated_at = now();
END;
$$;