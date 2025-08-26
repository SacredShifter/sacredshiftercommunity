CREATE TABLE public.circle_invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  circle_id uuid NOT NULL REFERENCES public.circle_groups(id) ON DELETE CASCADE,
  inviter_id uuid REFERENCES public.users(id) ON DELETE SET NULL, -- Can be null if it's a request to join
  invitee_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (circle_id, invitee_id) -- A user can only have one pending invitation/request per circle
);

COMMENT ON TABLE public.circle_invitations IS 'Stores invitations and requests to join private circles.';
COMMENT ON COLUMN public.circle_invitations.inviter_id IS 'The user who sent the invitation. Null if it is a request to join.';
COMMENT ON COLUMN public.circle_invitations.invitee_id IS 'The user who was invited or is requesting to join.';

-- Add RLS
ALTER TABLE public.circle_invitations ENABLE ROW LEVEL SECURITY;

-- Users can see their own invitations/requests
CREATE POLICY "invitations_user_select" ON public.circle_invitations
FOR SELECT
USING (auth.uid() = invitee_id OR auth.uid() = inviter_id);

-- Circle admins can see all invitations/requests for their circles
CREATE POLICY "invitations_admin_select" ON public.circle_invitations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.circle_group_members
    WHERE circle_group_members.group_id = circle_invitations.circle_id
    AND circle_group_members.user_id = auth.uid()
    AND circle_group_members.role = 'admin'
  )
);

-- Users can create requests to join (inviter is null)
CREATE POLICY "invitations_user_insert_request" ON public.circle_invitations
FOR INSERT
WITH CHECK (auth.uid() = invitee_id AND inviter_id IS NULL);

-- Circle admins can create invitations
CREATE POLICY "invitations_admin_insert_invite" ON public.circle_invitations
FOR INSERT
WITH CHECK (
  auth.uid() = inviter_id AND
  EXISTS (
    SELECT 1 FROM public.circle_group_members
    WHERE circle_group_members.group_id = circle_invitations.circle_id
    AND circle_group_members.user_id = auth.uid()
    AND circle_group_members.role = 'admin'
  )
);

-- Users can update their own invitations to accept/reject
CREATE POLICY "invitations_user_update" ON public.circle_invitations
FOR UPDATE
USING (auth.uid() = invitee_id);

-- Circle admins can update invitations to accept/reject requests
CREATE POLICY "invitations_admin_update" ON public.circle_invitations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.circle_group_members
    WHERE circle_group_members.group_id = circle_invitations.circle_id
    AND circle_group_members.user_id = auth.uid()
    AND circle_group_members.role = 'admin'
  )
);
