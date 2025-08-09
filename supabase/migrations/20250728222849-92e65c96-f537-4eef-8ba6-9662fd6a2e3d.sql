-- Create codex_entries table for Sacred Feed
CREATE TABLE public.codex_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  title TEXT,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'circle', 'private')) DEFAULT 'public',
  circle_ids UUID[] DEFAULT '{}',
  source_module TEXT NOT NULL DEFAULT 'manual',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.codex_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own entries
CREATE POLICY "Users can view their own entries" 
ON public.codex_entries 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can view public entries
CREATE POLICY "Users can view public entries" 
ON public.codex_entries 
FOR SELECT 
USING (visibility = 'public');

-- Policy: Users can view circle entries if they're members
CREATE POLICY "Users can view circle entries if members" 
ON public.codex_entries 
FOR SELECT 
USING (
  visibility = 'circle' 
  AND EXISTS (
    SELECT 1 FROM public.circle_group_members cgm 
    WHERE cgm.user_id = auth.uid() 
    AND cgm.group_id = ANY(circle_ids)
  )
);

-- Policy: Users can create their own entries
CREATE POLICY "Users can create their own entries" 
ON public.codex_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own entries
CREATE POLICY "Users can update their own entries" 
ON public.codex_entries 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own entries
CREATE POLICY "Users can delete their own entries" 
ON public.codex_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_codex_entries_updated_at
BEFORE UPDATE ON public.codex_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_codex_entries_user_id ON public.codex_entries(user_id);
CREATE INDEX idx_codex_entries_visibility ON public.codex_entries(visibility);
CREATE INDEX idx_codex_entries_created_at ON public.codex_entries(created_at DESC);
CREATE INDEX idx_codex_entries_circle_ids ON public.codex_entries USING GIN(circle_ids);
CREATE INDEX idx_codex_entries_tags ON public.codex_entries USING GIN(tags);