-- Critical RLS Policies for User Data Security
-- Phase 1: Core user tables and community features

-- 1. Profiles table policies (if it exists or create it)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Circle posts security (community content)
CREATE POLICY "Circle posts are viewable by circle members" 
ON public.circle_posts FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.circle_members 
    WHERE circle_id = circle_posts.circle_id 
    AND user_id = auth.uid()
  ) OR user_id = auth.uid()
);

CREATE POLICY "Users can create posts in circles they belong to" 
ON public.circle_posts FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.circle_members 
    WHERE circle_id = circle_posts.circle_id 
    AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own posts" 
ON public.circle_posts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.circle_posts FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Direct messages security
CREATE POLICY "Users can view messages they sent or received" 
ON public.direct_messages FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send direct messages" 
ON public.direct_messages FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own sent messages" 
ON public.direct_messages FOR UPDATE 
USING (auth.uid() = sender_id);

-- 4. Journal entries security
CREATE POLICY "Users can view their own journal entries" 
ON public.journal_entries FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" 
ON public.journal_entries FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
ON public.journal_entries FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
ON public.journal_entries FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Circle members security
CREATE POLICY "Circle members can view other members of same circles" 
ON public.circle_members FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.circle_members cm2 
    WHERE cm2.circle_id = circle_members.circle_id 
    AND cm2.user_id = auth.uid()
  )
);

-- 6. Sacred circles security
CREATE POLICY "Users can view public circles" 
ON public.sacred_circles FOR SELECT 
USING (visibility = 'public' OR created_by = auth.uid());

CREATE POLICY "Users can create circles" 
ON public.sacred_circles FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Circle creators can update their circles" 
ON public.sacred_circles FOR UPDATE 
USING (auth.uid() = created_by);

-- 7. User consent and privacy for Aura interactions
CREATE POLICY "Users manage their own Aura consent" 
ON public.aura_user_consent FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. Personal AI data security
CREATE POLICY "Users can manage their own personal AI data" 
ON public.personal_ai_conversations FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();