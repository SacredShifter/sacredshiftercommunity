-- Create registry_of_resonance table
CREATE TABLE public.registry_of_resonance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  resonance_rating NUMERIC NOT NULL DEFAULT 0 CHECK (resonance_rating >= 0 AND resonance_rating <= 100),
  resonance_signature TEXT,
  tags TEXT[] DEFAULT '{}',
  entry_type TEXT NOT NULL DEFAULT 'Personal',
  access_level TEXT NOT NULL DEFAULT 'Private' CHECK (access_level IN ('Private', 'Circle', 'Public')),
  is_verified BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.registry_of_resonance ENABLE ROW LEVEL SECURITY;

-- Create policies for registry access
CREATE POLICY "Users can view their own registry entries" 
ON public.registry_of_resonance 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public verified entries" 
ON public.registry_of_resonance 
FOR SELECT 
USING (access_level = 'Public' AND is_verified = true);

CREATE POLICY "Users can create their own registry entries" 
ON public.registry_of_resonance 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registry entries" 
ON public.registry_of_resonance 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own registry entries" 
ON public.registry_of_resonance 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_registry_updated_at
BEFORE UPDATE ON public.registry_of_resonance
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create AI assistant edge function for registry analysis
CREATE TABLE public.ai_assistant_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL,
  context_data JSONB,
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for AI requests
ALTER TABLE public.ai_assistant_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI requests" 
ON public.ai_assistant_requests 
FOR ALL 
USING (auth.uid() = user_id);