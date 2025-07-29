-- Add missing frequency column to sacred_posts table
ALTER TABLE public.sacred_posts 
ADD COLUMN IF NOT EXISTS frequency numeric;

-- Also add tone column if it's missing (in case it's needed)
ALTER TABLE public.sacred_posts 
ADD COLUMN IF NOT EXISTS tone text;