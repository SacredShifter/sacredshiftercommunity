-- Add completed_tours column to profiles table for tour tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS completed_tours JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.completed_tours IS 'Array of completed tour IDs for user onboarding and feature tours';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_completed_tours 
ON public.profiles USING GIN (completed_tours);