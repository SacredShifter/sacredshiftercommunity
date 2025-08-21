-- Add RLS policy to allow service role (Aura) to create registry entries on behalf of users
CREATE POLICY "Service role can create registry entries for users" 
ON public.registry_of_resonance 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');