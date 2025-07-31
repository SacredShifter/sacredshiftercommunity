-- Fix critical RLS issues blocking app loading
-- Enable RLS on core tables that need it

-- Key authentication-related tables  
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channeled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_journey_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_assistant_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.codex_submissions ENABLE ROW LEVEL SECURITY;

-- Create basic policies for profiles table if they don't exist
DO $$
BEGIN
  -- Check if policies exist before creating
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;