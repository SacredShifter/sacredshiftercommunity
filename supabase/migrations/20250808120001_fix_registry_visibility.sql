-- Fix registry_of_resonance RLS policies for visibility field

-- Drop existing policies that might be causing conflicts
DROP POLICY IF EXISTS "registry_of_resonance_select_new" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Users can view public entries" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Users can view their own entries" ON public.registry_of_resonance;

-- Create corrected policies
CREATE POLICY "Users can view their own entries" ON public.registry_of_resonance
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public entries" ON public.registry_of_resonance
FOR SELECT
USING (access_level = 'Public' AND is_verified = true);

-- Add a function to check if visibility settings exist and are properly formatted
CREATE OR REPLACE FUNCTION public.check_registry_visibility()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure visibility_settings exists and has the correct structure
  IF NEW.visibility_settings IS NULL THEN
    NEW.visibility_settings := '{"public": false, "circle_shared": false, "featured": false}'::jsonb;
  END IF;
  
  -- Ensure engagement_metrics exists and has the correct structure
  IF NEW.engagement_metrics IS NULL THEN
    NEW.engagement_metrics := '{"views": 0, "shares": 0, "bookmarks": 0}'::jsonb;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to ensure visibility settings are properly set
DROP TRIGGER IF EXISTS ensure_registry_visibility ON public.registry_of_resonance;
CREATE TRIGGER ensure_registry_visibility
BEFORE INSERT OR UPDATE ON public.registry_of_resonance
FOR EACH ROW
EXECUTE FUNCTION public.check_registry_visibility();