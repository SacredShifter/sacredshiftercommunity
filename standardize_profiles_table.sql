-- Standardize the profiles table structure and fix all related issues
-- This will ensure consistent column usage across the application

-- First, let's see what we have
DO $$
DECLARE
    has_user_id_column boolean := false;
    has_id_column boolean := false;
    primary_key_column text;
    table_exists boolean := false;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) INTO table_exists;
    
    IF NOT table_exists THEN
        RAISE NOTICE 'Profiles table does not exist, creating it...';
        
        -- Create the table with the correct structure
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            display_name TEXT,
            full_name TEXT,
            avatar_url TEXT,
            bio TEXT,
            chakra_alignment TEXT,
            completed_tours TEXT[] DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Profiles table created with id as primary key';
    ELSE
        -- Check existing structure
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'user_id'
        ) INTO has_user_id_column;
        
        SELECT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'id'
        ) INTO has_id_column;
        
        -- Get primary key column
        SELECT a.attname INTO primary_key_column
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = 'public.profiles'::regclass AND i.indisprimary;
        
        RAISE NOTICE 'Table exists - has_user_id: %, has_id: %, primary_key: %', 
                     has_user_id_column, has_id_column, primary_key_column;
        
        -- If we have user_id as primary key, we need to restructure
        IF primary_key_column = 'user_id' THEN
            RAISE NOTICE 'Converting user_id primary key to id primary key...';
            
            -- Create a backup
            CREATE TABLE IF NOT EXISTS profiles_backup AS SELECT * FROM public.profiles;
            
            -- Drop the old table
            DROP TABLE public.profiles CASCADE;
            
            -- Recreate with correct structure
            CREATE TABLE public.profiles (
                id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
                display_name TEXT,
                full_name TEXT,
                avatar_url TEXT,
                bio TEXT,
                chakra_alignment TEXT,
                completed_tours TEXT[] DEFAULT '{}',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Migrate data from backup
            INSERT INTO public.profiles (id, display_name, full_name, avatar_url, bio, chakra_alignment, completed_tours, created_at, updated_at)
            SELECT 
                user_id as id,
                display_name,
                full_name,
                avatar_url,
                bio,
                chakra_alignment,
                completed_tours,
                created_at,
                updated_at
            FROM profiles_backup
            ON CONFLICT (id) DO NOTHING;
            
            -- Enable RLS
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
            
            RAISE NOTICE 'Table restructured successfully';
        ELSE
            -- Add missing columns if they don't exist
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'completed_tours'
            ) THEN
                ALTER TABLE public.profiles ADD COLUMN completed_tours TEXT[] DEFAULT '{}';
                RAISE NOTICE 'Added completed_tours column';
            END IF;
            
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'full_name'
            ) THEN
                ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
                RAISE NOTICE 'Added full_name column';
            END IF;
            
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'bio'
            ) THEN
                ALTER TABLE public.profiles ADD COLUMN bio TEXT;
                RAISE NOTICE 'Added bio column';
            END IF;
            
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'profiles' 
                AND column_name = 'chakra_alignment'
            ) THEN
                ALTER TABLE public.profiles ADD COLUMN chakra_alignment TEXT;
                RAISE NOTICE 'Added chakra_alignment column';
            END IF;
        END IF;
    END IF;
END $$;

-- Drop all existing policies
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

-- Create standardized policies using 'id' column
CREATE POLICY "profiles_select_all" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

-- Update the handle_new_user function to use the correct structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, full_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name', 
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'display_name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error creating profile for user % (email: %): % - %', NEW.id, NEW.email, SQLSTATE, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for any existing users that don't have them
INSERT INTO public.profiles (id, display_name)
SELECT 
  u.id, 
  COALESCE(u.raw_user_meta_data->>'display_name', u.email)
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify the final structure
SELECT 'Final profiles table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

SELECT 'Final RLS policies:' as info;
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'profiles'
ORDER BY policyname;

SELECT 'Profile count:' as info;
SELECT COUNT(*) as total_profiles FROM public.profiles;

SELECT 'Profiles table standardization complete!' as result;
