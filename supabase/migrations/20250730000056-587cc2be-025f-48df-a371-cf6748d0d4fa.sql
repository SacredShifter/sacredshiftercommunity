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