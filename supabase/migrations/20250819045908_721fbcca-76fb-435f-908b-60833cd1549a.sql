-- Fix the recursive policy on sacred_circle_members that's causing infinite recursion

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Anyone can view circle members" ON sacred_circle_members;

-- Create a security definer function to check circle membership without recursion
CREATE OR REPLACE FUNCTION public.can_view_circle_members(circle_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1 FROM sacred_circles sc
    WHERE sc.id = circle_uuid 
    AND (
      NOT sc.is_private OR 
      sc.created_by = user_uuid OR
      EXISTS(
        SELECT 1 FROM sacred_circle_members scm2 
        WHERE scm2.circle_id = circle_uuid AND scm2.user_id = user_uuid
      )
    )
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Create a non-recursive policy for viewing circle members
CREATE POLICY "Users can view appropriate circle members" ON sacred_circle_members
  FOR SELECT USING (
    can_view_circle_members(circle_id, auth.uid())
  );

-- Also drop the redundant "Users can view all members" policy since it's too permissive
DROP POLICY IF EXISTS "Users can view all members" ON sacred_circle_members;