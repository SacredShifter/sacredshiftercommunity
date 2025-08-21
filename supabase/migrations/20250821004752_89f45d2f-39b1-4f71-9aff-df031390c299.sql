-- Update the user_notifications table to allow service role to insert notifications
-- This is needed for admin broadcast functionality

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "System can create notifications" ON user_notifications;

-- Create a new policy that allows service role to insert notifications
CREATE POLICY "Service role can manage notifications" 
ON user_notifications 
FOR ALL 
USING (
  -- Service role can do anything
  auth.role() = 'service_role'
  OR 
  -- Users can only access their own notifications
  auth.uid() = user_id
)
WITH CHECK (
  -- Service role can insert any notification
  auth.role() = 'service_role'
  OR 
  -- Users can only create notifications for themselves
  auth.uid() = user_id
);