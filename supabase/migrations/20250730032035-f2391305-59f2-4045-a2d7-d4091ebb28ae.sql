-- Drop existing functions and recreate them properly
DROP FUNCTION IF EXISTS public.user_has_role(uuid, app_role);
DROP FUNCTION IF EXISTS public.is_user_banned(uuid);

-- Create helper function for checking user roles
CREATE OR REPLACE FUNCTION public.user_has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function for checking if user is banned
CREATE OR REPLACE FUNCTION public.is_user_banned(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.banned_users
    WHERE user_id = _user_id
      AND (is_permanent = true OR expires_at > now())
  )
$$;