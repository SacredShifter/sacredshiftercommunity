-- CRITICAL SECURITY FIXES - Phase 1 (Safe Approach)
-- Fix infinite recursion, secure admin system, and add missing RLS policies

-- Step 1: Create security definer function for role checking to prevent infinite recursion
CREATE OR REPLACE FUNCTION public.user_has_role(user_id uuid, role_name app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = $1 AND ur.role = $2
  );
$$;

-- Step 2: Fix infinite recursion in existing RLS policies by updating them to use the security definer function
-- Fix user_roles table policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage user roles" ON public.user_roles
FOR ALL USING (public.user_has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.user_has_role(auth.uid(), 'admin'::app_role));

-- Step 3: Handle existing roles safely - backup valid roles only
-- Use a safer approach that handles potential enum issues
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Iterate through profiles and safely check for valid roles
    FOR rec IN SELECT id, role FROM public.profiles WHERE role IS NOT NULL
    LOOP
        BEGIN
            -- Try to insert the role, catching any enum conversion errors
            INSERT INTO public.user_roles (user_id, role)
            VALUES (rec.id, rec.role)
            ON CONFLICT (user_id, role) DO NOTHING;
        EXCEPTION WHEN others THEN
            -- Skip invalid enum values silently
            CONTINUE;
        END;
    END LOOP;
END
$$;

-- Step 4: Remove the dangerous role column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Step 5: Secure profiles table - remove public read access
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create secure profile policies with privacy controls
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles  
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Admins can view all profiles for moderation
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.user_has_role(auth.uid(), 'admin'::app_role));

-- Step 6: Add missing RLS policies for critical unprotected tables
-- Secure user_features table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_features') THEN
        EXECUTE 'ALTER TABLE public.user_features ENABLE ROW LEVEL SECURITY';
        
        -- Drop existing policies if they exist
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "Users can manage their own features" ON public.user_features';
            EXECUTE 'DROP POLICY IF EXISTS "Admins can manage all features" ON public.user_features';
        EXCEPTION WHEN others THEN
            NULL; -- Ignore errors if policies don't exist
        END;
        
        EXECUTE 'CREATE POLICY "Users can manage their own features" ON public.user_features FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)';
        EXECUTE 'CREATE POLICY "Admins can manage all features" ON public.user_features FOR ALL USING (public.user_has_role(auth.uid(), ''admin''::app_role))';
    END IF;
END
$$;

-- Step 7: Add audit logging function for security events
CREATE OR REPLACE FUNCTION public.log_security_event(
    event_type TEXT,
    user_id UUID,
    details JSONB DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.aura_audit (action, actor, after, created_at)
    VALUES (event_type, user_id, details, now());
END;
$$;

-- Step 8: Create trigger to log role changes for security monitoring
CREATE OR REPLACE FUNCTION public.audit_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM public.log_security_event(
            'role_granted',
            NEW.user_id,
            jsonb_build_object('role', NEW.role, 'granted_by', auth.uid())
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM public.log_security_event(
            'role_revoked',
            OLD.user_id,
            jsonb_build_object('role', OLD.role, 'revoked_by', auth.uid())
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$;

-- Create the audit trigger
DROP TRIGGER IF EXISTS audit_role_changes_trigger ON public.user_roles;
CREATE TRIGGER audit_role_changes_trigger
    AFTER INSERT OR DELETE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_role_changes();

-- Step 9: Grant necessary permissions for the security functions
GRANT EXECUTE ON FUNCTION public.user_has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_security_event(TEXT, UUID, JSONB) TO authenticated;

-- Add comment for security documentation
COMMENT ON FUNCTION public.user_has_role IS 'Security definer function to check user roles without infinite recursion in RLS policies';