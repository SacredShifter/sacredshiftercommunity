-- Fix the posting system and circle integration

-- 1. Add group_id column to circle_posts to link posts to specific circles
ALTER TABLE public.circle_posts 
ADD COLUMN group_id uuid REFERENCES public.circle_groups(id) ON DELETE SET NULL;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_circle_posts_group_id ON public.circle_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_user_created ON public.circle_posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_circle_posts_group_created ON public.circle_posts(group_id, created_at DESC);

-- 3. Add title column to circle_posts (referenced in CreatePostModal but missing)
ALTER TABLE public.circle_posts 
ADD COLUMN title text;

-- 4. Create profiles table for user identities
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Update RLS policies for circle_posts to handle group_id
DROP POLICY IF EXISTS "Anyone can view posts" ON public.circle_posts;
CREATE POLICY "Public and circle posts are viewable by members" 
ON public.circle_posts FOR SELECT 
USING (
  visibility = 'public' OR 
  (visibility = 'circle' AND group_id IS NULL) OR
  (visibility = 'circle' AND group_id IS NOT NULL AND 
   EXISTS (
     SELECT 1 FROM public.circle_group_members 
     WHERE group_id = circle_posts.group_id 
     AND user_id = auth.uid()
   )
  ) OR
  user_id = auth.uid()
);

-- 9. Add source_module column to circle_posts (referenced in CreatePostModal)
ALTER TABLE public.circle_posts 
ADD COLUMN IF NOT EXISTS source_module text DEFAULT 'manual';

-- 10. Add tags column to circle_posts
ALTER TABLE public.circle_posts 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- 11. Create view for posts with profile data
CREATE OR REPLACE VIEW public.circle_posts_with_profiles AS
SELECT 
  cp.*,
  p.display_name,
  p.avatar_url,
  cg.name as circle_name
FROM public.circle_posts cp
LEFT JOIN public.profiles p ON cp.user_id = p.id
LEFT JOIN public.circle_groups cg ON cp.group_id = cg.id;

-- Grant access to the view
GRANT SELECT ON public.circle_posts_with_profiles TO authenticated;