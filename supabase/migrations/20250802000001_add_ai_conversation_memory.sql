-- Create AI conversation memory table
CREATE TABLE public.ai_conversation_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  conversation_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  topic TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_ai_conversation_memory_user_id ON public.ai_conversation_memory(user_id);
CREATE INDEX idx_ai_conversation_memory_conversation_id ON public.ai_conversation_memory(conversation_id);
CREATE UNIQUE INDEX idx_ai_conversation_memory_user_conversation ON public.ai_conversation_memory(user_id, conversation_id);

-- Enable Row Level Security
ALTER TABLE public.ai_conversation_memory ENABLE ROW LEVEL SECURITY;

-- Create policies for memory access
CREATE POLICY "Users can view their own conversation memory" 
ON public.ai_conversation_memory 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversation memory" 
ON public.ai_conversation_memory 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversation memory" 
ON public.ai_conversation_memory 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversation memory" 
ON public.ai_conversation_memory 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE TRIGGER update_ai_conversation_memory_updated_at
BEFORE UPDATE ON public.ai_conversation_memory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add special access for Kent Burchard's account
-- This will be used to identify and provide special memory features
INSERT INTO public.user_features (user_id, feature_name, is_enabled, metadata)
SELECT 
  id, 
  'enhanced_ai_memory', 
  true, 
  jsonb_build_object('max_memory_length', 50, 'memory_retention_days', 90)
FROM 
  auth.users 
WHERE 
  email = 'kentburchard@sacredshifter.com'
ON CONFLICT (user_id, feature_name) 
DO UPDATE SET 
  is_enabled = true, 
  metadata = jsonb_build_object('max_memory_length', 50, 'memory_retention_days', 90);

-- Create a function to check if a user has enhanced memory
CREATE OR REPLACE FUNCTION public.has_enhanced_ai_memory(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  feature_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_features 
    WHERE user_features.user_id = $1 
    AND feature_name = 'enhanced_ai_memory' 
    AND is_enabled = true
  ) INTO feature_exists;
  
  RETURN feature_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;