-- Create agent_capabilities table to define what actions agents can perform
CREATE TABLE public.agent_capabilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capability_name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT true,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  allowed_parameters JSONB DEFAULT '[]'::jsonb,
  validation_rules JSONB DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent_actions table to store all actions requested by the AI
CREATE TABLE public.agent_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL REFERENCES public.agent_capabilities(capability_name),
  parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'executed', 'failed', 'expired')),
  requested_by TEXT NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  context JSONB DEFAULT '{}'::jsonb,
  result JSONB DEFAULT NULL,
  error_message TEXT DEFAULT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours'),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create agent_approvals table to track approval status
CREATE TABLE public.agent_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id UUID NOT NULL REFERENCES public.agent_actions(id),
  approved_by UUID NOT NULL,
  approved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approval_notes TEXT,
  approval_method TEXT NOT NULL DEFAULT 'dashboard' CHECK (approval_method IN ('dashboard', 'email', 'api', 'cli')),
  ip_address TEXT,
  user_agent TEXT
);

-- Create agent_logs table for comprehensive audit trail
CREATE TABLE public.agent_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  action_id UUID REFERENCES public.agent_actions(id),
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT
);

-- Create agent_whitelist table for users who can approve actions
CREATE TABLE public.agent_whitelist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  can_approve BOOLEAN NOT NULL DEFAULT false,
  can_configure BOOLEAN NOT NULL DEFAULT false,
  approval_scope JSONB DEFAULT '["*"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Kent Burchard to the whitelist with full permissions
INSERT INTO public.agent_whitelist (user_id, email, can_approve, can_configure, approval_scope)
SELECT 
  id, 
  'kentburchard@sacredshifter.com', 
  true, 
  true, 
  '["*"]'::jsonb
FROM 
  auth.users 
WHERE 
  email = 'kentburchard@sacredshifter.com'
ON CONFLICT (email) 
DO UPDATE SET 
  can_approve = true,
  can_configure = true,
  approval_scope = '["*"]'::jsonb,
  updated_at = now();

-- Create function to check if a user can approve agent actions
CREATE OR REPLACE FUNCTION public.can_approve_agent_actions(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_approved BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.agent_whitelist 
    WHERE agent_whitelist.user_id = $1 
    AND can_approve = true
  ) INTO is_approved;
  
  RETURN is_approved;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if a user can configure agent capabilities
CREATE OR REPLACE FUNCTION public.can_configure_agent_capabilities(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_approved BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.agent_whitelist 
    WHERE agent_whitelist.user_id = $1 
    AND can_configure = true
  ) INTO is_approved;
  
  RETURN is_approved;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log agent events
CREATE OR REPLACE FUNCTION public.log_agent_event(
  event_type TEXT,
  action_id UUID,
  details JSONB
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.agent_logs (event_type, action_id, user_id, details, ip_address, user_agent)
  VALUES (
    event_type,
    action_id,
    auth.uid(),
    details,
    request.header('X-Real-IP'),
    request.header('User-Agent')
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE public.agent_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_whitelist ENABLE ROW LEVEL SECURITY;

-- Create policies for agent_capabilities
CREATE POLICY "Anyone can view agent capabilities" 
ON public.agent_capabilities 
FOR SELECT 
USING (true);

CREATE POLICY "Only whitelisted users can insert agent capabilities" 
ON public.agent_capabilities 
FOR INSERT 
WITH CHECK (public.can_configure_agent_capabilities(auth.uid()));

CREATE POLICY "Only whitelisted users can update agent capabilities" 
ON public.agent_capabilities 
FOR UPDATE 
USING (public.can_configure_agent_capabilities(auth.uid()));

CREATE POLICY "Only whitelisted users can delete agent capabilities" 
ON public.agent_capabilities 
FOR DELETE 
USING (public.can_configure_agent_capabilities(auth.uid()));

-- Create policies for agent_actions
CREATE POLICY "Anyone can view agent actions" 
ON public.agent_actions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert agent actions" 
ON public.agent_actions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only whitelisted users can update agent actions" 
ON public.agent_actions 
FOR UPDATE 
USING (public.can_approve_agent_actions(auth.uid()));

-- Create policies for agent_approvals
CREATE POLICY "Anyone can view agent approvals" 
ON public.agent_approvals 
FOR SELECT 
USING (true);

CREATE POLICY "Only whitelisted users can insert agent approvals" 
ON public.agent_approvals 
FOR INSERT 
WITH CHECK (public.can_approve_agent_actions(auth.uid()));

-- Create policies for agent_logs
CREATE POLICY "Anyone can view agent logs" 
ON public.agent_logs 
FOR SELECT 
USING (true);

-- Create policies for agent_whitelist
CREATE POLICY "Anyone can view agent whitelist" 
ON public.agent_whitelist 
FOR SELECT 
USING (true);

CREATE POLICY "Only whitelisted users can manage whitelist" 
ON public.agent_whitelist 
FOR ALL 
USING (public.can_configure_agent_capabilities(auth.uid()));

-- Add default capabilities
INSERT INTO public.agent_capabilities 
  (capability_name, description, requires_approval, risk_level, allowed_parameters, validation_rules, is_enabled)
VALUES
  ('send_message', 'Send a direct message to a user', true, 'medium', 
   '["recipient_id", "content", "message_type"]'::jsonb, 
   '{"content": {"max_length": 2000, "required": true}, "recipient_id": {"required": true}}'::jsonb, 
   true),
   
  ('create_post', 'Create a post in a sacred circle', true, 'medium', 
   '["group_id", "content", "title", "tags", "visibility"]'::jsonb, 
   '{"content": {"max_length": 5000, "required": true}, "group_id": {"required": true}}'::jsonb, 
   true),
   
  ('analyze_data', 'Analyze user data and provide insights', true, 'medium', 
   '["user_id", "data_type", "parameters"]'::jsonb, 
   '{"user_id": {"required": true}, "data_type": {"required": true}}'::jsonb, 
   true),
   
  ('generate_content', 'Generate content for the platform', true, 'low', 
   '["content_type", "parameters", "target"]'::jsonb, 
   '{"content_type": {"required": true}}'::jsonb, 
   true),
   
  ('update_user_profile', 'Update a user profile', true, 'high', 
   '["user_id", "fields"]'::jsonb, 
   '{"user_id": {"required": true}, "fields": {"required": true}}'::jsonb, 
   false),
   
  ('modify_system_settings', 'Modify system settings', true, 'critical', 
   '["setting_name", "setting_value"]'::jsonb, 
   '{"setting_name": {"required": true}, "setting_value": {"required": true}}'::jsonb, 
   false);

-- Create triggers for updated_at columns
CREATE TRIGGER update_agent_capabilities_updated_at
BEFORE UPDATE ON public.agent_capabilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agent_whitelist_updated_at
BEFORE UPDATE ON public.agent_whitelist
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();