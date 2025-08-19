-- Add completed_tours field to profiles table for tour tracking
ALTER TABLE public.profiles 
ADD COLUMN completed_tours jsonb DEFAULT '[]'::jsonb;