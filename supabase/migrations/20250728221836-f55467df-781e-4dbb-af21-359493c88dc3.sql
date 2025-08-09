-- CRITICAL SECURITY FIX: Enable Row Level Security on tables that have policies but RLS disabled
-- This fixes critical security vulnerabilities where data is exposed without access control

-- Only enable RLS where it's currently disabled (ignore if already enabled)
DO $$ 
DECLARE
    table_record RECORD;
BEGIN
    -- Loop through tables that might need RLS enabled
    FOR table_record IN 
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        AND tablename IN (
            'active_user_metrics', 'agent_registry', 'akashic_records', 'akashic_vault_entries',
            'archetype_activations', 'archetype_journey_logs', 'archetype_paths', 'archetypes',
            'ascension_quests', 'ascension_roles', 'audio_function_mappings', 'auric_resonance',
            'baptism_group_events', 'breath_sessions', 'bridge_events', 'bridgekeeper_wisdom',
            'chakra_mood_snapshots', 'channeled_messages', 'chat_rooms', 'circle_group_members',
            'circle_groups', 'circle_post_comments', 'circle_post_likes', 'circle_posts',
            'codex_entries', 'coherence_beacon_data', 'conscious_cloud_capsules',
            'conscious_cloud_events', 'conscious_cloud_nodes', 'consciousness_bridge_events',
            'consciousness_dignity_pledges', 'consciousness_recognition_sessions', 'consent_records'
        )
    LOOP
        -- Check if RLS is disabled and enable it
        IF NOT (SELECT relrowsecurity FROM pg_class WHERE relname = table_record.tablename AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', table_record.schemaname, table_record.tablename);
            RAISE NOTICE 'Enabled RLS on %.%', table_record.schemaname, table_record.tablename;
        END IF;
    END LOOP;
END $$;

-- Create security definer function for role checking if it doesn't exist
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
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
      AND role::text = _role
  )
$$;

-- Notify completion
SELECT 'Critical RLS security vulnerabilities have been addressed. Database is now significantly more secure.' as status;