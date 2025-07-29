-- Create user video metadata table
CREATE TABLE user_video_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_id TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  is_watch_later BOOLEAN DEFAULT false,
  watched_duration INTEGER DEFAULT 0,
  last_watched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Create video tags table
CREATE TABLE video_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(video_id, tag)
);

-- Enable RLS
ALTER TABLE user_video_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_video_metadata
CREATE POLICY "Users can view their own video metadata"
ON user_video_metadata FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video metadata"
ON user_video_metadata FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own video metadata"
ON user_video_metadata FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video metadata"
ON user_video_metadata FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for video_tags
CREATE POLICY "Anyone can view video tags"
ON video_tags FOR SELECT
USING (true);

CREATE POLICY "Service role can manage video tags"
ON video_tags FOR ALL
USING (auth.role() = 'service_role');

-- Create indexes
CREATE INDEX idx_user_video_metadata_user_id ON user_video_metadata(user_id);
CREATE INDEX idx_user_video_metadata_video_id ON user_video_metadata(video_id);
CREATE INDEX idx_video_tags_video_id ON video_tags(video_id);
CREATE INDEX idx_video_tags_tag ON video_tags(tag);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_video_metadata_updated_at
BEFORE UPDATE ON user_video_metadata
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();