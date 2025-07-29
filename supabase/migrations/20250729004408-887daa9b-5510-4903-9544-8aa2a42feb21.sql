-- Create proper foreign key relationships between tables

-- Add user_id foreign key to profiles for sacred_post_comments
-- First check if there's already a foreign key
DO $$
BEGIN
    -- Add foreign key constraint for profiles if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'sacred_post_comments_user_id_fkey' 
        AND table_name = 'sacred_post_comments'
    ) THEN
        ALTER TABLE public.sacred_post_comments
        ADD CONSTRAINT sacred_post_comments_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint for sacred_posts if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'sacred_post_comments_post_id_fkey' 
        AND table_name = 'sacred_post_comments'
    ) THEN
        ALTER TABLE public.sacred_post_comments
        ADD CONSTRAINT sacred_post_comments_post_id_fkey 
        FOREIGN KEY (post_id) REFERENCES public.sacred_posts(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Ensure proper RLS policies for sacred_post_comments
DROP POLICY IF EXISTS "Users can view comments on posts they can see" ON public.sacred_post_comments;
DROP POLICY IF EXISTS "Users can create comments" ON public.sacred_post_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.sacred_post_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.sacred_post_comments;

-- Enable RLS
ALTER TABLE public.sacred_post_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sacred_post_comments
CREATE POLICY "Users can view all comments" 
ON public.sacred_post_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.sacred_post_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.sacred_post_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.sacred_post_comments 
FOR DELETE 
USING (auth.uid() = user_id);