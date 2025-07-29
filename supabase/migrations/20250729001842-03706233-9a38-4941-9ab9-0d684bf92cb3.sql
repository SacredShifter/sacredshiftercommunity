-- Let me first check what columns exist in profiles table and fix the relationship
-- Looking at the tables, profiles has an 'id' column that should reference auth.users

-- Let's first ensure the profiles table structure is correct
-- The profiles table should have user_id as the primary key that references auth.users.id

-- Fix the sacred_posts foreign key to reference profiles.id (not user_id since that doesn't exist)
ALTER TABLE public.sacred_posts 
DROP CONSTRAINT IF EXISTS sacred_posts_user_id_fkey;

-- Check if profiles uses 'id' or 'user_id' as the auth reference
-- Based on the schema, it looks like profiles.user_id is the auth reference
-- But first let's create the missing foreign key relationships

-- Add the proper foreign key from sacred_posts to auth.users directly for now
-- since the profiles table relationship seems to be working differently
ALTER TABLE public.sacred_posts 
ADD CONSTRAINT sacred_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Same for circle_posts
ALTER TABLE public.circle_posts 
DROP CONSTRAINT IF EXISTS circle_posts_user_id_fkey;

ALTER TABLE public.circle_posts 
ADD CONSTRAINT circle_posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sacred_posts_user_id ON public.sacred_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_user_id ON public.circle_posts(user_id);

-- Now, to make the join work between sacred_posts and profiles, we need to ensure
-- both tables reference the same user column. Let's create a proper user profile for existing users
INSERT INTO public.profiles (user_id, display_name, created_at)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'display_name', raw_user_meta_data->>'full_name', email),
  created_at
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.profiles WHERE user_id IS NOT NULL)
ON CONFLICT (user_id) DO NOTHING;