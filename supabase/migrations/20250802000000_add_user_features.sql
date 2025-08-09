-- Create user_features table to manage feature flags and user-specific settings
CREATE TABLE public.user_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  feature_name TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate features per user
ALTER TABLE public.user_features ADD CONSTRAINT user_features_user_id_feature_name_key UNIQUE (user_id, feature_name);

-- Create index for faster lookups
CREATE INDEX idx_user_features_user_id ON public.user_features(user_id);
CREATE INDEX idx_user_features_feature_name ON public.user_features(feature_name);

-- Enable Row Level Security
ALTER TABLE public.user_features ENABLE ROW LEVEL SECURITY;

-- Create policies for feature access
CREATE POLICY "Users can view their own features" 
ON public.user_features 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all features" 
ON public.user_features 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create function to update timestamps
CREATE TRIGGER update_user_features_updated_at
BEFORE UPDATE ON public.user_features
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();