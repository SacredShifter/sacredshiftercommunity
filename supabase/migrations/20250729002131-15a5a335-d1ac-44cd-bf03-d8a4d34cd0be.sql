-- Fix infinite recursion in circle_groups RLS policies
-- The issue is that some policies are referencing the same table they're applied to

-- First, drop all existing problematic policies on circle_groups
DROP POLICY IF EXISTS "Private groups viewable by members" ON public.circle_groups;
DROP POLICY IF EXISTS "Private groups viewable by authenticated users" ON public.circle_groups;

-- Create a security definer function to check if user is a group member
-- This prevents the infinite recursion by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.is_circle_group_member(group_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.circle_group_members 
    WHERE circle_group_members.group_id = is_circle_group_member.group_id 
    AND circle_group_members.user_id = is_circle_group_member.user_id
  );
$$;

-- Create a more efficient policy for private groups
CREATE POLICY "Private groups viewable by members only" 
ON public.circle_groups 
FOR SELECT 
USING (
  CASE 
    WHEN is_private = false THEN true
    WHEN is_private = true AND auth.uid() IS NOT NULL THEN public.is_circle_group_member(id, auth.uid())
    ELSE false
  END
);