-- Fix infinite recursion by removing dependent policies first

-- Drop policies that depend on the function
DROP POLICY IF EXISTS "Private groups viewable by members only" ON circle_groups;
DROP POLICY IF EXISTS "Members can view members of their private groups" ON circle_group_members;

-- Now drop the functions
DROP FUNCTION IF EXISTS public.is_circle_group_member(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_circle_group_admin(uuid, uuid) CASCADE;

-- Fix any issues with sacred_circle_members table
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sacred_circle_members') THEN
    -- Drop all policies on sacred_circle_members to stop infinite recursion
    DROP POLICY IF EXISTS "Members can view members of their circles" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Users can join circles" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Users can leave circles" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Circle admins can manage members" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Members can view other members" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Users can join as members" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Users can leave" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Admins can manage members" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Circle creators can manage members" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Users can view members of their circles" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Allow users to view members" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Allow users to join" ON sacred_circle_members;
    DROP POLICY IF EXISTS "Allow users to leave" ON sacred_circle_members;
    
    -- Create simple policies without recursion
    CREATE POLICY "Basic member access" ON sacred_circle_members
      FOR ALL USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Recreate safe helper functions
CREATE OR REPLACE FUNCTION public.is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
  SELECT EXISTS(
    SELECT 1 FROM circle_group_members 
    WHERE group_id = group_uuid AND user_id = user_uuid
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Recreate the circle_groups policies without the problematic function
CREATE POLICY "Public groups are viewable" ON circle_groups
  FOR SELECT USING (is_private = false);

CREATE POLICY "Private groups viewable by members" ON circle_groups
  FOR SELECT USING (
    CASE 
      WHEN is_private = false THEN true
      WHEN is_private = true AND auth.uid() IS NOT NULL THEN 
        is_group_member(id, auth.uid())
      ELSE false
    END
  );

-- Recreate circle_group_members policy
CREATE POLICY "Members can view group membership" ON circle_group_members
  FOR SELECT USING (
    CASE
      WHEN EXISTS(SELECT 1 FROM circle_groups WHERE id = group_id AND is_private = false) THEN true
      ELSE is_group_member(group_id, auth.uid())
    END
  );