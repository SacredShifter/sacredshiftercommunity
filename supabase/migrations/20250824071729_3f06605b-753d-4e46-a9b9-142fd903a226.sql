-- Enable RLS on liberation_sessions table
ALTER TABLE public.liberation_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for liberation_sessions
CREATE POLICY "Users can view their own liberation sessions" 
ON public.liberation_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own liberation sessions" 
ON public.liberation_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own liberation sessions" 
ON public.liberation_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liberation sessions" 
ON public.liberation_sessions 
FOR DELETE 
USING (auth.uid() = user_id);