-- Add first_visit_shown column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_visit_shown BOOLEAN DEFAULT FALSE;