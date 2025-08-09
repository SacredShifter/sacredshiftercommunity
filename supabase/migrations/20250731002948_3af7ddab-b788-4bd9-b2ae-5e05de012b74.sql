-- Enable RLS on user_roles table (this is critical for auth)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Also check if profiles table exists and has RLS enabled
DO $$
BEGIN
    -- Only try to enable RLS if the table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Check if RLS is already enabled
        IF NOT EXISTS (
            SELECT 1 
            FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'profiles' 
            AND rowsecurity = true
        ) THEN
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        END IF;
    END IF;
END $$;