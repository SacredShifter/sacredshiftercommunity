-- CRITICAL SECURITY FIXES - Phase 1C
-- Enable RLS only on actual tables (not views) and fix function security

-- Enable RLS on actual tables that don't have it (skipping views)
ALTER TABLE public.archetype_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ascension_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ascension_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_function_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridgekeeper_wisdom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chakra_mood_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coherence_beacon_data ENABLE ROW LEVEL SECURITY;

-- Add missing critical policies for archetype_paths
CREATE POLICY "Anyone can view archetype paths" 
ON public.archetype_paths 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage archetype paths" 
ON public.archetype_paths 
FOR ALL 
USING (public.user_has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.user_has_role(auth.uid(), 'admin'::app_role));

-- Add missing critical policies for ascension_quests
CREATE POLICY "Service role can manage ascension quests" 
ON public.ascension_quests 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing critical policies for ascension_roles
CREATE POLICY "Service role can manage ascension roles" 
ON public.ascension_roles 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing critical policies for audio_function_mappings
CREATE POLICY "Service role can manage audio mappings" 
ON public.audio_function_mappings 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing critical policies for baptism_group_events
CREATE POLICY "Service role can manage baptism events" 
ON public.baptism_group_events 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing critical policies for bridge_events
CREATE POLICY "Service role can manage bridge events" 
ON public.bridge_events 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing critical policies for bridgekeeper_wisdom
CREATE POLICY "Service role can manage bridgekeeper wisdom" 
ON public.bridgekeeper_wisdom 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing critical policies for chakra_mood_snapshots
CREATE POLICY "Service role can manage chakra snapshots" 
ON public.chakra_mood_snapshots 
FOR ALL 
USING (auth.role() = 'service_role');

-- Add missing critical policies for coherence_beacon_data
CREATE POLICY "Service role can manage coherence data" 
ON public.coherence_beacon_data 
FOR ALL 
USING (auth.role() = 'service_role');

-- Fix search path for security definer functions to prevent vulnerabilities
ALTER FUNCTION public.is_group_member SET search_path = '';
ALTER FUNCTION public.is_group_private SET search_path = '';
ALTER FUNCTION public.user_has_role SET search_path = '';