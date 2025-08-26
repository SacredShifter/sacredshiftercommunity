CREATE TABLE public.tags (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  created_by uuid REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.tags IS 'A central repository for all tags used in the system.';

-- Add RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read tags
CREATE POLICY "tags_select" ON public.tags
FOR SELECT
USING (true);

-- Admins can manage tags
CREATE POLICY "tags_admin_all" ON public.tags
FOR ALL
USING (user_has_role(auth.uid(), 'admin'));
