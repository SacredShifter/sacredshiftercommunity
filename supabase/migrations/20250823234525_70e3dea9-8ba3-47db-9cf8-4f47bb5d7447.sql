-- Update direct messages insert policy to respect existing user_blocks table structure
DROP POLICY "dm_insert_secure" ON public.direct_messages;
CREATE POLICY "dm_insert_secure" ON public.direct_messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND 
  sender_id != recipient_id AND
  NOT is_user_banned(auth.uid()) AND 
  NOT is_user_banned(recipient_id) AND
  NOT EXISTS (
    SELECT 1 FROM public.user_blocks 
    WHERE (user_id = recipient_id AND blocked_user_id = sender_id)
    OR (user_id = sender_id AND blocked_user_id = recipient_id)
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

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.typing_indicators;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_delivery_status;