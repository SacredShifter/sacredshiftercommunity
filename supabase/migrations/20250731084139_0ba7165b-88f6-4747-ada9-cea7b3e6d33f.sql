-- Create RLS policies for registry_entry_resonance table
CREATE POLICY "Users can view resonance data" 
ON public.registry_entry_resonance 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own resonance" 
ON public.registry_entry_resonance 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);