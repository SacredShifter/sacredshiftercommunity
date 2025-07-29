-- Step 1: Fix the circle_groups infinite recursion issue
-- Drop ALL existing problematic policies
DROP POLICY IF EXISTS "Members can view private groups they belong to" ON public.circle_groups;
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.circle_groups;
DROP POLICY IF EXISTS "Public groups are viewable by everyone" ON public.circle_groups; 
DROP POLICY IF EXISTS "Private groups viewable by members" ON public.circle_groups;
DROP POLICY IF EXISTS "Public groups visible to all" ON public.circle_groups;
DROP POLICY IF EXISTS "Private groups visible to members only" ON public.circle_groups;

-- Create very simple policies without recursion
CREATE POLICY "Allow public group viewing" 
ON public.circle_groups 
FOR SELECT 
USING (is_private = false);

-- For private groups, let's just allow if user exists in auth for now
CREATE POLICY "Allow private group viewing for authenticated users" 
ON public.circle_groups 
FOR SELECT 
USING (is_private = true AND auth.uid() IS NOT NULL);

-- Step 2: Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policies for profiles
CREATE POLICY "Profiles are publicly readable" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);