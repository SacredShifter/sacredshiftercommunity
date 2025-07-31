-- Check and create RLS policies for registry_entry_resonance if missing
CREATE POLICY IF NOT EXISTS "Users can view resonance data" 
ON public.registry_entry_resonance 
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their own resonance" 
ON public.registry_entry_resonance 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Also create missing registry_entry_shares table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.registry_entry_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.registry_of_resonance(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  circle_id UUID,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(entry_id, user_id, circle_id)
);

-- Enable RLS
ALTER TABLE public.registry_entry_shares ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shares
CREATE POLICY IF NOT EXISTS "Users can view shares" 
ON public.registry_entry_shares 
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "Users can manage their own shares" 
ON public.registry_entry_shares 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);