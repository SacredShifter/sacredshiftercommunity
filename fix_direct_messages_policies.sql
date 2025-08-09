-- Fix duplicate direct_messages policies
-- This script safely drops and recreates RLS policies for direct_messages table

-- First, drop all existing policies for direct_messages to clean up duplicates
DROP POLICY IF EXISTS "direct_messages_select_policy" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_insert_policy" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_update_policy" ON public.direct_messages;
DROP POLICY IF EXISTS "direct_messages_delete_policy" ON public.direct_messages;

-- Also drop any old policy names that might exist
DROP POLICY IF EXISTS "Users can send direct messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can view direct messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can view their direct messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can update their direct messages" ON public.direct_messages;
DROP POLICY IF EXISTS "Users can delete their direct messages" ON public.direct_messages;

-- Recreate the policies with proper conditions
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

-- Ensure RLS is enabled
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.direct_messages TO authenticated;
