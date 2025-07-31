-- Continue RLS Policy Creation for Existing Tables
-- Phase 2: Additional critical tables that exist

-- Chat rooms (creator-owned)
CREATE POLICY "chat_rooms_select_new" ON public.chat_rooms
FOR SELECT USING (is_active = true);

CREATE POLICY "chat_rooms_insert_new" ON public.chat_rooms
FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "chat_rooms_update_new" ON public.chat_rooms
FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "chat_rooms_delete_new" ON public.chat_rooms
FOR DELETE USING (auth.uid() = created_by);

-- Messages (user communication)
CREATE POLICY "messages_select_new" ON public.messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "messages_insert_new" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  NOT is_user_banned(auth.uid()) AND
  NOT is_user_banned(recipient_id)
);

CREATE POLICY "messages_update_new" ON public.messages
FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "messages_delete_new" ON public.messages
FOR DELETE USING (auth.uid() = sender_id);

-- Video reflections (user-owned)
CREATE POLICY "video_reflections_select_new" ON public.video_reflections
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "video_reflections_insert_new" ON public.video_reflections
FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_user_banned(auth.uid()));

CREATE POLICY "video_reflections_update_new" ON public.video_reflections
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "video_reflections_delete_new" ON public.video_reflections
FOR DELETE USING (auth.uid() = user_id);

-- Reflections (user-owned)
CREATE POLICY "reflections_select_new" ON public.reflections
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reflections_insert_new" ON public.reflections
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reflections_update_new" ON public.reflections
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "reflections_delete_new" ON public.reflections
FOR DELETE USING (auth.uid() = user_id);

-- Modules (public read, creator/admin write)
CREATE POLICY "modules_select_new" ON public.modules
FOR SELECT USING (is_published = true OR auth.uid() = creator_id OR user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "modules_insert_new" ON public.modules
FOR INSERT WITH CHECK (auth.uid() = creator_id AND NOT is_user_banned(auth.uid()));

CREATE POLICY "modules_update_new" ON public.modules
FOR UPDATE USING (auth.uid() = creator_id OR user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "modules_delete_new" ON public.modules
FOR DELETE USING (auth.uid() = creator_id OR user_has_role(auth.uid(), 'admin'::app_role));

-- Personal Codex Entries (user-owned)
CREATE POLICY "personal_codex_entries_select_new" ON public.personal_codex_entries
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "personal_codex_entries_insert_new" ON public.personal_codex_entries
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "personal_codex_entries_update_new" ON public.personal_codex_entries
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "personal_codex_entries_delete_new" ON public.personal_codex_entries
FOR DELETE USING (auth.uid() = user_id);

-- Dream logs (user-owned)
CREATE POLICY "dream_logs_select_new" ON public.dream_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "dream_logs_insert_new" ON public.dream_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "dream_logs_update_new" ON public.dream_logs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "dream_logs_delete_new" ON public.dream_logs
FOR DELETE USING (auth.uid() = user_id);

-- Soul profiles (user-owned)
CREATE POLICY "soul_profiles_select_new" ON public.soul_profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "soul_profiles_insert_new" ON public.soul_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "soul_profiles_update_new" ON public.soul_profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "soul_profiles_delete_new" ON public.soul_profiles
FOR DELETE USING (auth.uid() = user_id);

-- User progress (user-owned)
CREATE POLICY "user_progress_select_new" ON public.user_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_new" ON public.user_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_update_new" ON public.user_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_progress_delete_new" ON public.user_progress
FOR DELETE USING (auth.uid() = user_id);

-- Privacy preferences (user-owned)
CREATE POLICY "privacy_preferences_select_new" ON public.privacy_preferences
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "privacy_preferences_insert_new" ON public.privacy_preferences
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "privacy_preferences_update_new" ON public.privacy_preferences
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "privacy_preferences_delete_new" ON public.privacy_preferences
FOR DELETE USING (auth.uid() = user_id);

-- Data access logs (user can see their own data being accessed, admins see all)
CREATE POLICY "data_access_logs_select_new" ON public.data_access_logs
FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() = accessed_by OR 
  user_has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "data_access_logs_insert_new" ON public.data_access_logs
FOR INSERT WITH CHECK (auth.uid() = accessed_by OR user_has_role(auth.uid(), 'admin'::app_role));

-- Registry of Resonance (user-owned with public visibility option)
CREATE POLICY "registry_of_resonance_select_new" ON public.registry_of_resonance
FOR SELECT USING (
  auth.uid() = user_id OR 
  (visibility = 'public' AND is_verified = true) OR
  user_has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "registry_of_resonance_insert_new" ON public.registry_of_resonance
FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_user_banned(auth.uid()));

CREATE POLICY "registry_of_resonance_update_new" ON public.registry_of_resonance
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "registry_of_resonance_delete_new" ON public.registry_of_resonance
FOR DELETE USING (auth.uid() = user_id OR user_has_role(auth.uid(), 'admin'::app_role));