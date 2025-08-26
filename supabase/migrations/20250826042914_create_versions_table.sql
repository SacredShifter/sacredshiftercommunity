CREATE TABLE public.versions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id uuid NOT NULL,
  table_name TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  provenance JSONB,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (record_id, table_name, version_number)
);

COMMENT ON TABLE public.versions IS 'Stores version history for all versioned records.';
COMMENT ON COLUMN public.versions.record_id IS 'The ID of the record being versioned.';
COMMENT ON COLUMN public.versions.table_name IS 'The name of the table the record belongs to.';
COMMENT ON COLUMN public.versions.version_number IS 'The version number for the record, starting at 1.';
COMMENT ON COLUMN public.versions.data IS 'A JSONB snapshot of the record at this version.';
COMMENT ON COLUMN public.versions.provenance IS 'Provenance information, e.g., the Aura job ID that created this version.';

-- Add RLS to the new table
ALTER TABLE public.versions ENABLE ROW LEVEL SECURITY;

-- Admins can do anything
CREATE POLICY "versions_admin_all" ON public.versions
FOR ALL
USING (user_has_role(auth.uid(), 'admin'));

-- Users can view their own record versions (or public records)
CREATE POLICY "versions_user_select" ON public.versions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.codex_entries
    WHERE codex_entries.id = versions.record_id AND versions.table_name = 'codex_entries'
    AND (
      codex_entries.visibility = 'public' OR
      codex_entries.created_by = auth.uid()
    )
  )
  -- Add other tables here as they become versioned
);
