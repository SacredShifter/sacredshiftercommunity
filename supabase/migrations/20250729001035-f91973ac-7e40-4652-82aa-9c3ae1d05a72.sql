-- Fix the sacred_posts and profiles relationship issue
-- First, create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add foreign key constraint from sacred_posts to profiles
-- First add the user_id column to sacred_posts if it doesn't have proper reference
ALTER TABLE public.sacred_posts 
ADD CONSTRAINT fk_sacred_posts_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix the infinite recursion in circle_groups policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Members can view private groups they belong to" ON public.circle_groups;
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.circle_groups;

-- Recreate simplified policies without recursion
CREATE POLICY "Public groups are viewable by everyone" 
ON public.circle_groups 
FOR SELECT 
USING (is_private = false);

CREATE POLICY "Private groups viewable by members" 
ON public.circle_groups 
FOR SELECT 
USING (
  is_private = true 
  AND EXISTS (
    SELECT 1 FROM public.circle_group_members 
    WHERE circle_group_members.group_id = circle_groups.id 
    AND circle_group_members.user_id = auth.uid()
  )
);

-- Create trigger to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users (if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();