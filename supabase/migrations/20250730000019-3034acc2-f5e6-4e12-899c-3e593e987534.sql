-- Add image support and enhanced metadata to registry_of_resonance table
ALTER TABLE registry_of_resonance 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_alt_text TEXT,
ADD COLUMN IF NOT EXISTS author_name TEXT,
ADD COLUMN IF NOT EXISTS author_bio TEXT,
ADD COLUMN IF NOT EXISTS publication_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER,
ADD COLUMN IF NOT EXISTS word_count INTEGER,
ADD COLUMN IF NOT EXISTS source_citation TEXT,
ADD COLUMN IF NOT EXISTS inspiration_source TEXT,
ADD COLUMN IF NOT EXISTS visibility_settings JSONB DEFAULT '{"public": false, "circle_shared": false, "featured": false}'::jsonb,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'markdown', 'rich_text')),
ADD COLUMN IF NOT EXISTS engagement_metrics JSONB DEFAULT '{"views": 0, "shares": 0, "bookmarks": 0}'::jsonb;

-- Create storage bucket for registry images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('registry-images', 'registry-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for registry images
CREATE POLICY IF NOT EXISTS "Registry images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'registry-images');

CREATE POLICY IF NOT EXISTS "Users can upload registry images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'registry-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can update their own registry images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'registry-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can delete their own registry images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'registry-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to automatically populate author information from user profile
CREATE OR REPLACE FUNCTION populate_registry_author_info()
RETURNS TRIGGER AS $$
BEGIN
  -- Get author info from profiles table if it exists
  SELECT 
    COALESCE(display_name, email, 'Anonymous') as author_name,
    bio as author_bio
  INTO 
    NEW.author_name,
    NEW.author_bio
  FROM profiles 
  WHERE user_id = NEW.user_id;
  
  -- If no profile found, try to get from auth metadata
  IF NEW.author_name IS NULL THEN
    SELECT 
      COALESCE(
        raw_user_meta_data->>'display_name',
        raw_user_meta_data->>'full_name', 
        raw_user_meta_data->>'name',
        'Anonymous'
      ) as author_name
    INTO NEW.author_name
    FROM auth.users 
    WHERE id = NEW.user_id;
  END IF;
  
  -- Calculate reading time (rough estimate: 200 words per minute)
  IF NEW.content IS NOT NULL THEN
    NEW.word_count := array_length(string_to_array(NEW.content, ' '), 1);
    NEW.reading_time_minutes := GREATEST(1, ROUND(NEW.word_count::numeric / 200));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-populating author info
DROP TRIGGER IF EXISTS registry_populate_author_info ON registry_of_resonance;
CREATE TRIGGER registry_populate_author_info
  BEFORE INSERT OR UPDATE ON registry_of_resonance
  FOR EACH ROW
  EXECUTE FUNCTION populate_registry_author_info();

-- Function to update engagement metrics
CREATE OR REPLACE FUNCTION increment_registry_engagement(
  entry_id UUID,
  metric_type TEXT
) RETURNS VOID AS $$
BEGIN
  UPDATE registry_of_resonance 
  SET engagement_metrics = jsonb_set(
    engagement_metrics,
    ARRAY[metric_type],
    (COALESCE((engagement_metrics->>metric_type)::integer, 0) + 1)::text::jsonb
  )
  WHERE id = entry_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get registry entries with author profiles
CREATE OR REPLACE VIEW registry_entries_with_profiles AS
SELECT 
  r.*,
  p.display_name as profile_display_name,
  p.avatar_url as profile_avatar_url,
  p.bio as profile_bio
FROM registry_of_resonance r
LEFT JOIN profiles p ON r.user_id = p.user_id;

-- Update the existing RLS policies to be more comprehensive
DROP POLICY IF EXISTS "Users can view entries based on access level" ON registry_of_resonance;
CREATE POLICY "Users can view entries based on access level" 
ON registry_of_resonance 
FOR SELECT 
USING (
  CASE 
    WHEN access_level = 'Public' THEN true
    WHEN access_level = 'Circle' THEN auth.uid() IS NOT NULL
    WHEN access_level = 'Private' THEN auth.uid() = user_id
    ELSE false
  END
);