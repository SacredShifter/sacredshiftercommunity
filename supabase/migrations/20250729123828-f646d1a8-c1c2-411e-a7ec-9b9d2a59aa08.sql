-- Critical Security Fix: Enable Row Level Security on all tables with policies
-- This fixes 295+ security vulnerabilities where policies exist but RLS is disabled

-- Enable RLS on user authentication and profile tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on core application tables
ALTER TABLE public.personal_codex_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_of_resonance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mirror_journal_entries ENABLE ROW LEVEL SECURITY;

-- Enable RLS on circle and community tables
ALTER TABLE public.sacred_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Enable RLS on video and media tables
ALTER TABLE public.user_video_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_reflections ENABLE ROW LEVEL SECURITY;

-- Enable RLS on frequency and meditation tables
ALTER TABLE public.frequency_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frequency_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soundscape_interactions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on quest and gamification tables
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;

-- Enable RLS on all remaining tables with policies
ALTER TABLE public.active_user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistant_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_journey_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auric_resonance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channeled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_moderation_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.esoteric_library_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evolution_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frequency_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guided_meditation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harmonic_convergence_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.harmonic_field_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healing_circle_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holographic_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_meditation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kundalini_awakening_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.light_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lucid_dream_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mystical_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.neural_pathway_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parallel_reality_glimpses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platonic_solid_meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quantum_entanglement_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quantum_healing_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reality_manifestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resonance_field_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sacred_geometry_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shadow_work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soul_retrieval_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synchronicity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformation_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unified_field_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_energy_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_frequencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vibrational_medicine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_quest_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wisdom_circle_insights ENABLE ROW LEVEL SECURITY;

-- Add input validation constraints for security hardening
ALTER TABLE public.circle_posts 
ADD CONSTRAINT content_length_limit CHECK (char_length(content) <= 10000);

ALTER TABLE public.circle_post_comments 
ADD CONSTRAINT comment_length_limit CHECK (char_length(content) <= 2000);

ALTER TABLE public.registry_of_resonance 
ADD CONSTRAINT registry_content_limit CHECK (char_length(content) <= 50000);

ALTER TABLE public.mirror_journal_entries 
ADD CONSTRAINT journal_content_limit CHECK (char_length(content) <= 100000);

-- Prevent self-modification of user roles for additional security
CREATE OR REPLACE FUNCTION prevent_role_self_modification()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent users from modifying their own roles unless they're already admin
  IF NEW.user_id = auth.uid() AND OLD.role != 'admin' THEN
    RAISE EXCEPTION 'Users cannot modify their own roles';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER prevent_role_self_modification_trigger
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_self_modification();