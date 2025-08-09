-- Create mirror journal entries table
CREATE TABLE public.mirror_journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  content TEXT,
  title TEXT,
  is_draft BOOLEAN DEFAULT false,
  mood_tag TEXT,
  chakra_alignment TEXT
);

-- Enable Row Level Security
ALTER TABLE public.mirror_journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own journal entries" 
ON public.mirror_journal_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" 
ON public.mirror_journal_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
ON public.mirror_journal_entries 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
ON public.mirror_journal_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mirror_journal_entries_updated_at
  BEFORE UPDATE ON public.mirror_journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_mirror_journal_entries_user_id ON public.mirror_journal_entries(user_id);
CREATE INDEX idx_mirror_journal_entries_created_at ON public.mirror_journal_entries(created_at DESC);