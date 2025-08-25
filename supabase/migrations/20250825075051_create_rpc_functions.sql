-- Function to get unread direct message counts for the current user, grouped by sender
create or replace function public.get_unread_dm_counts()
returns table (
  sender_id uuid,
  unread_count bigint
)
as $$
begin
  return query
  select
    dm.sender_id,
    count(*)::bigint as unread_count
  from
    public.direct_messages as dm
  where
    dm.recipient_id = auth.uid() and not dm.is_read
  group by
    dm.sender_id;
end;
$$ language plpgsql stable;

-- Function to mark all messages in a DM conversation as read for the current user
create or replace function public.mark_dm_conversation_as_read(p_sender_id uuid)
returns void
as $$
begin
  update public.direct_messages
  set is_read = true
  where
    recipient_id = auth.uid() and sender_id = p_sender_id and not is_read;
end;
$$ language plpgsql volatile;
