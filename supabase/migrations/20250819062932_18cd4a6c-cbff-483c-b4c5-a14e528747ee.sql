-- Add role column to profiles table if not exists (using existing app_role enum)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'member';

-- Create aura_jobs table for command execution tracking
CREATE TABLE IF NOT EXISTS public.aura_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level smallint NOT NULL CHECK (level IN (1,2,3)),
  command jsonb NOT NULL,
  preview jsonb,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','confirmed','running','success','failed','cancelled')),
  result jsonb,
  error text,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  executed_at timestamptz,
  completed_at timestamptz
);

-- Create aura_audit table for immutable audit trail
CREATE TABLE IF NOT EXISTS public.aura_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES public.aura_jobs(id) ON DELETE CASCADE,
  actor uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  target text,
  before jsonb,
  after jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create design_tokens_preview table for style sandbox
CREATE TABLE IF NOT EXISTS public.design_tokens_preview (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tokens jsonb NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT false
);

-- Create journal_templates table for user-generated templates
CREATE TABLE IF NOT EXISTS public.journal_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  fields jsonb NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create notifications table for announcements
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audience text NOT NULL,
  title text,
  body text NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.aura_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aura_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_tokens_preview ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for aura_jobs
CREATE POLICY "owner_admin_can_see_jobs" ON public.aura_jobs
  FOR SELECT USING (user_has_role(auth.uid(), 'owner'::app_role) OR user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "owner_admin_insert_jobs" ON public.aura_jobs
  FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'owner'::app_role) OR user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "owner_admin_update_jobs" ON public.aura_jobs
  FOR UPDATE USING (user_has_role(auth.uid(), 'owner'::app_role) OR user_has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for aura_audit
CREATE POLICY "owner_admin_read_audit" ON public.aura_audit
  FOR SELECT USING (user_has_role(auth.uid(), 'owner'::app_role) OR user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "owner_admin_write_audit" ON public.aura_audit
  FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'owner'::app_role) OR user_has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for design_tokens_preview
CREATE POLICY "owner_admin_manage_tokens" ON public.design_tokens_preview
  FOR ALL USING (user_has_role(auth.uid(), 'owner'::app_role) OR user_has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for journal_templates
CREATE POLICY "owner_admin_manage_templates" ON public.journal_templates
  FOR ALL USING (user_has_role(auth.uid(), 'owner'::app_role) OR user_has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for notifications
CREATE POLICY "anyone_can_read_notifications" ON public.notifications
  FOR SELECT USING (true);

CREATE POLICY "owner_admin_create_notifications" ON public.notifications
  FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'owner'::app_role) OR user_has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_aura_jobs_created_by ON public.aura_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_aura_jobs_status ON public.aura_jobs(status);
CREATE INDEX IF NOT EXISTS idx_aura_audit_job_id ON public.aura_audit(job_id);
CREATE INDEX IF NOT EXISTS idx_aura_audit_actor ON public.aura_audit(actor);

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.aura_jobs REPLICA IDENTITY FULL;