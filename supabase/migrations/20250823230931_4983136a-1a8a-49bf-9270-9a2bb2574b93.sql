-- Complete RLS policies for production readiness
-- Fix all tables that have RLS enabled but no policies

-- circle_posts table - Users can only see posts from circles they're members of
CREATE POLICY "Users can view posts from their circles" ON public.circle_posts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.circle_members 
    WHERE circle_members.circle_id = circle_posts.circle_id 
    AND circle_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create posts in their circles" ON public.circle_posts
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.circle_members 
    WHERE circle_members.circle_id = circle_posts.circle_id 
    AND circle_members.user_id = auth.uid()
  ) AND auth.uid() = user_id
);

CREATE POLICY "Users can update their own posts" ON public.circle_posts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.circle_posts
FOR DELETE USING (auth.uid() = user_id);

-- direct_messages table - Users can only see their own messages
CREATE POLICY "Users can view their own messages" ON public.direct_messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.direct_messages
FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- journal_entries table - Users can only see their own entries
CREATE POLICY "Users can manage their own journal entries" ON public.journal_entries
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- circle_members table - Users can view circle members, admins can manage
CREATE POLICY "Users can view circle members" ON public.circle_members
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.circle_members cm 
    WHERE cm.circle_id = circle_members.circle_id 
    AND cm.user_id = auth.uid()
  )
);

CREATE POLICY "Circle admins can manage members" ON public.circle_members
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.circle_members cm 
    WHERE cm.circle_id = circle_members.circle_id 
    AND cm.user_id = auth.uid() 
    AND cm.role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.circle_members cm 
    WHERE cm.circle_id = circle_members.circle_id 
    AND cm.user_id = auth.uid() 
    AND cm.role = 'admin'
  )
);

-- sacred_circles table - Public read, members can update
CREATE POLICY "Anyone can view circles" ON public.sacred_circles
FOR SELECT USING (true);

CREATE POLICY "Circle admins can update circles" ON public.sacred_circles
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.circle_members 
    WHERE circle_members.circle_id = sacred_circles.id 
    AND circle_members.user_id = auth.uid() 
    AND circle_members.role = 'admin'
  )
);

CREATE POLICY "Authenticated users can create circles" ON public.sacred_circles
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- video_reflections table - Users manage their own reflections
CREATE POLICY "Users can manage their own video reflections" ON public.video_reflections
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- personal_ai_conversations table - Users see only their conversations
CREATE POLICY "Users can manage their own AI conversations" ON public.personal_ai_conversations
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- shift_progress table - Users manage their own progress
CREATE POLICY "Users can manage their own shift progress" ON public.shift_progress
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_quest_progress table - Users see only their progress
CREATE POLICY "Users can manage their own quest progress" ON public.user_quest_progress
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- wisdom_offerings table - Public read, users manage their own
CREATE POLICY "Anyone can view wisdom offerings" ON public.wisdom_offerings
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own wisdom offerings" ON public.wisdom_offerings
FOR INSERT WITH CHECK (auth.uid() = shared_by);

CREATE POLICY "Users can update their own wisdom offerings" ON public.wisdom_offerings
FOR UPDATE USING (auth.uid() = shared_by);

CREATE POLICY "Users can delete their own wisdom offerings" ON public.wisdom_offerings
FOR DELETE USING (auth.uid() = shared_by);