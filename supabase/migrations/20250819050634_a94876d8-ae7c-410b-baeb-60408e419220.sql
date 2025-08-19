-- Add onboarding_completed flag to profiles table
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;

-- Update existing users to have onboarding completed (since they're already using the app)
UPDATE public.profiles 
SET onboarding_completed = true 
WHERE onboarding_completed = false;