-- Fix Direct Messages and Profiles Relationship Issues

-- First, check the structure of the profiles table
DO $$
DECLARE
    profile_id_exists BOOLEAN;
    profile_user_id_exists BOOLEAN;
BEGIN
    -- Check if profiles table has 'id' column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'id'
    ) INTO profile_id_exists;
    
    -- Check if profiles table has 'user_id' column
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'user_id'
    ) INTO profile_user_id_exists;
    
    -- If both columns exist, we need to ensure they're properly aligned
    IF profile_id_exists AND profile_user_id_exists THEN
        -- Update any profiles where id doesn't match user_id
        UPDATE public.profiles
        SET id = user_id
        WHERE id != user_id;
        
        RAISE NOTICE 'Updated profiles to ensure id matches user_id';
    END IF;
    
    -- If only user_id exists, we need to add id column
    IF NOT profile_id_exists AND profile_user_id_exists THEN
        ALTER TABLE public.profiles ADD COLUMN id UUID DEFAULT gen_random_uuid();
        
        -- Set id to match user_id
        UPDATE public.profiles SET id = user_id;
        
        -- Add primary key constraint
        ALTER TABLE public.profiles ADD PRIMARY KEY (id);
        
        RAISE NOTICE 'Added id column to profiles table and set it to match user_id';
    END IF;
    
    -- If only id exists, we need to add user_id column
    IF profile_id_exists AND NOT profile_user_id_exists THEN
        ALTER TABLE public.profiles ADD COLUMN user_id UUID REFERENCES auth.users(id);
        
        -- Set user_id to match id
        UPDATE public.profiles SET user_id = id;
        
        -- Add unique constraint
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
        
        RAISE NOTICE 'Added user_id column to profiles table and set it to match id';
    END IF;
END $$;

-- Now fix the direct_messages_with_profiles view to handle both possible profile structures
DROP VIEW IF EXISTS public.direct_messages_with_profiles;

CREATE OR REPLACE VIEW public.direct_messages_with_profiles AS
SELECT
  dm.*,
  sender_profile.display_name as sender_display_name,
  sender_profile.avatar_url as sender_avatar_url,
  recipient_profile.display_name as recipient_display_name,
  recipient_profile.avatar_url as recipient_avatar_url
FROM public.direct_messages dm
LEFT JOIN public.profiles sender_profile ON dm.sender_id = COALESCE(sender_profile.user_id, sender_profile.id)
LEFT JOIN public.profiles recipient_profile ON dm.recipient_id = COALESCE(recipient_profile.user_id, recipient_profile.id);

-- Fix the DirectMessageInterface component by adding missing methods to directMessagesService
CREATE OR REPLACE FUNCTION public.test_banned_users_table()
RETURNS BOOLEAN AS $$
DECLARE
    table_exists BOOLEAN;
BEGIN
    -- Check if banned_users table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'banned_users'
    ) INTO table_exists;
    
    -- If it doesn't exist, create it
    IF NOT table_exists THEN
        CREATE TABLE public.banned_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id),
            banned_by UUID NOT NULL REFERENCES auth.users(id),
            reason TEXT,
            is_permanent BOOLEAN DEFAULT true,
            expires_at TIMESTAMP WITH TIME ZONE,
            banned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add indexes
        CREATE INDEX idx_banned_users_user_id ON public.banned_users(user_id);
        
        -- Add RLS policies
        ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Admins can manage banned users"
        ON public.banned_users
        FOR ALL
        USING (
            EXISTS (
                SELECT 1 FROM public.user_roles
                WHERE user_id = auth.uid() AND role = 'admin'
            )
        );
        
        RETURN true;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if a user is banned
CREATE OR REPLACE FUNCTION public.is_user_banned(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    is_banned BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.banned_users
        WHERE user_id = check_user_id
        AND (is_permanent OR expires_at > now())
    ) INTO is_banned;
    
    RETURN is_banned;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT ON public.direct_messages_with_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_banned_users_table TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_banned TO authenticated;