-- Check all RLS policies and Supabase setup for direct messages

-- 1. List all tables with RLS enabled
SELECT tablename, schemaname, rowsecurity
FROM pg_tables
WHERE rowsecurity = true AND schemaname = 'public';

-- 2. List all RLS policies for all tables
SELECT schemaname, tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
ORDER BY tablename, policyname;

-- 3. Show grants for direct_messages and related tables
SELECT grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_name IN ('direct_messages', 'conversations', 'banned_users', 'profiles');

-- 4. Show structure of direct_messages table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'direct_messages';

-- 5. Show structure of banned_users table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'banned_users';

-- 6. Show structure of conversations table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'conversations';

-- 7. Check if is_user_banned function exists
SELECT routine_name, routine_type, data_type
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'is_user_banned';

-- 8. Check if anon role has privileges
SELECT * FROM information_schema.role_table_grants WHERE grantee = 'anon';

-- 9. Show all users and roles (if possible)
SELECT * FROM pg_roles;

-- 10. Test a select and insert on direct_messages (will fail if RLS blocks)
SELECT * FROM public.direct_messages LIMIT 1;
-- Try to insert a test message (replace UUIDs as needed)
-- INSERT INTO public.direct_messages (id, sender_id, recipient_id, content, message_type, is_read, created_at, updated_at) VALUES ('test-id', 'test-sender', 'test-recipient', 'test', 'text', false, now(), now());
