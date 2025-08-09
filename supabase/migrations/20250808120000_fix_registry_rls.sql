-- Fix registry_of_resonance RLS policies

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own registry entries" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Users can view public verified entries" ON public.registry_of_resonance;

-- Create new policies
CREATE POLICY "Users can view their own entries" ON public.registry_of_resonance
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public entries" ON public.registry_of_resonance
FOR SELECT
USING (access_level = 'Public' AND is_verified = true);
