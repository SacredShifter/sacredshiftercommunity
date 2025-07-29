-- Critical Security Fix: Enable Row Level Security on existing tables with policies
-- This fixes the critical security vulnerabilities where policies exist but RLS is disabled

-- Enable RLS on core existing tables that have policies but RLS disabled
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

-- Add input validation constraints for security hardening
ALTER TABLE public.circle_posts 
ADD CONSTRAINT content_length_limit CHECK (char_length(content) <= 10000);

ALTER TABLE public.circle_post_comments 
ADD CONSTRAINT comment_length_limit CHECK (char_length(content) <= 2000);