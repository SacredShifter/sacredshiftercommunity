-- Create AI conversation memory table
-- Run this in your Supabase SQL Editor

-- Create the table
CREATE TABLE IF NOT EXISTS public.ai_conversation_memory (
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

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_ai_conversation_memory_user_id ON public.ai_conversation_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversation_memory_conversation_id ON public.ai_conversation_memory(conversation_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_conversation_memory_user_conversation ON public.ai_conversation_memory(user_id, conversation_id);

-- Enable Row Level Security
ALTER TABLE public.ai_conversation_memory ENABLE ROW LEVEL SECURITY;

-- Create policies for memory access
CREATE POLICY IF NOT EXISTS "Users can view their own conversation memory" 
ON public.ai_conversation_memory 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own conversation memory" 
ON public.ai_conversation_memory 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own conversation memory" 
ON public.ai_conversation_memory 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create user_features table if it doesn't exist (for enhanced memory feature)
CREATE TABLE IF NOT EXISTS public.user_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature_name)
);

-- Enable RLS for user_features
ALTER TABLE public.user_features ENABLE ROW LEVEL SECURITY;

-- Create policies for user_features
CREATE POLICY IF NOT EXISTS "Users can view their own features" 
ON public.user_features 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can create their own features" 
ON public.user_features 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own features" 
ON public.user_features 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add enhanced memory feature for the whitelisted user
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Try to find user with kentburchard@sacredshifter.com
    SELECT id, email INTO user_record 
    FROM auth.users 
    WHERE email = 'kentburchard@sacredshifter.com';
    
    IF FOUND THEN
        -- Add enhanced memory feature
        INSERT INTO public.user_features (user_id, feature_name, is_enabled, metadata)
        VALUES (
            user_record.id,
            'enhanced_memory',
            true,
            jsonb_build_object('max_memory_length', 50, 'memory_retention_days', 90)
        )
        ON CONFLICT (user_id, feature_name) 
        DO UPDATE SET 
            is_enabled = true,
            metadata = jsonb_build_object('max_memory_length', 50, 'memory_retention_days', 90);
        
        RAISE NOTICE 'Enhanced memory feature enabled for user: %', user_record.email;
    ELSE
        RAISE NOTICE 'User with email kentburchard@sacredshifter.com not found in auth.users';
    END IF;
END $$;

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER IF NOT EXISTS update_ai_conversation_memory_updated_at
BEFORE UPDATE ON public.ai_conversation_memory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_user_features_updated_at
BEFORE UPDATE ON public.user_features
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();