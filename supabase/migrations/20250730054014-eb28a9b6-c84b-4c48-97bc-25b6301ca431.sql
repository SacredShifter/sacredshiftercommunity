-- Fix types synchronization by ensuring all required tables exist
DO $$ 
BEGIN
  -- Check if profiles table exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE public.profiles (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
      display_name TEXT,
      full_name TEXT,
      avatar_url TEXT,
      bio TEXT,
      first_visit_shown BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
    
    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
    CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  -- Check if circle_posts_with_profiles view exists, if not create it
  IF NOT EXISTS (SELECT FROM information_schema.views WHERE table_name = 'circle_posts_with_profiles') THEN
    CREATE OR REPLACE VIEW public.circle_posts_with_profiles AS
    SELECT 
      cp.*,
      p.display_name,
      p.avatar_url
    FROM circle_posts cp
    LEFT JOIN profiles p ON cp.user_id = p.user_id;
  END IF;
END $$;