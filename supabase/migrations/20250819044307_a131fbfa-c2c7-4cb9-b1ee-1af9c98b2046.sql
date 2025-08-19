-- Fix recursive policies on sacred_circle_members

-- Drop the problematic recursive policy
DROP POLICY IF EXISTS "Circle admins can add members to private circles" ON sacred_circle_members;
DROP POLICY IF EXISTS "Circle admins can remove members" ON sacred_circle_members;

-- Create a security definer function to check if user is circle admin
CREATE OR REPLACE FUNCTION public.is_sacred_circle_admin(circle_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1 FROM sacred_circle_members 
    WHERE circle_id = circle_uuid AND user_id = user_uuid AND role IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Create a security definer function to check if user is circle creator
CREATE OR REPLACE FUNCTION public.is_sacred_circle_creator(circle_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1 FROM sacred_circles 
    WHERE id = circle_uuid AND created_by = user_uuid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Recreate the policies without recursion
CREATE POLICY "Circle creators can add members" ON sacred_circle_members
  FOR INSERT WITH CHECK (
    (user_id = auth.uid()) OR 
    is_sacred_circle_creator(circle_id, auth.uid())
  );

CREATE POLICY "Circle creators can remove members" ON sacred_circle_members
  FOR DELETE USING (
    (user_id = auth.uid()) OR 
    is_sacred_circle_creator(circle_id, auth.uid())
  );