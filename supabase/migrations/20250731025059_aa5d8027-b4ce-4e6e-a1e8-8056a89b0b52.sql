-- Grant admin role to current users who should have admin access
-- This is a one-time setup for admin users

INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email IN ('kentburchard@gmail.com', 'tasman.kirkwood@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- Also create a function to easily check user roles for debugging
CREATE OR REPLACE FUNCTION public.user_has_role(user_uuid uuid, check_role app_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = check_role
  );
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.user_has_role(uuid, app_role) TO authenticated;