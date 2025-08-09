-- Create a view for direct messages with profile data
CREATE OR REPLACE VIEW public.direct_messages_with_profiles AS
SELECT
  dm.*,
  sender_profile.display_name as sender_display_name,
  sender_profile.avatar_url as sender_avatar_url,
  recipient_profile.display_name as recipient_display_name,
  recipient_profile.avatar_url as recipient_avatar_url
FROM public.direct_messages dm
LEFT JOIN public.profiles sender_profile ON dm.sender_id = sender_profile.user_id
LEFT JOIN public.profiles recipient_profile ON dm.recipient_id = recipient_profile.user_id;

-- Grant necessary permissions
GRANT SELECT ON public.direct_messages_with_profiles TO authenticated;