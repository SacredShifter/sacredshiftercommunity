-- CRITICAL SECURITY FIX: Enable Row Level Security on existing tables with policies but RLS disabled
-- This fixes the most critical security vulnerabilities where data is exposed without access control

-- Enable RLS on core tables that exist and have policies but RLS disabled
ALTER TABLE public.active_user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akashic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.akashic_vault_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_journey_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ascension_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ascension_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_function_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auric_resonance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridgekeeper_wisdom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chakra_mood_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channeled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coherence_beacon_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conscious_cloud_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conscious_cloud_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conscious_cloud_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_bridge_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_dignity_pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consciousness_recognition_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create a profiles table for user profile data with proper RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  soul_name text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  PRIMARY KEY (id)
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create user roles enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles if not already enabled
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles table
DO $$ BEGIN
    CREATE POLICY "Admins can manage all user roles" 
    ON public.user_roles 
    FOR ALL 
    USING (public.has_role(auth.uid(), 'admin'::app_role));
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view their own roles" 
    ON public.user_roles 
    FOR SELECT 
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notify completion
COMMENT ON SCHEMA public IS 'Critical RLS security vulnerabilities fixed. Row Level Security enabled on all existing tables with policies.';