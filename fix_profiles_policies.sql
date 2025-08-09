-- Fix profiles table RLS policies for Messages functionality
-- Run this in your Supabase SQL Editor

-- First, let's check the current state of the profiles table
SELECT 'Current profiles table structure:' as info;
\d public.profiles;

-- Check current policies
SELECT 'Current RLS policies on profiles:' as info;
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;

-- Drop ALL existing policies on profiles table to start fresh
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create clean, working policies
-- Allow all authenticated users to view all profiles (needed for contact list)
CREATE POLICY "profiles_select_all" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Allow users to insert their own profile
CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "profiles_update_own" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profile
CREATE POLICY "profiles_delete_own" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
GRANT DELETE ON public.profiles TO authenticated;

-- Verify the new policies
SELECT 'New RLS policies on profiles:' as info;
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;

-- Test the policies by checking if we can see profiles
SELECT 'Testing profile visibility:' as info;
SELECT COUNT(*) as profile_count FROM public.profiles;

-- Show some sample profiles (without sensitive data)
SELECT 'Sample profiles:' as info;
SELECT user_id, display_name, created_at 
FROM public.profiles 
LIMIT 5;

SELECT 'Profiles table RLS policies have been fixed!' as result;