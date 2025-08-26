ALTER TABLE public.aura_audit
ADD COLUMN table_name TEXT;

COMMENT ON COLUMN public.aura_audit.table_name IS 'The name of the table that the audited action targeted.';
