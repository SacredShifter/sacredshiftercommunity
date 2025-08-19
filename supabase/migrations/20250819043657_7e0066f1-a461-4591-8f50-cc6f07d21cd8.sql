-- Fix infinite recursion in sacred_circle_members policies

-- First, check if the table exists and drop problematic policies
DROP POLICY IF EXISTS "Members can view members of their circles" ON sacred_circle_members;
DROP POLICY IF EXISTS "Users can join circles" ON sacred_circle_members;
DROP POLICY IF EXISTS "Users can leave circles" ON sacred_circle_members;
DROP POLICY IF EXISTS "Circle admins can manage members" ON sacred_circle_members;

-- Create security definer functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.is_circle_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1 FROM circle_group_members 
    WHERE group_id = group_uuid AND user_id = user_uuid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_circle_group_admin(group_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1 FROM circle_group_members 
    WHERE group_id = group_uuid AND user_id = user_uuid AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Create or replace the sacred_circle_members table if it doesn't exist or fix existing one
DO $$
BEGIN
  -- Check if sacred_circle_members table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sacred_circle_members') THEN
    -- If it exists, ensure proper policies without recursion
    DROP POLICY IF EXISTS "Members can view other members" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Users can join as members" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Users can leave" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Admins can manage members" ON sacred_circle_members;
    
    -- Create safe policies using security definer functions
    CREATE POLICY "Users can view members of their circles" ON sacred_circle_members
      FOR SELECT USING (is_circle_group_member(circle_id, auth.uid()));
      
    CREATE POLICY "Users can join circles" ON sacred_circle_members
      FOR INSERT WITH CHECK (user_id = auth.uid());
      
    CREATE POLICY "Users can leave circles" ON sacred_circle_members
      FOR DELETE USING (user_id = auth.uid());
      
    CREATE POLICY "Circle creators can manage members" ON sacred_circle_members
      FOR ALL USING (
        EXISTS(
          SELECT 1 FROM circle_groups 
          WHERE id = sacred_circle_members.circle_id 
          AND created_by = auth.uid()
        )
      );
  END IF;
END $$;