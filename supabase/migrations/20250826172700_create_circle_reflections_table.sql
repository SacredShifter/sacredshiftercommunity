-- Create the circle_reflections table
CREATE TABLE IF NOT EXISTS public.circle_reflections (
    id uuid primary key default gen_random_uuid(),
    circle_id uuid references public.sacred_circles(id) on delete cascade not null,
    date date not null,
    topics text[],
    tone text,
    reflection_text text not null,
    created_at timestamp with time zone default now(),
    unique (circle_id, date)
);

-- Add comments to the table and columns
COMMENT ON TABLE public.circle_reflections IS 'Stores daily AI-generated reflections for each Sacred Circle.';
COMMENT ON COLUMN public.circle_reflections.circle_id IS 'The circle this reflection belongs to.';
COMMENT ON COLUMN public.circle_reflections.date IS 'The date the reflection is for, to ensure one per day.';
COMMENT ON COLUMN public.circle_reflections.topics IS 'Dominant topics identified in the circle''s posts.';
COMMENT ON COLUMN public.circle_reflections.tone IS 'The overall community tone for the day.';
COMMENT ON COLUMN public.circle_reflections.reflection_text IS 'The AI-generated reflection message.';

-- Enable RLS on the new table
ALTER TABLE public.circle_reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for circle_reflections
-- 1. Allow public read access for all users.
CREATE POLICY "Users can view circle reflections"
ON public.circle_reflections
FOR SELECT
USING (true);

-- 2. Allow service_role to insert, update, and delete.
CREATE POLICY "Service role can manage reflections"
ON public.circle_reflections
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
