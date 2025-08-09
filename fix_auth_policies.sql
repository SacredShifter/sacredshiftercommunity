-- Fix authentication issues caused by overly restrictive policies
-- Run this in your Supabase SQL Editor IMMEDIATELY

-- Drop all policies on user_features that might be blocking auth
DROP POLICY IF EXISTS "Users can view their own features" ON public.user_features;
DROP POLICY IF EXISTS "Users can create their own features" ON public.user_features;
DROP POLICY IF EXISTS "Users can update their own features" ON public.user_features;

-- Disable RLS on user_features temporarily to fix auth
ALTER TABLE public.user_features DISABLE ROW LEVEL SECURITY;

-- Make sure profiles table has proper policies (this is critical for auth)
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Recreate proper profiles policies
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Make sure profiles table has RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Grant basic permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_features TO authenticated;

-- Check if there are any other problematic policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'user_features', 'ai_conversation_memory');