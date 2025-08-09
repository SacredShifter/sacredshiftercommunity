-- Create banned_users table if it doesn't exist
-- This table is referenced by the is_user_banned function in RLS policies

CREATE TABLE IF NOT EXISTS public.banned_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  banned_by uuid REFERENCES auth.users(id),
  reason text,
  is_permanent boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;

-- Create policies for banned_users table
CREATE POLICY "Admins can view all banned users" ON public.banned_users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND is_admin = true
  )
);

CREATE POLICY "Admins can manage banned users" ON public.banned_users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND is_admin = true
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_banned_users_user_id ON public.banned_users(user_id);
CREATE INDEX IF NOT EXISTS idx_banned_users_expires_at ON public.banned_users(expires_at) WHERE expires_at IS NOT NULL;

-- Grant permissions
GRANT SELECT ON public.banned_users TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
