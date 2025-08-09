-- Add tour_progress column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN tour_progress TEXT[] DEFAULT '{}';

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.tour_progress IS 'Array of completed tour IDs for tracking user onboarding progress';