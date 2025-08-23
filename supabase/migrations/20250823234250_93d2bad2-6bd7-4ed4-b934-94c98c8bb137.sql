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