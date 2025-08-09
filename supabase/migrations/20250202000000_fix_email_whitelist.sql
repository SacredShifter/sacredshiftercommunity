-- Fix email whitelist for AI assistant and agent functionality
-- This migration ensures the correct email is used across all systems

-- First, check if the user exists with the correct email and update the whitelist
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Try to find user with kentburchard@sacredshifter.com
    SELECT id, email INTO user_record 
    FROM auth.users 
    WHERE email = 'kentburchard@sacredshifter.com';
    
    IF FOUND THEN
        -- Update the agent whitelist with the correct user ID
        INSERT INTO public.agent_whitelist (user_id, email, can_approve, can_configure, approval_scope)
        VALUES (
            user_record.id, 
            'kentburchard@sacredshifter.com', 
            true, 
            true, 
            '["*"]'::jsonb
        )
        ON CONFLICT (email) 
        DO UPDATE SET 
            user_id = user_record.id,
            can_approve = true,
            can_configure = true,
            approval_scope = '["*"]'::jsonb,
            updated_at = now();
        
        -- Also ensure the user has enhanced memory features
        INSERT INTO public.user_features (user_id, feature_name, is_enabled, metadata)
        VALUES (
            user_record.id,
            'enhanced_memory',
            true,
            jsonb_build_object('max_memory_length', 50, 'memory_retention_days', 90)
        )
        ON CONFLICT (user_id, feature_name) 
        DO UPDATE SET 
            is_enabled = true,
            metadata = jsonb_build_object('max_memory_length', 50, 'memory_retention_days', 90);
        
        RAISE NOTICE 'Updated whitelist and features for user: %', user_record.email;
    ELSE
        RAISE NOTICE 'User with email kentburchard@sacredshifter.com not found in auth.users';
    END IF;
END $$;

-- Create a function to check if user has enhanced memory access
CREATE OR REPLACE FUNCTION public.has_enhanced_memory(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN := false;
BEGIN
    -- Check if user email is in the enhanced memory whitelist
    SELECT EXISTS (
        SELECT 1 FROM public.user_features uf
        JOIN auth.users u ON u.id = uf.user_id
        WHERE u.email = user_email 
        AND uf.feature_name = 'enhanced_memory'
        AND uf.is_enabled = true
    ) INTO has_access;
    
    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user has unrestricted AI access
CREATE OR REPLACE FUNCTION public.has_unrestricted_ai_access(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_access BOOLEAN := false;
    whitelist_emails TEXT[] := ARRAY['kentburchard@sacredshifter.com'];
BEGIN
    -- Check if user email is in the unrestricted AI whitelist
    SELECT user_email = ANY(whitelist_emails) INTO has_access;
    
    RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user can approve agent actions by email
CREATE OR REPLACE FUNCTION public.can_approve_agent_actions_by_email(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    can_approve_flag BOOLEAN := false;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.agent_whitelist aw
        WHERE aw.email = user_email 
        AND aw.can_approve = true
    ) INTO can_approve_flag;
    
    RETURN can_approve_flag;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION public.has_enhanced_memory(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_unrestricted_ai_access(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_approve_agent_actions_by_email(TEXT) TO authenticated;