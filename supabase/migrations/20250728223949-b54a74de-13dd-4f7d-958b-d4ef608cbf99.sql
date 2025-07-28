-- CRITICAL SECURITY FIXES - Phase 1
-- Fix infinite recursion in circle_group_members policies and enable missing RLS

-- First, fix the infinite recursion in circle_group_members by dropping problematic policies
DROP POLICY IF EXISTS "Members can view members of their private groups" ON public.circle_group_members;

-- Create security definer function to check group membership without recursion
CREATE OR REPLACE FUNCTION public.is_group_member(group_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.circle_group_members 
    WHERE circle_group_members.group_id = $1 
    AND circle_group_members.user_id = $2
  );
$$;

-- Create security definer function to check if group is private
CREATE OR REPLACE FUNCTION public.is_group_private(group_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(is_private, false) FROM public.circle_groups WHERE id = $1;
$$;

-- Recreate the policy without recursion
CREATE POLICY "Members can view members of their private groups" 
ON public.circle_group_members 
FOR SELECT 
USING (
  CASE 
    WHEN public.is_group_private(group_id) THEN public.is_group_member(group_id, auth.uid())
    ELSE true
  END
);

-- Enable RLS on critical tables that are missing it
ALTER TABLE public.aura_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.celestial_alignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_submissions ENABLE ROW LEVEL SECURITY;

-- Add missing RLS policies for aura_conversations
CREATE POLICY "Anyone can view conversations" 
ON public.aura_conversations 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage conversations" 
ON public.aura_conversations 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing RLS policies for celestial_alignment
CREATE POLICY "Anyone can view celestial alignments" 
ON public.celestial_alignment 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage alignments" 
ON public.celestial_alignment 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing RLS policies for codex_submissions
CREATE POLICY "Anyone can view approved submissions" 
ON public.codex_submissions 
FOR SELECT 
USING (approved = true);

CREATE POLICY "Users can create submissions" 
ON public.codex_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all submissions" 
ON public.codex_submissions 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- Create security definer function for role checking to prevent recursion
CREATE OR REPLACE FUNCTION public.user_has_role(user_id uuid, role_name app_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.role = $2
  );
$$;

-- Update existing policies that might cause recursion
DROP POLICY IF EXISTS "Only admins can modify archetypes" ON public.archetypes;
CREATE POLICY "Only admins can modify archetypes" 
ON public.archetypes 
FOR ALL 
USING (public.user_has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.user_has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can modify akashic vault entries" ON public.akashic_vault_entries;
CREATE POLICY "Only admins can modify akashic vault entries" 
ON public.akashic_vault_entries 
FOR ALL 
USING (public.user_has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.user_has_role(auth.uid(), 'admin'::app_role));