-- Fix Direct Messages Schema Issues
-- This migration addresses the critical database schema problems identified in the review

-- 1. Update direct_messages to properly reference profiles table
-- First, we need to ensure all existing users have profiles
INSERT INTO public.profiles (user_id, display_name)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'display_name', 'Sacred Seeker')
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO NOTHING;

-- 2. Add proper indexes for message queries with profile joins
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender_profile ON public.direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient_profile ON public.direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_conversation_lookup ON public.direct_messages(sender_id, recipient_id, created_at);

-- 3. Add indexes for conversations table
CREATE INDEX IF NOT EXISTS idx_conversations_participant_lookup ON public.conversations(participant_1_id, participant_2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_lookup ON public.conversations(participant_1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_lookup_2 ON public.conversations(participant_2_id);

-- 4. Create a view for messages with profile data
CREATE OR REPLACE VIEW public.direct_messages_with_profiles AS
SELECT 
  dm.*,
  sender_profile.display_name as sender_display_name,
  sender_profile.avatar_url as sender_avatar_url,
  recipient_profile.display_name as recipient_display_name,
  recipient_profile.avatar_url as recipient_avatar_url
FROM public.direct_messages dm
LEFT JOIN public.profiles sender_profile ON dm.sender_id = sender_profile.user_id
LEFT JOIN public.profiles recipient_profile ON dm.recipient_id = recipient_profile.user_id;

-- 5. Create a view for conversations with profile data
CREATE OR REPLACE VIEW public.conversations_with_profiles AS
SELECT 
  c.*,
  p1.display_name as participant_1_display_name,
  p1.avatar_url as participant_1_avatar_url,
  p2.display_name as participant_2_display_name,
  p2.avatar_url as participant_2_avatar_url,
  dm.content as last_message_content,
  dm.message_type as last_message_type
FROM public.conversations c
LEFT JOIN public.profiles p1 ON c.participant_1_id = p1.user_id
LEFT JOIN public.profiles p2 ON c.participant_2_id = p2.user_id
LEFT JOIN public.direct_messages dm ON c.last_message_id = dm.id;

-- 6. Create function to get conversation between two users
CREATE OR REPLACE FUNCTION public.get_conversation_between_users(user1_id UUID, user2_id UUID)
RETURNS TABLE (
  id UUID,
  participant_1_id UUID,
  participant_2_id UUID,
  last_message_id UUID,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.participant_1_id, c.participant_2_id, c.last_message_id, c.last_message_at, c.created_at
  FROM public.conversations c
  WHERE (c.participant_1_id = user1_id AND c.participant_2_id = user2_id)
     OR (c.participant_1_id = user2_id AND c.participant_2_id = user1_id);
END;
$$;

-- 7. Create function to get messages with profile data for a conversation
CREATE OR REPLACE FUNCTION public.get_messages_with_profiles(user1_id UUID, user2_id UUID, limit_count INTEGER DEFAULT 50, offset_count INTEGER DEFAULT 0)
RETURNS TABLE (
  id UUID,
  sender_id UUID,
  recipient_id UUID,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN,
  message_type TEXT,
  metadata JSONB,
  reply_to_id UUID,
  sender_display_name TEXT,
  sender_avatar_url TEXT,
  recipient_display_name TEXT,
  recipient_avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    dm.id,
    dm.sender_id,
    dm.recipient_id,
    dm.content,
    dm.created_at,
    dm.updated_at,
    dm.is_read,
    dm.message_type,
    dm.metadata,
    dm.reply_to_id,
    sender_profile.display_name,
    sender_profile.avatar_url,
    recipient_profile.display_name,
    recipient_profile.avatar_url
  FROM public.direct_messages dm
  LEFT JOIN public.profiles sender_profile ON dm.sender_id = sender_profile.user_id
  LEFT JOIN public.profiles recipient_profile ON dm.recipient_id = recipient_profile.user_id
  WHERE (dm.sender_id = user1_id AND dm.recipient_id = user2_id)
     OR (dm.sender_id = user2_id AND dm.recipient_id = user1_id)
  ORDER BY dm.created_at ASC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$;

-- 8. Update conversation trigger to handle ordering properly
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or create conversation record with proper participant ordering
  INSERT INTO public.conversations (participant_1_id, participant_2_id, last_message_id, last_message_at)
  VALUES (
    LEAST(NEW.sender_id, NEW.recipient_id),
    GREATEST(NEW.sender_id, NEW.recipient_id),
    NEW.id,
    NEW.created_at
  )
  ON CONFLICT (participant_1_id, participant_2_id)
  DO UPDATE SET
    last_message_id = NEW.id,
    last_message_at = NEW.created_at;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Grant necessary permissions
GRANT SELECT ON public.direct_messages_with_profiles TO authenticated;
GRANT SELECT ON public.conversations_with_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_conversation_between_users TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_messages_with_profiles TO authenticated;