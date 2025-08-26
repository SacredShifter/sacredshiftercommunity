-- Migration: Collective Codex Enhancements
-- Step 1: Add columns to registry_of_resonance for quick abstract and resonance growth tracking.
-- Step 2: Create reflection_notes table for private, user-specific notes on entries.

-- Add new columns to the existing registry_of_resonance table
ALTER TABLE public.registry_of_resonance
ADD COLUMN IF NOT EXISTS quick_abstract TEXT,
ADD COLUMN IF NOT EXISTS resonance_growth_data JSONB;

-- Create the reflection_notes table
CREATE TABLE public.reflection_notes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    entry_id UUID NOT NULL REFERENCES public.registry_of_resonance(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add comments to the new table and columns for clarity
COMMENT ON TABLE public.reflection_notes IS 'Private notes made by users on a registry entry. Only visible to the user who created them.';
COMMENT ON COLUMN public.reflection_notes.entry_id IS 'The registry entry the note is associated with.';
COMMENT ON COLUMN public.reflection_notes.user_id IS 'The user who wrote the note.';
COMMENT ON COLUMN public.reflection_notes.content IS 'The content of the private note.';

-- Enable Row Level Security on the new table
ALTER TABLE public.reflection_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reflection_notes to ensure privacy
CREATE POLICY "Users can view their own reflection notes"
ON public.reflection_notes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflection notes"
ON public.reflection_notes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflection notes"
ON public.reflection_notes
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflection notes"
ON public.reflection_notes
FOR DELETE
USING (auth.uid() = user_id);

-- Create a trigger to automatically update the updated_at timestamp on change
-- This assumes the generic `update_updated_at_column` function from a previous migration exists.
CREATE TRIGGER handle_updated_at
BEFORE UPDATE ON public.reflection_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
