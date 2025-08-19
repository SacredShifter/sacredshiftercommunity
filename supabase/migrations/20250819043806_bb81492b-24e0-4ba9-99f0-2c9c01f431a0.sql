-- Drop existing functions and fix infinite recursion

DROP FUNCTION IF EXISTS public.is_circle_group_member(uuid, uuid);
DROP FUNCTION IF EXISTS public.is_circle_group_admin(uuid, uuid);

-- Recreate the functions with correct signatures
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

-- Check and fix sacred_circle_members table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sacred_circle_members') THEN
    -- Drop all existing policies to prevent recursion
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
    
    -- Create simple, non-recursive policies
    CREATE POLICY "Allow users to view members" ON sacred_circle_members
      FOR SELECT USING (true);
      
    CREATE POLICY "Allow users to join" ON sacred_circle_members
      FOR INSERT WITH CHECK (user_id = auth.uid());
      
    CREATE POLICY "Allow users to leave" ON sacred_circle_members
      FOR DELETE USING (user_id = auth.uid());
  END IF;
END $$;