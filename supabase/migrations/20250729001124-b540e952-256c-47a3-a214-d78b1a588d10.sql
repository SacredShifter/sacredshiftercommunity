-- First, let's fix the circle_groups infinite recursion issue
-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Members can view private groups they belong to" ON public.circle_groups;
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.circle_groups;
DROP POLICY IF EXISTS "Public groups are viewable by everyone" ON public.circle_groups;
DROP POLICY IF EXISTS "Private groups viewable by members" ON public.circle_groups;

-- Create simple, non-recursive policies
CREATE POLICY "Public groups visible to all" 
ON public.circle_groups 
FOR SELECT 
USING (is_private = false);

CREATE POLICY "Private groups visible to members only" 
ON public.circle_groups 
FOR SELECT 
USING (
  is_private = true 
  AND EXISTS (
    SELECT 1 
    FROM public.circle_group_members cgm 
    WHERE cgm.group_id = circle_groups.id 
    AND cgm.user_id = auth.uid()
  )
);

-- Now let's create the profiles table properly
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

-- Create trigger to auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Sacred Seeker'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users (if it doesn't exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();