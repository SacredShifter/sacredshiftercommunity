ALTER TABLE public.aura_jobs
ADD COLUMN remediation_attempts INTEGER DEFAULT 0 NOT NULL;

COMMENT ON COLUMN public.aura_jobs.remediation_attempts IS 'The number of times a remediation has been attempted for this job.';
