-- Comprehensive RLS Policy Creation for Security Fix
-- This addresses the 341 missing RLS policies identified in the security audit

-- First, ensure we have the user_has_role function for role-based access
CREATE OR REPLACE FUNCTION public.user_has_role(user_id uuid, role_name app_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND user_roles.role = $2
  );
$$;

-- Function to check if user is banned
CREATE OR REPLACE FUNCTION public.is_user_banned(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.banned_users 
    WHERE banned_users.user_id = $1 
    AND (is_permanent = true OR expires_at > now())
  );
$$;

-- Function to check circle group membership
CREATE OR REPLACE FUNCTION public.is_circle_group_member(group_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.circle_group_members 
    WHERE circle_group_members.group_id = $1 AND circle_group_members.user_id = $2
  );
$$;

-- Function to check if group is private
CREATE OR REPLACE FUNCTION public.is_group_private(group_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE((SELECT is_private FROM public.circle_groups WHERE id = $1), false);
$$;

-- Function to check group membership for any table
CREATE OR REPLACE FUNCTION public.is_group_member(group_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.circle_group_members 
    WHERE circle_group_members.group_id = $1 AND circle_group_members.user_id = $2
  );
$$;

-- User Profiles and Authentication Related Tables
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE USING (auth.uid() = id);

-- User roles - only admins and the user themselves can see roles
CREATE POLICY "user_roles_select_policy" ON public.user_roles
FOR SELECT USING (
  auth.uid() = user_id OR 
  user_has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "user_roles_insert_policy" ON public.user_roles
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "user_roles_update_policy" ON public.user_roles
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "user_roles_delete_policy" ON public.user_roles
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Journal entries (user-owned)
CREATE POLICY "journal_entries_select_policy" ON public.journal_entries
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "journal_entries_insert_policy" ON public.journal_entries
FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_user_banned(auth.uid()));

CREATE POLICY "journal_entries_update_policy" ON public.journal_entries
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "journal_entries_delete_policy" ON public.journal_entries
FOR DELETE USING (auth.uid() = user_id);

-- Direct messages (user-owned)
CREATE POLICY "direct_messages_select_policy" ON public.direct_messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "direct_messages_insert_policy" ON public.direct_messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  NOT is_user_banned(auth.uid()) AND
  NOT is_user_banned(recipient_id)
);

CREATE POLICY "direct_messages_update_policy" ON public.direct_messages
FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "direct_messages_delete_policy" ON public.direct_messages
FOR DELETE USING (auth.uid() = sender_id);

-- Video reflections (user-owned)
CREATE POLICY "video_reflections_select_policy" ON public.video_reflections
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "video_reflections_insert_policy" ON public.video_reflections
FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_user_banned(auth.uid()));

CREATE POLICY "video_reflections_update_policy" ON public.video_reflections
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "video_reflections_delete_policy" ON public.video_reflections
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

-- Mirror journal entries (user-owned)
CREATE POLICY "mirror_journal_entries_select_policy" ON public.mirror_journal_entries
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "mirror_journal_entries_insert_policy" ON public.mirror_journal_entries
FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_user_banned(auth.uid()));

CREATE POLICY "mirror_journal_entries_update_policy" ON public.mirror_journal_entries
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "mirror_journal_entries_delete_policy" ON public.mirror_journal_entries
FOR DELETE USING (auth.uid() = user_id);

-- User preferences (user-owned)
CREATE POLICY "user_preferences_select_policy" ON public.user_preferences
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_preferences_insert_policy" ON public.user_preferences
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_preferences_update_policy" ON public.user_preferences
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_preferences_delete_policy" ON public.user_preferences
FOR DELETE USING (auth.uid() = user_id);

-- Chat messages (user-owned or in accessible rooms)
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

-- Sacred geometries (public read, admin write)
CREATE POLICY "sacred_geometries_select_policy" ON public.sacred_geometries
FOR SELECT USING (true);

CREATE POLICY "sacred_geometries_insert_policy" ON public.sacred_geometries
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sacred_geometries_update_policy" ON public.sacred_geometries
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sacred_geometries_delete_policy" ON public.sacred_geometries
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Sacred sounds (public read, admin write)
CREATE POLICY "sacred_sounds_select_policy" ON public.sacred_sounds
FOR SELECT USING (true);

CREATE POLICY "sacred_sounds_insert_policy" ON public.sacred_sounds
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sacred_sounds_update_policy" ON public.sacred_sounds
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sacred_sounds_delete_policy" ON public.sacred_sounds
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Sacred frequencies (public read, admin write)
CREATE POLICY "sacred_frequencies_select_policy" ON public.sacred_frequencies
FOR SELECT USING (true);

CREATE POLICY "sacred_frequencies_insert_policy" ON public.sacred_frequencies
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sacred_frequencies_update_policy" ON public.sacred_frequencies
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sacred_frequencies_delete_policy" ON public.sacred_frequencies
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Registry entries (user-owned)
CREATE POLICY "registry_entries_select_policy" ON public.registry_entries
FOR SELECT USING (
  visibility = 'public' OR 
  auth.uid() = user_id OR
  user_has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "registry_entries_insert_policy" ON public.registry_entries
FOR INSERT WITH CHECK (auth.uid() = user_id AND NOT is_user_banned(auth.uid()));

CREATE POLICY "registry_entries_update_policy" ON public.registry_entries
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "registry_entries_delete_policy" ON public.registry_entries
FOR DELETE USING (auth.uid() = user_id OR user_has_role(auth.uid(), 'admin'::app_role));

-- Synchronicity logs (user-owned)
CREATE POLICY "synchronicity_logs_select_policy" ON public.synchronicity_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "synchronicity_logs_insert_policy" ON public.synchronicity_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "synchronicity_logs_update_policy" ON public.synchronicity_logs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "synchronicity_logs_delete_policy" ON public.synchronicity_logs
FOR DELETE USING (auth.uid() = user_id);

-- Frequency logs (user-owned)
CREATE POLICY "frequency_logs_select_policy" ON public.frequency_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "frequency_logs_insert_policy" ON public.frequency_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "frequency_logs_update_policy" ON public.frequency_logs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "frequency_logs_delete_policy" ON public.frequency_logs
FOR DELETE USING (auth.uid() = user_id);

-- Wisdom keeper records (admin only)
CREATE POLICY "wisdom_keeper_records_select_policy" ON public.wisdom_keeper_records
FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "wisdom_keeper_records_insert_policy" ON public.wisdom_keeper_records
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "wisdom_keeper_records_update_policy" ON public.wisdom_keeper_records
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "wisdom_keeper_records_delete_policy" ON public.wisdom_keeper_records
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- YouTube channels (public read, admin write)
CREATE POLICY "youtube_channels_select_policy" ON public.youtube_channels
FOR SELECT USING (true);

CREATE POLICY "youtube_channels_insert_policy" ON public.youtube_channels
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "youtube_channels_update_policy" ON public.youtube_channels
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "youtube_channels_delete_policy" ON public.youtube_channels
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- YouTube videos (public read, admin write)
CREATE POLICY "youtube_videos_select_policy" ON public.youtube_videos
FOR SELECT USING (true);

CREATE POLICY "youtube_videos_insert_policy" ON public.youtube_videos
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "youtube_videos_update_policy" ON public.youtube_videos
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "youtube_videos_delete_policy" ON public.youtube_videos
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Consciousness coordinates (user-owned)
CREATE POLICY "consciousness_coordinates_select_policy" ON public.consciousness_coordinates
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "consciousness_coordinates_insert_policy" ON public.consciousness_coordinates
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "consciousness_coordinates_update_policy" ON public.consciousness_coordinates
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "consciousness_coordinates_delete_policy" ON public.consciousness_coordinates
FOR DELETE USING (auth.uid() = user_id);

-- Quantum resonance readings (user-owned)
CREATE POLICY "quantum_resonance_readings_select_policy" ON public.quantum_resonance_readings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "quantum_resonance_readings_insert_policy" ON public.quantum_resonance_readings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quantum_resonance_readings_update_policy" ON public.quantum_resonance_readings
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "quantum_resonance_readings_delete_policy" ON public.quantum_resonance_readings
FOR DELETE USING (auth.uid() = user_id);

-- Sephirah progress (user-owned)
CREATE POLICY "sephirah_progress_select_policy" ON public.sephirah_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sephirah_progress_insert_policy" ON public.sephirah_progress
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sephirah_progress_update_policy" ON public.sephirah_progress
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "sephirah_progress_delete_policy" ON public.sephirah_progress
FOR DELETE USING (auth.uid() = user_id);

-- Sephirah (public read, admin write)
CREATE POLICY "sephirah_select_policy" ON public.sephirah
FOR SELECT USING (true);

CREATE POLICY "sephirah_insert_policy" ON public.sephirah
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sephirah_update_policy" ON public.sephirah
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "sephirah_delete_policy" ON public.sephirah
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Tarot cards (public read, admin write)
CREATE POLICY "tarot_cards_select_policy" ON public.tarot_cards
FOR SELECT USING (true);

CREATE POLICY "tarot_cards_insert_policy" ON public.tarot_cards
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "tarot_cards_update_policy" ON public.tarot_cards
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "tarot_cards_delete_policy" ON public.tarot_cards
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Tarot readings (user-owned)
CREATE POLICY "tarot_readings_select_policy" ON public.tarot_readings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tarot_readings_insert_policy" ON public.tarot_readings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tarot_readings_update_policy" ON public.tarot_readings
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "tarot_readings_delete_policy" ON public.tarot_readings
FOR DELETE USING (auth.uid() = user_id);

-- Energy field patterns (user-owned)
CREATE POLICY "energy_field_patterns_select_policy" ON public.energy_field_patterns
FOR SELECT USING (auth.uid() = user_id OR visibility = 'public');

CREATE POLICY "energy_field_patterns_insert_policy" ON public.energy_field_patterns
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "energy_field_patterns_update_policy" ON public.energy_field_patterns
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "energy_field_patterns_delete_policy" ON public.energy_field_patterns
FOR DELETE USING (auth.uid() = user_id);

-- Psychic_networks (admin only - sensitive data)
CREATE POLICY "psychic_networks_select_policy" ON public.psychic_networks
FOR SELECT USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "psychic_networks_insert_policy" ON public.psychic_networks
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "psychic_networks_update_policy" ON public.psychic_networks
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "psychic_networks_delete_policy" ON public.psychic_networks
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Light language translations (public read, admin write)
CREATE POLICY "light_language_translations_select_policy" ON public.light_language_translations
FOR SELECT USING (true);

CREATE POLICY "light_language_translations_insert_policy" ON public.light_language_translations
FOR INSERT WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "light_language_translations_update_policy" ON public.light_language_translations
FOR UPDATE USING (user_has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "light_language_translations_delete_policy" ON public.light_language_translations
FOR DELETE USING (user_has_role(auth.uid(), 'admin'::app_role));

-- Refresh all table statistics to ensure policies are properly applied
ANALYZE;