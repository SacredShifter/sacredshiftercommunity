-- Corrected RLS Policy Creation for Existing Tables
-- This addresses the security issues for tables that actually exist

-- Ensure helper functions exist
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

-- Profiles table policies (uses user_id as primary key)
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "profiles_delete_policy" ON public.profiles
FOR DELETE USING (auth.uid() = user_id);

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

-- Synchronicity logs (user-owned)
CREATE POLICY "synchronicity_logs_select_policy" ON public.synchronicity_logs
FOR SELECT USING (auth.uid() = user_id OR shared_publicly = true);

CREATE POLICY "synchronicity_logs_insert_policy" ON public.synchronicity_logs
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "synchronicity_logs_update_policy" ON public.synchronicity_logs
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "synchronicity_logs_delete_policy" ON public.synchronicity_logs
FOR DELETE USING (auth.uid() = user_id);