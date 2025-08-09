-- Fix AI conversation memory policies
-- Run this in your Supabase SQL Editor

-- First, let's check if the table exists and see its structure
-- (This is just for verification - you can see the output in the Results tab)
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ai_conversation_memory' 
AND table_schema = 'public';

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own conversation memory" ON public.ai_conversation_memory;
DROP POLICY IF EXISTS "Users can create their own conversation memory" ON public.ai_conversation_memory;
DROP POLICY IF EXISTS "Users can update their own conversation memory" ON public.ai_conversation_memory;

-- Recreate the policies with correct syntax
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

-- Also add DELETE policy in case it's needed
CREATE POLICY "Users can delete their own conversation memory" 
ON public.ai_conversation_memory 
FOR DELETE 
USING (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE public.ai_conversation_memory ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversation_memory TO authenticated;

-- Check if user_features table exists and create it if needed
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

-- Drop and recreate user_features policies
DROP POLICY IF EXISTS "Users can view their own features" ON public.user_features;
DROP POLICY IF EXISTS "Users can create their own features" ON public.user_features;
DROP POLICY IF EXISTS "Users can update their own features" ON public.user_features;

CREATE POLICY "Users can view their own features" 
ON public.user_features 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own features" 
ON public.user_features 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own features" 
ON public.user_features 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Grant permissions for user_features
GRANT SELECT, INSERT, UPDATE ON public.user_features TO authenticated;

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