-- Fix the missing foreign key relationship between sacred_posts and profiles
-- The sacred_posts table needs to reference profiles, not auth.users directly

-- First, ensure we have the profiles table properly set up with foreign key to auth.users
-- (This should already exist from previous migration, but let's make sure)

-- Add foreign key constraint from sacred_posts.user_id to profiles.user_id
-- This allows Supabase to understand the relationship for joins
ALTER TABLE public.sacred_posts 
DROP CONSTRAINT IF EXISTS sacred_posts_user_id_fkey;

ALTER TABLE public.sacred_posts 
ADD CONSTRAINT sacred_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Also fix circle_posts to reference profiles
ALTER TABLE public.circle_posts 
DROP CONSTRAINT IF EXISTS circle_posts_user_id_fkey;

ALTER TABLE public.circle_posts 
ADD CONSTRAINT circle_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Create index for better performance on these joins
CREATE INDEX IF NOT EXISTS idx_sacred_posts_user_id ON public.sacred_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_user_id ON public.circle_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Make sure we have a trigger to auto-create profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();