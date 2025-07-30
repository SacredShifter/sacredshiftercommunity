-- Update RLS policy to allow users to see all their own entries regardless of verification
DROP POLICY IF EXISTS "Users can view their own registry entries" ON registry_of_resonance;

CREATE POLICY "Users can view all their own registry entries" 
ON registry_of_resonance 
FOR SELECT 
USING (auth.uid() = user_id);

-- Also ensure users can see public verified entries from others
-- (This policy already exists, but let's make sure it's clear)
DROP POLICY IF EXISTS "Users can view public verified entries" ON registry_of_resonance;

CREATE POLICY "Users can view public verified entries" 
ON registry_of_resonance 
FOR SELECT 
USING (access_level = 'Public' AND is_verified = true);