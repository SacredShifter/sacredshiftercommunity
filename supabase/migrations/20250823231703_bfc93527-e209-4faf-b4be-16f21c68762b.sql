-- Complete RLS policies for production readiness (corrected)
-- Fix all tables that have RLS enabled but no policies

-- circle_posts table - Users can only see posts from circles they're members of (uses group_id)
CREATE POLICY "Users can view posts from their circles" ON public.circle_posts
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.circle_members 
    WHERE circle_members.circle_id = circle_posts.group_id 
    AND circle_members.user_id = auth.uid()
  ) OR group_id IS NULL
);

CREATE POLICY "Users can create posts in their circles" ON public.circle_posts
FOR INSERT WITH CHECK (
  (group_id IS NULL AND auth.uid() = user_id) OR 
  (EXISTS (
    SELECT 1 FROM public.circle_members 
    WHERE circle_members.circle_id = circle_posts.group_id 
    AND circle_members.user_id = auth.uid()
  ) AND auth.uid() = user_id)
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

CREATE POLICY "Users can update their own messages" ON public.direct_messages
FOR UPDATE USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages" ON public.direct_messages
FOR DELETE USING (auth.uid() = sender_id);

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
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.circle_members cm 
    WHERE cm.circle_id = circle_members.circle_id 
    AND cm.user_id = auth.uid() 
    AND cm.role = 'admin'
  ) OR NOT EXISTS (
    SELECT 1 FROM public.circle_members cm 
    WHERE cm.circle_id = circle_members.circle_id
  )
);

CREATE POLICY "Circle admins can update members" ON public.circle_members
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.circle_members cm 
    WHERE cm.circle_id = circle_members.circle_id 
    AND cm.user_id = auth.uid() 
    AND cm.role = 'admin'
  )
);

CREATE POLICY "Circle admins can delete members" ON public.circle_members
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.circle_members cm 
    WHERE cm.circle_id = circle_members.circle_id 
    AND cm.user_id = auth.uid() 
    AND cm.role = 'admin'
  ) OR auth.uid() = user_id
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