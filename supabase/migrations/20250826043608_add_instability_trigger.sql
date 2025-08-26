-- Create a function to be called by the trigger
CREATE OR REPLACE FUNCTION handle_new_community_feedback()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Supabase Edge Function
  PERFORM net.http_post(
    url:='https://mikltjgbvxrxndtszorb.supabase.co/functions/v1/check-instability-and-rollback',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('request.jwt.claims', true)::jsonb->>'raw_user_meta_data' || '"}'::jsonb,
    body:=json_build_object('record', NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_new_community_feedback
AFTER INSERT ON public.community_feedback
FOR EACH ROW
EXECUTE FUNCTION handle_new_community_feedback();
