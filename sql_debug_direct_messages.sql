-- SQL diagnostic script for direct_messages debugging
-- Run this in your Supabase SQL editor to check the current state

-- 1. Check if direct_messages table exists and its structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'direct_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check if RLS is enabled on direct_messages
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'direct_messages';

-- 3. List all current RLS policies for direct_messages
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

-- 4. Check if banned_users table exists
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'banned_users'
) as banned_users_table_exists;

-- 5. If banned_users exists, check its structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'banned_users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Check if is_user_banned function exists
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.routines 
  WHERE routine_schema = 'public' 
  AND routine_name = 'is_user_banned'
) as is_user_banned_function_exists;

-- 7. Test a simple query on direct_messages (this will tell us if basic access works)
-- Note: This might return an error if RLS blocks it, which is useful information
SELECT COUNT(*) as total_messages FROM public.direct_messages;

-- 8. Check if conversations table exists (used by sendMessage)
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'conversations'
) as conversations_table_exists;
