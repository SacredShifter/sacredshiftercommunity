-- Fix RLS policies for conversations and direct_messages tables

-- First, check if conversations table exists and enable RLS
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
        ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
        
        -- Drop any existing policies to avoid conflicts
        DROP POLICY IF EXISTS "authenticated_users_view_conversations" ON conversations;
        DROP POLICY IF EXISTS "authenticated_users_create_conversations" ON conversations;
        DROP POLICY IF EXISTS "Users can view conversations" ON conversations;
        DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
        
        -- Create proper policies for conversations
        CREATE POLICY "Users can view their conversations" ON conversations
        FOR SELECT TO authenticated
        USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

        CREATE POLICY "Users can create conversations" ON conversations
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

        CREATE POLICY "Users can update their conversations" ON conversations
        FOR UPDATE TO authenticated
        USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id)
        WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);
    END IF;
END $$;

-- Ensure direct_messages table has proper RLS policies
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Users can send direct messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can view direct messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can view their direct messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can update their direct messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can delete their direct messages" ON direct_messages;

-- Create comprehensive policies for direct_messages
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