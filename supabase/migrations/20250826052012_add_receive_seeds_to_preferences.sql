ALTER TABLE public.user_preferences
ADD COLUMN receive_seeds BOOLEAN DEFAULT true NOT NULL;

COMMENT ON COLUMN public.user_preferences.receive_seeds IS 'Whether the user has consented to receive knowledge seeds from Aura.';
