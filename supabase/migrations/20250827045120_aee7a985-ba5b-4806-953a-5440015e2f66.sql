-- Add missing entry_type column to user_bookmarks table
ALTER TABLE public.user_bookmarks 
ADD COLUMN entry_type text NOT NULL DEFAULT 'registry_entry';

-- Add index for better performance on entry_type queries
CREATE INDEX idx_user_bookmarks_entry_type ON public.user_bookmarks(entry_type);

-- Add unique constraint to prevent duplicate bookmarks
ALTER TABLE public.user_bookmarks 
ADD CONSTRAINT unique_user_bookmark 
UNIQUE (user_id, entry_id, entry_type);