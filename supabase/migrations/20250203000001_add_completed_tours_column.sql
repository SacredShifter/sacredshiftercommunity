-- Add completed_tours column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS completed_tours TEXT[] DEFAULT '{}';

-- Add comment to document the column
COMMENT ON COLUMN profiles.completed_tours IS 'Array of completed tour IDs for tracking user onboarding progress';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_completed_tours ON profiles USING GIN (completed_tours);
