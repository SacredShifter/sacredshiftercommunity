-- Add message reactions table
CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Add typing status table
CREATE TABLE IF NOT EXISTS public.typing_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_typing BOOLEAN DEFAULT false,
  last_typed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, conversation_partner_id)
);

-- Add file attachments support to direct_messages
ALTER TABLE public.direct_messages 
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS file_type TEXT;

-- Enable RLS for new tables
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.typing_status ENABLE ROW LEVEL SECURITY;

-- RLS policies for message_reactions
CREATE POLICY "Users can view reactions on messages they can see" ON public.message_reactions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.direct_messages dm 
    WHERE dm.id = message_reactions.message_id 
    AND (dm.sender_id = auth.uid() OR dm.recipient_id = auth.uid())
  )
);

CREATE POLICY "Users can add reactions to messages they can see" ON public.message_reactions
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.direct_messages dm 
    WHERE dm.id = message_reactions.message_id 
    AND (dm.sender_id = auth.uid() OR dm.recipient_id = auth.uid())
  )
);

CREATE POLICY "Users can remove their own reactions" ON public.message_reactions
FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for typing_status
CREATE POLICY "Users can view typing status for their conversations" ON public.typing_status
FOR SELECT USING (auth.uid() = user_id OR auth.uid() = conversation_partner_id);

CREATE POLICY "Users can update their own typing status" ON public.typing_status
FOR ALL USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_id ON public.message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reactions_user_id ON public.message_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_status_users ON public.typing_status(user_id, conversation_partner_id);

-- Enable realtime for new tables
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.typing_status REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_status;

-- Function to clean up old typing status
CREATE OR REPLACE FUNCTION cleanup_old_typing_status()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_status 
  WHERE last_typed_at < NOW() - INTERVAL '30 seconds';
END;
$$ LANGUAGE plpgsql;
