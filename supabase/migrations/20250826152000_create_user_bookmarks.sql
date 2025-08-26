-- Migration: Create user_bookmarks table
-- This table will store a record of which user has bookmarked which registry entry,
-- enabling a persistent, personal bookmarking feature.

-- Create the user_bookmarks table
CREATE TABLE public.user_bookmarks (
    entry_id UUID NOT NULL REFERENCES public.registry_of_resonance(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    PRIMARY KEY (entry_id, user_id)
);

-- Add comments for clarity
COMMENT ON TABLE public.user_bookmarks IS 'Tracks which users have bookmarked which registry entries.';
COMMENT ON COLUMN public.user_bookmarks.entry_id IS 'The foreign key to the bookmarked registry entry.';
COMMENT ON COLUMN public.user_bookmarks.user_id IS 'The foreign key to the user who created the bookmark.';

-- Enable Row Level Security
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
-- Users can view their own bookmarks.
CREATE POLICY "Users can view their own bookmarks"
ON public.user_bookmarks
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own bookmarks.
CREATE POLICY "Users can create their own bookmarks"
ON public.user_bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks.
CREATE POLICY "Users can delete their own bookmarks"
ON public.user_bookmarks
FOR DELETE
USING (auth.uid() = user_id);
