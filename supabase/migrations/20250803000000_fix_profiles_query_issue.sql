-- Fix profiles table query issues
-- This migration ensures the profiles table has the correct structure and permissions

-- First, check if the user_id column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE profiles ADD COLUMN user_id UUID REFERENCES auth.users(id);
        
        -- Update user_id values from id column if it exists
        UPDATE profiles SET user_id = id::uuid WHERE user_id IS NULL;
    END IF;
END
$$;

-- Ensure the id column is the primary key and has the correct type
DO $$
BEGIN
    -- Check if we need to modify the id column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'id' AND data_type != 'uuid'
    ) THEN
        -- Drop primary key constraint if it exists
        IF EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE table_name = 'profiles' AND constraint_type = 'PRIMARY KEY'
        ) THEN
            EXECUTE 'ALTER TABLE profiles DROP CONSTRAINT ' || 
                   (SELECT constraint_name FROM information_schema.table_constraints 
                    WHERE table_name = 'profiles' AND constraint_type = 'PRIMARY KEY');
        END IF;
        
        -- Alter id column to UUID if needed
        ALTER TABLE profiles ALTER COLUMN id TYPE UUID USING id::uuid;
        
        -- Add primary key constraint
        ALTER TABLE profiles ADD PRIMARY KEY (id);
    END IF;
END
$$;

-- Ensure the completed_tours column exists and has the correct type
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'completed_tours'
    ) THEN
        ALTER TABLE profiles ADD COLUMN completed_tours TEXT[] DEFAULT '{}';
    END IF;
END
$$;

-- Fix RLS policies for profiles table
-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create proper policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);

-- Create index on id for faster queries
CREATE INDEX IF NOT EXISTS profiles_id_idx ON profiles(id);