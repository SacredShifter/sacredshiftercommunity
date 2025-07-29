-- Fix the posting system and circle integration (with proper error handling)

-- 1. Add group_id column to circle_posts to link posts to specific circles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'circle_posts' 
        AND column_name = 'group_id'
    ) THEN
        ALTER TABLE public.circle_posts 
        ADD COLUMN group_id uuid REFERENCES public.circle_groups(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_circle_posts_group_id ON public.circle_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_circle_posts_user_created ON public.circle_posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_circle_posts_group_created ON public.circle_posts(group_id, created_at DESC);

-- 3. Add title column to circle_posts (referenced in CreatePostModal but missing)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'circle_posts' 
        AND column_name = 'title'
    ) THEN
        ALTER TABLE public.circle_posts ADD COLUMN title text;
    END IF;
END $$;

-- 4. Add source_module column to circle_posts (referenced in CreatePostModal)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'circle_posts' 
        AND column_name = 'source_module'
    ) THEN
        ALTER TABLE public.circle_posts ADD COLUMN source_module text DEFAULT 'manual';
    END IF;
END $$;

-- 5. Add tags column to circle_posts
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'circle_posts' 
        AND column_name = 'tags'
    ) THEN
        ALTER TABLE public.circle_posts ADD COLUMN tags text[] DEFAULT '{}';
    END IF;
END $$;

-- 6. Update RLS policies for circle_posts to handle group_id
DROP POLICY IF EXISTS "Anyone can view posts" ON public.circle_posts;
DROP POLICY IF EXISTS "Public and circle posts are viewable by members" ON public.circle_posts;

CREATE POLICY "Posts are viewable by appropriate users" 
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

-- 7. Create view for posts with profile data
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