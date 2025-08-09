-- supabase/migrations/20250731140000_create_messaging_views.sql
CREATE OR REPLACE VIEW public.enhanced_conversations_with_profiles AS
SELECT
  c.id,
  c.participant_1_id,
  c.participant_2_id,
  c.last_message_at,
  c.created_at,
  c.last_message_id,
  p1.display_name AS participant_1_display_name,
  p1.avatar_url AS participant_1_avatar_url,
  p2.display_name AS participant_2_display_name,
  p2.avatar_url AS participant_2_avatar_url,
  dm.content AS last_message_content,
  dm.message_type AS last_message_type,
  dm.sender_id AS last_message_sender_id,
  (
    SELECT
      COUNT(*)
    FROM
      public.direct_messages msgs
    WHERE
      (
        (
          msgs.sender_id = c.participant_1_id
          AND msgs.recipient_id = c.participant_2_id
        )
        OR (
          msgs.sender_id = c.participant_2_id
          AND msgs.recipient_id = c.participant_1_id
        )
      )
      AND msgs.deleted_at IS NULL
  ) AS total_message_count,
  (
    SELECT
      COUNT(*)
    FROM
      public.direct_messages unread_msgs
    WHERE
      unread_msgs.recipient_id = auth.uid ()
      AND (
        (
          unread_msgs.sender_id = c.participant_1_id
          AND c.participant_2_id = auth.uid ()
        )
        OR (
          unread_msgs.sender_id = c.participant_2_id
          AND c.participant_1_id = auth.uid ()
        )
      )
      AND unread_msgs.is_read = FALSE
      AND unread_msgs.deleted_at IS NULL
  ) AS unread_count
FROM
  public.conversations c
  LEFT JOIN public.profiles p1 ON c.participant_1_id = p1.user_id
  LEFT JOIN public.profiles p2 ON c.participant_2_id = p2.user_id
  LEFT JOIN public.direct_messages dm ON c.last_message_id = dm.id;

GRANT SELECT ON public.enhanced_conversations_with_profiles TO authenticated;
