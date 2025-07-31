-- Fix missing RLS policies for registry tables

-- Additional policies for registry_entry_comments table
CREATE POLICY "Users can view all comments on entries they can access" 
ON public.registry_entry_comments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.registry_of_resonance 
    WHERE id = registry_entry_comments.entry_id 
    AND (
      access_level = 'Public' 
      OR user_id = auth.uid()
      OR (access_level = 'Circle' AND user_id IN (
        SELECT user_id FROM public.circle_group_members 
        WHERE circle_id IN (
          SELECT circle_id FROM public.circle_group_members 
          WHERE user_id = auth.uid()
        )
      ))
    )
  )
);

-- Additional policies for registry_entry_shares table  
CREATE POLICY "Users can view shares of entries they can access"
ON public.registry_entry_shares
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.registry_of_resonance 
    WHERE id = registry_entry_shares.entry_id 
    AND (
      access_level = 'Public' 
      OR user_id = auth.uid()
      OR (access_level = 'Circle' AND user_id IN (
        SELECT user_id FROM public.circle_group_members 
        WHERE circle_id IN (
          SELECT circle_id FROM public.circle_group_members 
          WHERE user_id = auth.uid()
        )
      ))
    )
  )
);

-- Make sure registry_of_resonance policies cover all access patterns
CREATE POLICY "Admins can manage all registry entries" 
ON public.registry_of_resonance 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Add policy for registry_entry_resonance to allow users to view resonance counts
CREATE POLICY "Users can view resonance counts for accessible entries"
ON public.registry_entry_resonance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.registry_of_resonance 
    WHERE id = registry_entry_resonance.entry_id 
    AND (
      access_level = 'Public' 
      OR user_id = auth.uid()
      OR (access_level = 'Circle' AND user_id IN (
        SELECT user_id FROM public.circle_group_members 
        WHERE circle_id IN (
          SELECT circle_id FROM public.circle_group_members 
          WHERE user_id = auth.uid()
        )
      ))
    )
  )
);