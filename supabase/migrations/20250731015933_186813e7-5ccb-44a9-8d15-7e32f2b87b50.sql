-- Continue RLS Policy Creation for Remaining Critical Tables
-- Phase 2: Additional user-owned and public tables

-- Chat rooms and messages
CREATE POLICY "chat_rooms_select_policy" ON public.chat_rooms
FOR SELECT USING (is_active = true);

CREATE POLICY "chat_rooms_insert_policy" ON public.chat_rooms
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "chat_rooms_update_policy" ON public.chat_rooms
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "chat_rooms_delete_policy" ON public.chat_rooms
FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "chat_messages_select_policy" ON public.chat_messages
FOR SELECT USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.chat_rooms 
    WHERE chat_rooms.id = room_id AND is_active = true
  )
);

CREATE POLICY "chat_messages_insert_policy" ON public.chat_messages
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  NOT is_user_banned(auth.uid()) AND
  EXISTS (
    SELECT 1 FROM public.chat_rooms 
    WHERE chat_rooms.id = room_id AND is_active = true
  )
);

CREATE POLICY "chat_messages_update_policy" ON public.chat_messages
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "chat_messages_delete_policy" ON public.chat_messages
FOR DELETE USING (auth.uid() = user_id OR user_has_role(auth.uid(), 'admin'::app_role));

-- Tasks (user-owned)
CREATE POLICY "tasks_select_policy" ON public.tasks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert_policy" ON public.tasks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update_policy" ON public.tasks
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "tasks_delete_policy" ON public.tasks
FOR DELETE USING (auth.uid() = user_id);

-- User roles - restrict admin operations
CREATE POLICY "user_roles_select_policy_new" ON public.user_roles
FOR SELECT USING (
  auth.uid() = user_id OR 
  user_has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "user_roles_insert_policy_new" ON public.user_roles
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "user_roles_update_policy_new" ON public.user_roles
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "user_roles_delete_policy_new" ON public.user_roles
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Video reflections (user-owned)
CREATE POLICY "video_reflections_select_policy" ON public.video_reflections
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "video_reflections_insert_policy" ON public.video_reflections
FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_user_banned(auth.uid()));

CREATE POLICY "video_reflections_update_policy" ON public.video_reflections
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "video_reflections_delete_policy" ON public.video_reflections
FOR DELETE USING (auth.uid() = user_id);

-- Messages (user-owned)
CREATE POLICY "messages_select_policy" ON public.messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "messages_insert_policy" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  NOT is_user_banned(auth.uid()) AND
  NOT is_user_banned(recipient_id)
);

CREATE POLICY "messages_update_policy" ON public.messages
FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "messages_delete_policy" ON public.messages
FOR DELETE USING (auth.uid() = sender_id);

-- Users table (public read, own update)
CREATE POLICY "users_select_policy" ON public.users
FOR SELECT USING (true);

CREATE POLICY "users_insert_policy" ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update_policy" ON public.users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_delete_policy" ON public.users
FOR DELETE USING (auth.uid() = id OR user_has_role(auth.uid(), 'admin'::app_role));

-- Reflections (user-owned)
CREATE POLICY "reflections_select_policy" ON public.reflections
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reflections_insert_policy" ON public.reflections
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reflections_update_policy" ON public.reflections
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reflections_delete_policy" ON public.reflections
FOR DELETE USING (auth.uid() = user_id);

-- Experience progression (user-owned)
CREATE POLICY "experience_progression_select_policy" ON public.experience_progression
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "experience_progression_insert_policy" ON public.experience_progression
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "experience_progression_update_policy" ON public.experience_progression
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "experience_progression_delete_policy" ON public.experience_progression
FOR DELETE USING (auth.uid() = user_id);

-- Quest progress (user-owned)
CREATE POLICY "quest_progress_select_policy" ON public.quest_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "quest_progress_insert_policy" ON public.quest_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quest_progress_update_policy" ON public.quest_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "quest_progress_delete_policy" ON public.quest_progress
FOR DELETE USING (auth.uid() = user_id);

-- Drop duplicate policies first
DROP POLICY IF EXISTS "user_roles_select_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_insert_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_update_policy" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_delete_policy" ON public.user_roles;

-- Rename new policies
ALTER POLICY "user_roles_select_policy_new" ON public.user_roles RENAME TO "user_roles_select_policy";
ALTER POLICY "user_roles_insert_policy_new" ON public.user_roles RENAME TO "user_roles_insert_policy";
ALTER POLICY "user_roles_update_policy_new" ON public.user_roles RENAME TO "user_roles_update_policy";
ALTER POLICY "user_roles_delete_policy_new" ON public.user_roles RENAME TO "user_roles_delete_policy";