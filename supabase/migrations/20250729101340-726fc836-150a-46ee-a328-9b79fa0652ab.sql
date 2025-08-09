-- Fix RLS policies for direct_messages table

-- First, check the current policies and drop the problematic ones
DROP POLICY IF EXISTS "Users can send direct messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can view direct messages" ON direct_messages;

-- Create proper RLS policies for direct_messages
CREATE POLICY "Users can send direct messages" ON direct_messages
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their direct messages" ON direct_messages
FOR SELECT TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can update their direct messages" ON direct_messages
FOR UPDATE TO authenticated
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can delete their direct messages" ON direct_messages
FOR DELETE TO authenticated
USING (auth.uid() = sender_id);

-- Also fix conversations table policies
DROP POLICY IF EXISTS "Users can view conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;

CREATE POLICY "Users can view their conversations" ON conversations
FOR SELECT TO authenticated
USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "Users can create conversations" ON conversations
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);