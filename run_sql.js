const fs = require('fs');
const { execSync } = require('child_process');

// Create the SQL content directly
const sql = `
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
`;

// Write to a temporary file
fs.writeFileSync('temp_sql.sql', sql);

// Execute the SQL using supabase CLI
try {
  console.log('Running SQL script...');
  execSync('npx supabase sql --file temp_sql.sql', { stdio: 'inherit' });
  console.log('SQL script executed successfully');
} catch (error) {
  console.error('Error executing SQL script:', error);
} finally {
  // Clean up
  fs.unlinkSync('temp_sql.sql');
}