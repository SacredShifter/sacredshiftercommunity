-- Ensure profiles table has the correct structure for user search
-- Check if the table exists and has the right columns

-- Add display_name column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add avatar_url column if it doesn't exist  
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Ensure we have an index on display_name for efficient searching
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles (display_name);

-- Update any null display_names with a default value
UPDATE profiles 
SET display_name = 'Sacred Seeker' 
WHERE display_name IS NULL OR display_name = '';

-- Add a comment to document the table structure
COMMENT ON TABLE profiles IS 'User profile information for Sacred Shifter Community';
COMMENT ON COLUMN profiles.display_name IS 'User display name for the community';
COMMENT ON COLUMN profiles.avatar_url IS 'URL to user avatar image';
