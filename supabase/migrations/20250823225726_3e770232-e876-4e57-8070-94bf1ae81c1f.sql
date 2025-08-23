-- Phase 1: Critical RLS Security Fixes
-- Fix missing policies for key user tables

-- Create profiles table if it doesn't exist (user profile data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Recreate profiles policies
CREATE POLICY "Public profiles viewable" ON public.profiles 
FOR SELECT USING (true);

CREATE POLICY "Users insert own profile" ON public.profiles 
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.profiles 
FOR UPDATE USING (auth.uid() = id);

-- Ensure critical user tables have basic security
-- Create missing tables if they don't exist

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_data jsonb,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own sessions" ON public.user_sessions 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create activity logs table for user actions
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own activity" ON public.user_activity_logs 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can log activity" ON public.user_activity_logs 
FOR INSERT WITH CHECK (true);

-- Add updated_at function and trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();