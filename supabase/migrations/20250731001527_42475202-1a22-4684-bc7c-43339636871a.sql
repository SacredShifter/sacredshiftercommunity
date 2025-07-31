-- Create missing profile for existing users  
INSERT INTO public.profiles (user_id, display_name)
SELECT 
  u.id, 
  COALESCE(u.raw_user_meta_data->>'display_name', u.email)
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);