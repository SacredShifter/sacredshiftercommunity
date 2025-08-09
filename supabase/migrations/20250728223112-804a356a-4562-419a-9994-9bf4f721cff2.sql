-- Create sacred_posts table for the Sacred Feed
CREATE TABLE public.sacred_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  title TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'circle', 'private')) DEFAULT 'public',
  circle_ids UUID[] DEFAULT '{}',
  source_module TEXT NOT NULL DEFAULT 'manual',
  tags TEXT[] DEFAULT '{}',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sacred_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own posts
CREATE POLICY "Users can view their own posts" 
ON public.sacred_posts 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can view public posts
CREATE POLICY "Users can view public posts" 
ON public.sacred_posts 
FOR SELECT 
USING (visibility = 'public');

-- Policy: Users can view circle posts if they're members
CREATE POLICY "Users can view circle posts if members" 
ON public.sacred_posts 
FOR SELECT 
USING (
  visibility = 'circle' 
  AND EXISTS (
    SELECT 1 FROM public.circle_group_members cgm 
    WHERE cgm.user_id = auth.uid() 
    AND cgm.group_id = ANY(circle_ids)
  )
);

-- Policy: Users can create their own posts
CREATE POLICY "Users can create their own posts" 
ON public.sacred_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own posts
CREATE POLICY "Users can update their own posts" 
ON public.sacred_posts 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own posts
CREATE POLICY "Users can delete their own posts" 
ON public.sacred_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_sacred_posts_updated_at
BEFORE UPDATE ON public.sacred_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create performance indexes
CREATE INDEX idx_sacred_posts_user_id ON public.sacred_posts(user_id);
CREATE INDEX idx_sacred_posts_visibility ON public.sacred_posts(visibility);
CREATE INDEX idx_sacred_posts_created_at ON public.sacred_posts(created_at DESC);
CREATE INDEX idx_sacred_posts_circle_ids ON public.sacred_posts USING GIN(circle_ids);
CREATE INDEX idx_sacred_posts_tags ON public.sacred_posts USING GIN(tags);

-- Create likes table for post interactions
CREATE TABLE public.sacred_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.sacred_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS on likes table
ALTER TABLE public.sacred_post_likes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view likes
CREATE POLICY "Anyone can view likes" 
ON public.sacred_post_likes 
FOR SELECT 
USING (true);

-- Policy: Users can like posts
CREATE POLICY "Users can like posts" 
ON public.sacred_post_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can remove their own likes
CREATE POLICY "Users can remove their own likes" 
ON public.sacred_post_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create comments table for post interactions
CREATE TABLE public.sacred_post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.sacred_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.sacred_post_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comments table
ALTER TABLE public.sacred_post_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view comments
CREATE POLICY "Anyone can view comments" 
ON public.sacred_post_comments 
FOR SELECT 
USING (true);

-- Policy: Users can create comments
CREATE POLICY "Users can create comments" 
ON public.sacred_post_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own comments
CREATE POLICY "Users can update their own comments" 
ON public.sacred_post_comments 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own comments
CREATE POLICY "Users can delete their own comments" 
ON public.sacred_post_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for comments updated_at
CREATE TRIGGER update_sacred_post_comments_updated_at
BEFORE UPDATE ON public.sacred_post_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for comments
CREATE INDEX idx_sacred_post_comments_post_id ON public.sacred_post_comments(post_id);
CREATE INDEX idx_sacred_post_comments_user_id ON public.sacred_post_comments(user_id);
CREATE INDEX idx_sacred_post_comments_created_at ON public.sacred_post_comments(created_at DESC);