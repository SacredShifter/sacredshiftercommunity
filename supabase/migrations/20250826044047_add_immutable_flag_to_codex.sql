ALTER TABLE public.codex_entries
ADD COLUMN is_immutable BOOLEAN DEFAULT false NOT NULL;

COMMENT ON COLUMN public.codex_entries.is_immutable IS 'If true, this entry cannot be altered by Aura.';
