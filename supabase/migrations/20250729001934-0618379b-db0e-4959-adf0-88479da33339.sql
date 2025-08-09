-- Fix the foreign key relationships properly
-- The profiles table uses 'id' as the primary key that references auth.users.id
-- So sacred_posts.user_id should reference profiles.id, not auth.users.id

-- First, ensure sacred_posts can reference profiles properly
ALTER TABLE public.sacred_posts 
DROP CONSTRAINT IF EXISTS sacred_posts_user_id_fkey;

ALTER TABLE public.sacred_posts 
ADD CONSTRAINT sacred_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Same for circle_posts
ALTER TABLE public.circle_posts 
DROP CONSTRAINT IF EXISTS circle_posts_user_id_fkey;

ALTER TABLE public.circle_posts 
ADD CONSTRAINT circle_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure all other user_id columns also reference profiles
ALTER TABLE public.circle_groups 
DROP CONSTRAINT IF EXISTS circle_groups_created_by_fkey;

ALTER TABLE public.circle_groups 
ADD CONSTRAINT circle_groups_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.circle_group_members 
DROP CONSTRAINT IF EXISTS circle_group_members_user_id_fkey;

ALTER TABLE public.circle_group_members 
ADD CONSTRAINT circle_group_members_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create profiles for all existing auth users who don't have profiles yet
INSERT INTO public.profiles (id, display_name, created_at)
SELECT 
  au.id, 
  COALESCE(au.raw_user_meta_data->>'display_name', au.raw_user_meta_data->>'full_name', au.email),
  au.created_at
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sacred_posts_user_id ON public.sacred_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_user_id ON public.circle_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_groups_created_by ON public.circle_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_circle_group_members_user_id ON public.circle_group_members(user_id);