-- Check current RLS policies for direct_messages table
-- Run this to see what policies currently exist

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'direct_messages'
ORDER BY policyname;

-- Also check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'direct_messages';

-- Check if the table exists and its structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'direct_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;
