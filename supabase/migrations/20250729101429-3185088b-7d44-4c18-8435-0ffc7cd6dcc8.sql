-- Check existing policies and fix them properly

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can insert conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view conversations" ON conversations;

-- Create new policies with unique names
CREATE POLICY "authenticated_users_view_conversations" ON conversations
FOR SELECT TO authenticated
USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "authenticated_users_create_conversations" ON conversations
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

-- Also enable RLS on direct_messages if not already enabled
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;