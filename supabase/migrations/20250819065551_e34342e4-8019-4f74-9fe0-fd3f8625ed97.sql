-- Grant admin role to kentburchard@sacredshifter.com
INSERT INTO public.user_roles (user_id, role)
SELECT auth.users.id, 'admin'::app_role
FROM auth.users 
WHERE auth.users.email = 'kentburchard@sacredshifter.com'
ON CONFLICT (user_id, role) DO NOTHING;