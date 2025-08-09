-- Add a test entry to the registry_of_resonance table

-- First, get a user ID to use for the test entry
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get the first user ID from the auth.users table
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Insert a test entry for this user
        INSERT INTO public.registry_of_resonance (
            user_id,
            title,
            content,
            resonance_rating,
            resonance_signature,
            tags,
            entry_type,
            access_level,
            is_verified,
            is_pinned,
            visibility_settings,
            engagement_metrics
        ) VALUES (
            test_user_id,
            'Test Resonance Entry',
            'This is a test entry to verify the Resonance Register functionality is working correctly. The content represents a frequency record aligned with Truth.',
            85,
            'RES-TEST123',
            ARRAY['test', 'verification', 'frequency'],
            'Personal',
            'Private',
            true,
            false,
            '{"public": false, "circle_shared": false, "featured": false}'::jsonb,
            '{"views": 0, "shares": 0, "bookmarks": 0}'::jsonb
        );
        
        RAISE NOTICE 'Test entry created for user ID: %', test_user_id;
    ELSE
        RAISE NOTICE 'No users found in auth.users table';
    END IF;
END $$;