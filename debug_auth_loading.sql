-- Debug authentication and profile loading issues
-- Run this to check if your user profile exists

-- Check if your user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'kentburchard@sacredshifter.com';

-- Check if your profile exists in profiles table
SELECT p.*, u.email 
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE u.email = 'kentburchard@sacredshifter.com';

-- If profile doesn't exist, create it
INSERT INTO public.profiles (user_id, display_name)
SELECT id, 'Kent Burchard'
FROM auth.users 
WHERE email = 'kentburchard@sacredshifter.com'
AND NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.users.id
);

-- Verify profile was created/exists
SELECT 'Profile check:' as status;
SELECT p.user_id, p.display_name, p.created_at, u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.user_id
WHERE u.email = 'kentburchard@sacredshifter.com';