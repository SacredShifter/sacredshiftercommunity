-- Fix profiles table structure and RLS policies for Messages functionality
-- This script will handle both possible table structures (id vs user_id as primary key)

-- First, let's check what columns actually exist in the profiles table
DO $$
DECLARE
    has_user_id_column boolean := false;
    has_id_column boolean := false;
    primary_key_column text;
BEGIN
    -- Check if user_id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'user_id'
    ) INTO has_user_id_column;
    
    -- Check if id column exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'id'
    ) INTO has_id_column;
    
    -- Determine which column is the primary key
    SELECT a.attname INTO primary_key_column
    FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = 'public.profiles'::regclass AND i.indisprimary;
    
    RAISE NOTICE 'Profiles table analysis:';
    RAISE NOTICE 'Has user_id column: %', has_user_id_column;
    RAISE NOTICE 'Has id column: %', has_id_column;
    RAISE NOTICE 'Primary key column: %', primary_key_column;
    
    -- Store the results in a temporary table for use in the next block
    CREATE TEMP TABLE IF NOT EXISTS profile_structure (
        has_user_id boolean,
        has_id boolean,
        primary_key text
    );
    
    DELETE FROM profile_structure;
    INSERT INTO profile_structure VALUES (has_user_id_column, has_id_column, primary_key_column);
END $$;

-- Now drop all existing policies regardless of structure
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies based on the table structure
DO $$
DECLARE
    structure_record RECORD;
    user_column text;
BEGIN
    SELECT * INTO structure_record FROM profile_structure LIMIT 1;
    
    -- Determine which column to use for user identification
    IF structure_record.primary_key = 'user_id' OR structure_record.has_user_id THEN
        user_column := 'user_id';
    ELSE
        user_column := 'id';
    END IF;
    
    RAISE NOTICE 'Using column for user identification: %', user_column;
    
    -- Create policies using the correct column
    EXECUTE format('
        CREATE POLICY "profiles_select_all" 
        ON public.profiles 
        FOR SELECT 
        TO authenticated
        USING (true)
    ');
    
    EXECUTE format('
        CREATE POLICY "profiles_insert_own" 
        ON public.profiles 
        FOR INSERT 
        TO authenticated
        WITH CHECK (auth.uid() = %I)
    ', user_column);
    
    EXECUTE format('
        CREATE POLICY "profiles_update_own" 
        ON public.profiles 
        FOR UPDATE 
        TO authenticated
        USING (auth.uid() = %I)
        WITH CHECK (auth.uid() = %I)
    ', user_column, user_column);
    
    EXECUTE format('
        CREATE POLICY "profiles_delete_own" 
        ON public.profiles 
        FOR DELETE 
        TO authenticated
        USING (auth.uid() = %I)
    ', user_column);
    
END $$;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- Clean up temporary table
DROP TABLE IF EXISTS profile_structure;

-- Verify the new policies are in place
SELECT 'New policies created:' as status;
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;

-- Test query to ensure profiles can be selected
SELECT 'Testing profile access:' as test;
SELECT COUNT(*) as profile_count FROM public.profiles;

-- Show current table structure for verification
SELECT 'Current profiles table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

SELECT 'Profiles table RLS policies have been fixed!' as result;
