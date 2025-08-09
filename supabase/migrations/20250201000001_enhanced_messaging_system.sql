-- Enhanced Messaging System Migration
-- This migration adds comprehensive messaging features while preserving existing functionality

-- 1. Enhance existing direct_messages table with additional columns
ALTER TABLE public.direct_messages 
ADD COLUMN IF NOT EXISTS message_status TEXT DEFAULT 'sent' CHECK (message_status IN ('sent', 'delivered', 'read', 'failed')),
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS forwarded_from_id UUID REFERENCES public.direct_messages(id),
ADD COLUMN IF NOT EXISTS thread_id UUID,
ADD COLUMN IF NOT EXISTS encryption_key_id TEXT,
ADD COLUMN IF NOT EXISTS is_encrypted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS delivery_receipt_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS read_receipt_requested BOOLEAN DEFAULT true;

-- 2. Create message threads table for threaded conversations
CREATE TABLE IF NOT EXISTS public.message_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  root_message_id UUID NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  title TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_archived BOOLEAN DEFAULT false,
  participant_count INTEGER DEFAULT 0
);

-- 3. Create message attachments table for file handling
CREATE TABLE IF NOT EXISTS public.message_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for audio/video files
  upload_status TEXT DEFAULT 'uploading' CHECK (upload_status IN ('uploading', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create conversation settings table
CREATE TABLE IF NOT EXISTS public.conversation_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  is_muted BOOLEAN DEFAULT false,
  muted_until TIMESTAMP WITH TIME ZONE,
  is_archived BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  custom_name TEXT,
  background_theme TEXT DEFAULT 'default',
  auto_delete_after_days INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- 5. Create message delivery status table
CREATE TABLE IF NOT EXISTS public.message_delivery_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  device_info JSONB DEFAULT '{}',
  UNIQUE(message_id, user_id, status)
);

-- 6. Create message templates table
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_shared BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Create blocked users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- 8. Create message reports table
CREATE TABLE IF NOT EXISTS public.message_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'harassment', 'inappropriate', 'violence', 'other')),
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 9. Create conversation participants table for group messaging
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  added_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(conversation_id, user_id)
);

-- 10. Create message search index table
CREATE TABLE IF NOT EXISTS public.message_search_index (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  content_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Create scheduled messages table
CREATE TABLE IF NOT EXISTS public.scheduled_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  metadata JSONB DEFAULT '{}',
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- 12. Enable RLS on all new tables
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_delivery_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_search_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_messages ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS policies for message_threads
CREATE POLICY "Users can view threads in their conversations" ON public.message_threads
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = message_threads.conversation_id 
    AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
  )
);

CREATE POLICY "Users can create threads in their conversations" ON public.message_threads
FOR INSERT WITH CHECK (
  auth.uid() = created_by AND
  EXISTS (
    SELECT 1 FROM public.conversations c 
    WHERE c.id = conversation_id 
    AND (c.participant_1_id = auth.uid() OR c.participant_2_id = auth.uid())
  )
);

-- 14. Create RLS policies for message_attachments
CREATE POLICY "Users can view attachments in their messages" ON public.message_attachments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.direct_messages dm 
    WHERE dm.id = message_attachments.message_id 
    AND (dm.sender_id = auth.uid() OR dm.recipient_id = auth.uid())
  )
);

CREATE POLICY "Users can add attachments to their messages" ON public.message_attachments
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.direct_messages dm 
    WHERE dm.id = message_id 
    AND dm.sender_id = auth.uid()
  )
);

-- 15. Create RLS policies for conversation_settings
CREATE POLICY "Users can manage their own conversation settings" ON public.conversation_settings
FOR ALL USING (auth.uid() = user_id);

-- 16. Create RLS policies for message_delivery_status
CREATE POLICY "Users can view delivery status for their messages" ON public.message_delivery_status
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.direct_messages dm 
    WHERE dm.id = message_delivery_status.message_id 
    AND (dm.sender_id = auth.uid() OR dm.recipient_id = auth.uid())
  )
);

-- 17. Create RLS policies for message_templates
CREATE POLICY "Users can manage their own templates" ON public.message_templates
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view shared templates" ON public.message_templates
FOR SELECT USING (is_shared = true OR auth.uid() = user_id);

-- 18. Create RLS policies for blocked_users
CREATE POLICY "Users can manage their own blocked list" ON public.blocked_users
FOR ALL USING (auth.uid() = blocker_id);

-- 19. Create RLS policies for message_reports
CREATE POLICY "Users can create reports" ON public.message_reports
FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports" ON public.message_reports
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- 20. Create RLS policies for conversation_participants
CREATE POLICY "Users can view participants in their conversations" ON public.conversation_participants
FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.conversation_participants cp 
    WHERE cp.conversation_id = conversation_participants.conversation_id 
    AND cp.user_id = auth.uid() 
    AND cp.is_active = true
  )
);

-- 21. Create RLS policies for scheduled_messages
CREATE POLICY "Users can manage their own scheduled messages" ON public.scheduled_messages
FOR ALL USING (auth.uid() = sender_id);

-- 22. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_direct_messages_thread_id ON public.direct_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_scheduled_at ON public.direct_messages(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_status ON public.direct_messages(message_status);
CREATE INDEX IF NOT EXISTS idx_message_threads_conversation ON public.message_threads(conversation_id);
CREATE INDEX IF NOT EXISTS idx_message_attachments_message ON public.message_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_conversation_settings_user ON public.conversation_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_message_delivery_status_message ON public.message_delivery_status(message_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON public.blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON public.blocked_users(blocked_id);
CREATE INDEX IF NOT EXISTS idx_message_reports_status ON public.message_reports(status);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON public.conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_scheduled_for ON public.scheduled_messages(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_message_search_content ON public.message_search_index USING gin(content_vector);

-- 23. Create full-text search index
CREATE INDEX IF NOT EXISTS idx_direct_messages_content_search ON public.direct_messages USING gin(to_tsvector('english', content));

-- 24. Create functions for enhanced messaging

-- Function to check if user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(sender_id UUID, recipient_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.blocked_users 
    WHERE blocker_id = recipient_id AND blocked_id = sender_id
  );
END;
$$;

-- Function to get conversation with settings
CREATE OR REPLACE FUNCTION public.get_conversation_with_settings(user_id UUID, other_user_id UUID)
RETURNS TABLE (
  conversation_id UUID,
  participant_1_id UUID,
  participant_2_id UUID,
  last_message_at TIMESTAMP WITH TIME ZONE,
  notifications_enabled BOOLEAN,
  is_muted BOOLEAN,
  is_archived BOOLEAN,
  is_pinned BOOLEAN,
  custom_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.participant_1_id,
    c.participant_2_id,
    c.last_message_at,
    COALESCE(cs.notifications_enabled, true),
    COALESCE(cs.is_muted, false),
    COALESCE(cs.is_archived, false),
    COALESCE(cs.is_pinned, false),
    cs.custom_name
  FROM public.conversations c
  LEFT JOIN public.conversation_settings cs ON c.id = cs.conversation_id AND cs.user_id = user_id
  WHERE (c.participant_1_id = user_id AND c.participant_2_id = other_user_id)
     OR (c.participant_1_id = other_user_id AND c.participant_2_id = user_id);
END;
$$;

-- Function to search messages
CREATE OR REPLACE FUNCTION public.search_messages(
  user_id UUID,
  search_query TEXT,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  message_id UUID,
  content TEXT,
  sender_id UUID,
  recipient_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  conversation_id UUID,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.id,
    dm.content,
    dm.sender_id,
    dm.recipient_id,
    dm.created_at,
    c.id as conversation_id,
    ts_rank(to_tsvector('english', dm.content), plainto_tsquery('english', search_query)) as rank
  FROM public.direct_messages dm
  JOIN public.conversations c ON (
    (c.participant_1_id = dm.sender_id AND c.participant_2_id = dm.recipient_id) OR
    (c.participant_1_id = dm.recipient_id AND c.participant_2_id = dm.sender_id)
  )
  WHERE (dm.sender_id = user_id OR dm.recipient_id = user_id)
    AND dm.deleted_at IS NULL
    AND to_tsvector('english', dm.content) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, dm.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Function to update message search index
CREATE OR REPLACE FUNCTION public.update_message_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    INSERT INTO public.message_search_index (message_id, conversation_id, content_vector)
    VALUES (
      NEW.id,
      (SELECT id FROM public.conversations c 
       WHERE (c.participant_1_id = NEW.sender_id AND c.participant_2_id = NEW.recipient_id)
          OR (c.participant_1_id = NEW.recipient_id AND c.participant_2_id = NEW.sender_id)
       LIMIT 1),
      to_tsvector('english', NEW.content)
    )
    ON CONFLICT (message_id) DO UPDATE SET
      content_vector = to_tsvector('english', NEW.content);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM public.message_search_index WHERE message_id = OLD.id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 25. Create triggers
CREATE TRIGGER update_message_search_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.direct_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_message_search_index();

-- Function to process scheduled messages
CREATE OR REPLACE FUNCTION public.process_scheduled_messages()
RETURNS void AS $$
DECLARE
  scheduled_msg RECORD;
BEGIN
  FOR scheduled_msg IN 
    SELECT * FROM public.scheduled_messages 
    WHERE status = 'pending' 
    AND scheduled_for <= NOW()
  LOOP
    -- Insert the message
    INSERT INTO public.direct_messages (
      sender_id, recipient_id, content, message_type, metadata, created_at
    ) VALUES (
      scheduled_msg.sender_id,
      scheduled_msg.recipient_id,
      scheduled_msg.content,
      scheduled_msg.message_type,
      scheduled_msg.metadata,
      NOW()
    );
    
    -- Update scheduled message status
    UPDATE public.scheduled_messages 
    SET status = 'sent', sent_at = NOW()
    WHERE id = scheduled_msg.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 26. Enable realtime for new tables
ALTER TABLE public.message_threads REPLICA IDENTITY FULL;
ALTER TABLE public.message_attachments REPLICA IDENTITY FULL;
ALTER TABLE public.conversation_settings REPLICA IDENTITY FULL;
ALTER TABLE public.message_delivery_status REPLICA IDENTITY FULL;
ALTER TABLE public.blocked_users REPLICA IDENTITY FULL;
ALTER TABLE public.conversation_participants REPLICA IDENTITY FULL;
ALTER TABLE public.scheduled_messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_attachments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_delivery_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blocked_users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scheduled_messages;

-- 27. Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.message_threads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.message_attachments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_settings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.message_delivery_status TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.message_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_users TO authenticated;
GRANT SELECT, INSERT ON public.message_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversation_participants TO authenticated;
GRANT SELECT ON public.message_search_index TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_messages TO authenticated;

GRANT EXECUTE ON FUNCTION public.is_user_blocked TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_conversation_with_settings TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_messages TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_scheduled_messages TO service_role;

-- 28. Create updated views with enhanced data
CREATE OR REPLACE VIEW public.enhanced_direct_messages_with_profiles AS
SELECT 
  dm.*,
  sender_profile.display_name as sender_display_name,
  sender_profile.avatar_url as sender_avatar_url,
  recipient_profile.display_name as recipient_display_name,
  recipient_profile.avatar_url as recipient_avatar_url,
  mt.title as thread_title,
  CASE WHEN dm.deleted_at IS NOT NULL THEN true ELSE false END as is_deleted,
  CASE WHEN dm.edited_at IS NOT NULL THEN true ELSE false END as is_edited,
  (SELECT COUNT(*) FROM public.message_reactions mr WHERE mr.message_id = dm.id) as reaction_count,
  (SELECT COUNT(*) FROM public.message_attachments ma WHERE ma.message_id = dm.id) as attachment_count
FROM public.direct_messages dm
LEFT JOIN public.profiles sender_profile ON dm.sender_id = sender_profile.user_id
LEFT JOIN public.profiles recipient_profile ON dm.recipient_id = recipient_profile.user_id
LEFT JOIN public.message_threads mt ON dm.thread_id = mt.id
WHERE dm.deleted_at IS NULL;

CREATE OR REPLACE VIEW public.enhanced_conversations_with_profiles AS
SELECT 
  c.*,
  p1.display_name as participant_1_display_name,
  p1.avatar_url as participant_1_avatar_url,
  p2.display_name as participant_2_display_name,
  p2.avatar_url as participant_2_avatar_url,
  dm.content as last_message_content,
  dm.message_type as last_message_type,
  dm.sender_id as last_message_sender_id,
  (SELECT COUNT(*) FROM public.direct_messages msgs 
   WHERE (msgs.sender_id = c.participant_1_id AND msgs.recipient_id = c.participant_2_id)
      OR (msgs.sender_id = c.participant_2_id AND msgs.recipient_id = c.participant_1_id)
   AND msgs.deleted_at IS NULL) as total_message_count,
  (SELECT COUNT(*) FROM public.direct_messages unread_msgs 
   WHERE unread_msgs.recipient_id = auth.uid()
   AND ((unread_msgs.sender_id = c.participant_1_id AND c.participant_2_id = auth.uid())
        OR (unread_msgs.sender_id = c.participant_2_id AND c.participant_1_id = auth.uid()))
   AND unread_msgs.is_read = false
   AND unread_msgs.deleted_at IS NULL) as unread_count
FROM public.conversations c
LEFT JOIN public.profiles p1 ON c.participant_1_id = p1.user_id
LEFT JOIN public.profiles p2 ON c.participant_2_id = p2.user_id
LEFT JOIN public.direct_messages dm ON c.last_message_id = dm.id;

-- Grant permissions on views
GRANT SELECT ON public.enhanced_direct_messages_with_profiles TO authenticated;
GRANT SELECT ON public.enhanced_conversations_with_profiles TO authenticated;

-- Add comment for documentation
COMMENT ON SCHEMA public IS 'Enhanced messaging system with threads, attachments, search, scheduling, and advanced privacy features implemented.';
