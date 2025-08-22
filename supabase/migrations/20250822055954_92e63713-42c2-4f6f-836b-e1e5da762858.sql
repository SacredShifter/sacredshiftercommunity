-- Create quantum_messages table for 3D spatial messaging
CREATE TABLE public.quantum_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id TEXT NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  position NUMERIC[3] NOT NULL, -- [x, y, z] coordinates in 3D space
  consciousness_state TEXT NOT NULL CHECK (consciousness_state IN ('focused', 'expanded', 'meditative', 'creative', 'analytical')),
  resonance_frequency NUMERIC NOT NULL,
  emotional_tone TEXT NOT NULL CHECK (emotional_tone IN ('joy', 'calm', 'excitement', 'contemplation', 'curiosity')),
  sacred_geometry TEXT NOT NULL CHECK (sacred_geometry IN ('circle', 'triangle', 'hexagon', 'flower_of_life', 'merkaba')),
  entanglement_level NUMERIC NOT NULL CHECK (entanglement_level >= 0 AND entanglement_level <= 1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quantum_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for quantum messages
CREATE POLICY "Users can view quantum messages in their rooms" 
ON public.quantum_messages 
FOR SELECT 
USING (true); -- For now, allow viewing all quantum messages

CREATE POLICY "Users can create quantum messages" 
ON public.quantum_messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own quantum messages" 
ON public.quantum_messages 
FOR UPDATE 
USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own quantum messages" 
ON public.quantum_messages 
FOR DELETE 
USING (auth.uid() = sender_id);

-- Create index for room-based queries
CREATE INDEX idx_quantum_messages_room_id ON public.quantum_messages(room_id);
CREATE INDEX idx_quantum_messages_created_at ON public.quantum_messages(created_at);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_quantum_messages_updated_at
BEFORE UPDATE ON public.quantum_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();