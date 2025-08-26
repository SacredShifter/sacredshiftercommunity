ALTER TABLE public.versions
ADD COLUMN is_stable BOOLEAN DEFAULT true NOT NULL;

COMMENT ON COLUMN public.versions.is_stable IS 'Whether this version is considered stable. Can be set to false upon rollback or by community feedback.';
