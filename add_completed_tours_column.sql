-- SQL script to add completed_tours column to profiles table
-- Run this in your Supabase SQL Editor

-- Add completed_tours column to profiles table for tour tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS completed_tours JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.completed_tours IS 'Array of completed tour IDs for user onboarding and feature tours';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_completed_tours 
ON public.profiles USING GIN (completed_tours);

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'completed_tours';