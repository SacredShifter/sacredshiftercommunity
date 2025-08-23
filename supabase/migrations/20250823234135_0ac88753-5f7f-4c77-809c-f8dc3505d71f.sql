-- Clean up duplicate RLS policies and implement proper bilateral scoping
-- Drop all existing direct_messages policies first
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can view messages they sent or received" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_delete_policy" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_insert_policy" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_select_policy" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_update_policy" ON public.direct_messages;

-- Create new secure RLS policies with proper bilateral scoping
CREATE POLICY "dm_select_bilateral" ON public.direct_messages
FOR SELECT USING (
  (auth.uid() = sender_id) OR (auth.uid() = recipient_id)
);

CREATE POLICY "dm_insert_secure" ON public.direct_messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  sender_id != recipient_id AND
  NOT is_user_banned(auth.uid()) AND 
  NOT is_user_banned(recipient_id)
);

CREATE POLICY "dm_update_read_only" ON public.direct_messages
FOR UPDATE USING (
  auth.uid() = recipient_id AND updated_at = created_at
) WITH CHECK (
  is_read = true OR deleted_at IS NOT NULL
);

CREATE POLICY "dm_delete_sender_only" ON public.direct_messages
FOR DELETE USING (
  auth.uid() = sender_id OR 
  (auth.uid() = recipient_id AND deleted_at IS NOT NULL)
);

-- Add message retention and expiration functionality
ALTER TABLE public.direct_messages 
ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS auto_delete_after interval DEFAULT '30 days'::interval;

-- Create function for automatic message cleanup
CREATE OR REPLACE FUNCTION public.cleanup_expired_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.direct_messages 
  WHERE expires_at IS NOT NULL AND expires_at < now();
  
  DELETE FROM public.direct_messages 
  WHERE auto_delete_after IS NOT NULL 
  AND created_at + auto_delete_after < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add message blocking functionality
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL,
  blocked_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  reason text,
  UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_manage_blocks" ON public.user_blocks
FOR ALL USING (auth.uid() = blocker_id)
WITH CHECK (auth.uid() = blocker_id AND blocker_id != blocked_id);

-- Update direct messages policies to respect blocks
DROP POLICY "dm_insert_secure" ON public.direct_messages;
CREATE POLICY "dm_insert_secure" ON public.direct_messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  sender_id != recipient_id AND
  NOT is_user_banned(auth.uid()) AND 
  NOT is_user_banned(recipient_id) AND
  NOT EXISTS (
    SELECT 1 FROM public.user_blocks 
    WHERE (blocker_id = recipient_id AND blocked_id = sender_id)
    OR (blocker_id = sender_id AND blocked_id = recipient_id)
  )
);

-- Add typing indicators table with proper cleanup
CREATE TABLE IF NOT EXISTS public.typing_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  conversation_partner_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '10 seconds'),
  UNIQUE(user_id, conversation_partner_id)
);

ALTER TABLE public.typing_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "typing_indicators_bilateral" ON public.typing_indicators
FOR ALL USING (
  auth.uid() = user_id OR auth.uid() = conversation_partner_id
) WITH CHECK (
  auth.uid() = user_id
);

-- Function to automatically clean up expired typing indicators
CREATE OR REPLACE FUNCTION public.cleanup_expired_typing()
RETURNS void AS $$
BEGIN
  DELETE FROM public.typing_indicators WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add message delivery tracking
CREATE TABLE IF NOT EXISTS public.message_delivery_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.direct_messages(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  timestamp timestamp with time zone DEFAULT now(),
  UNIQUE(message_id, status)
);

ALTER TABLE public.message_delivery_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "delivery_status_bilateral" ON public.message_delivery_status
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.direct_messages dm 
    WHERE dm.id = message_id 
    AND (dm.sender_id = auth.uid() OR dm.recipient_id = auth.uid())
  )
);

CREATE POLICY "delivery_status_insert" ON public.message_delivery_status
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.direct_messages dm 
    WHERE dm.id = message_id 
    AND (dm.sender_id = auth.uid() OR dm.recipient_id = auth.uid())
  )
);

-- Add message audit log for admin oversight
CREATE TABLE IF NOT EXISTS public.message_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid,
  action text NOT NULL,
  actor_id uuid NOT NULL,
  timestamp timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

ALTER TABLE public.message_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_only" ON public.message_audit_log
FOR ALL USING (user_has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (user_has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime for new tables
ALTER TABLE public.typing_indicators REPLICA IDENTITY FULL;
ALTER TABLE public.message_delivery_status REPLICA IDENTITY FULL;
ALTER TABLE public.user_blocks REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_indicators;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_delivery_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_blocks;