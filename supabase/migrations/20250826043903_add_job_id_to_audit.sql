ALTER TABLE public.aura_audit
ADD COLUMN job_id uuid REFERENCES public.aura_jobs(id);

COMMENT ON COLUMN public.aura_audit.job_id IS 'The ID of the job that performed the audited action.';
