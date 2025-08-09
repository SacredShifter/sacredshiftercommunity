-- Create is_user_banned function for RLS policies
-- This function is used by direct_messages RLS policies to check if a user is banned

CREATE OR REPLACE FUNCTION public.is_user_banned(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user exists in the banned_users table and is not expired
  RETURN EXISTS (
    SELECT 1 
    FROM public.banned_users 
    WHERE banned_users.user_id = $1
    AND (
      is_permanent = true 
      OR 
      expires_at > now()
    )
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_user_banned TO authenticated;