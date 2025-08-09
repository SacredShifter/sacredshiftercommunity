-- Create tables for registry entry comments and resonance voting

-- Registry entry comments table
CREATE TABLE public.registry_entry_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_anonymous BOOLEAN DEFAULT false,
  FOREIGN KEY (parent_comment_id) REFERENCES public.registry_entry_comments(id) ON DELETE CASCADE
);

-- Registry entry resonance votes table
CREATE TABLE public.registry_entry_resonance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(entry_id, user_id)
);

-- Registry entry shares table (for tracking shares to circles)
CREATE TABLE public.registry_entry_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID NOT NULL,
  user_id UUID NOT NULL,
  circle_id UUID,
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  message TEXT
);

-- Enable Row Level Security
ALTER TABLE public.registry_entry_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_entry_resonance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_entry_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments on public entries" 
ON public.registry_entry_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create comments" 
ON public.registry_entry_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.registry_entry_comments 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.registry_entry_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for resonance votes
CREATE POLICY "Anyone can view resonance votes" 
ON public.registry_entry_resonance 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can vote" 
ON public.registry_entry_resonance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" 
ON public.registry_entry_resonance 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for shares
CREATE POLICY "Users can view their own shares" 
ON public.registry_entry_shares 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can share entries" 
ON public.registry_entry_shares 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shares" 
ON public.registry_entry_shares 
FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update comment timestamps
CREATE OR REPLACE FUNCTION public.update_comment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment timestamps
CREATE TRIGGER update_registry_entry_comments_updated_at
BEFORE UPDATE ON public.registry_entry_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_comment_updated_at();

-- Add resonance_count column to registry_of_resonance table
ALTER TABLE public.registry_of_resonance 
ADD COLUMN IF NOT EXISTS resonance_count INTEGER DEFAULT 0;

-- Function to update resonance count
CREATE OR REPLACE FUNCTION public.update_registry_resonance_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.registry_of_resonance 
    SET resonance_count = (
      SELECT COUNT(*) FROM public.registry_entry_resonance 
      WHERE entry_id = NEW.entry_id
    )
    WHERE id = NEW.entry_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.registry_of_resonance 
    SET resonance_count = (
      SELECT COUNT(*) FROM public.registry_entry_resonance 
      WHERE entry_id = OLD.entry_id
    )
    WHERE id = OLD.entry_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update resonance count
CREATE TRIGGER update_resonance_count_trigger
AFTER INSERT OR DELETE ON public.registry_entry_resonance
FOR EACH ROW
EXECUTE FUNCTION public.update_registry_resonance_count();