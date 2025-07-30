-- Fix the populate_registry_author_info function to use correct column names
CREATE OR REPLACE FUNCTION public.populate_registry_author_info()
RETURNS TRIGGER AS $$
BEGIN
  -- Get author info from profiles table if it exists
  SELECT 
    COALESCE(display_name, full_name, 'Anonymous') as author_name,
    bio as author_bio
  INTO 
    NEW.author_name,
    NEW.author_bio
  FROM profiles 
  WHERE id = NEW.user_id;
  
  -- If no profile found, try to get from auth metadata
  IF NEW.author_name IS NULL THEN
    SELECT 
      COALESCE(
        raw_user_meta_data->>'display_name',
        raw_user_meta_data->>'full_name', 
        raw_user_meta_data->>'name',
        email,
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

-- Create the trigger on registry_of_resonance table
DROP TRIGGER IF EXISTS trigger_populate_registry_author_info ON registry_of_resonance;
CREATE TRIGGER trigger_populate_registry_author_info
  BEFORE INSERT OR UPDATE ON registry_of_resonance
  FOR EACH ROW
  EXECUTE FUNCTION populate_registry_author_info();

-- Create storage policies for registry images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'registry-images');
CREATE POLICY "User can upload their own images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'registry-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "User can update their own images" ON storage.objects FOR UPDATE USING (bucket_id = 'registry-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "User can delete their own images" ON storage.objects FOR DELETE USING (bucket_id = 'registry-images' AND auth.uid()::text = (storage.foldername(name))[1]);