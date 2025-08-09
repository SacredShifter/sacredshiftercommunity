-- Create personal codex entries table for user memory archive
CREATE TABLE personal_codex_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'Fragment',
  resonance_tags TEXT[] DEFAULT '{}',
  source_module TEXT,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE personal_codex_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own codex entries" 
ON personal_codex_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own codex entries" 
ON personal_codex_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own codex entries" 
ON personal_codex_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own codex entries" 
ON personal_codex_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_personal_codex_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_personal_codex_updated_at
BEFORE UPDATE ON personal_codex_entries
FOR EACH ROW
EXECUTE FUNCTION update_personal_codex_updated_at_column();