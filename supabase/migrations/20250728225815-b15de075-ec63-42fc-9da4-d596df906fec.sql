-- Enable realtime for messaging tables
-- Set REPLICA IDENTITY FULL to capture complete row data during updates
ALTER TABLE public.chat_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.circle_groups REPLICA IDENTITY FULL;
ALTER TABLE public.circle_posts REPLICA IDENTITY FULL;
ALTER TABLE public.circle_post_comments REPLICA IDENTITY FULL;
ALTER TABLE public.circle_post_likes REPLICA IDENTITY FULL;
ALTER TABLE public.circle_group_members REPLICA IDENTITY FULL;
ALTER TABLE public.channeled_messages REPLICA IDENTITY FULL;

-- Add tables to realtime publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circle_group_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channeled_messages;

-- Create direct messages table for 1-on-1 conversations
CREATE TABLE public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'file')),
  metadata JSONB DEFAULT '{}',
  reply_to_id UUID REFERENCES public.direct_messages(id)
);

-- Enable RLS on direct messages
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for direct messages
CREATE POLICY "Users can view messages they sent or received"
ON public.direct_messages
FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send direct messages"
ON public.direct_messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages"
ON public.direct_messages
FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Create conversations table to track active conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_id UUID REFERENCES public.direct_messages(id),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(participant_1_id, participant_2_id)
);

-- Enable RLS on conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- RLS policies for conversations
CREATE POLICY "Users can view their conversations"
ON public.conversations
FOR SELECT
USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can create conversations"
ON public.conversations
FOR INSERT
WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Enable realtime for new tables
ALTER TABLE public.direct_messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Create indexes for better performance
CREATE INDEX idx_direct_messages_sender_recipient ON public.direct_messages(sender_id, recipient_id);
CREATE INDEX idx_direct_messages_created_at ON public.direct_messages(created_at DESC);
CREATE INDEX idx_conversations_participants ON public.conversations(participant_1_id, participant_2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- Create function to update conversation last message
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or create conversation record
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

-- Create trigger to automatically update conversations
CREATE TRIGGER update_conversation_on_message
  AFTER INSERT ON public.direct_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();