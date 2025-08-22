import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Send } from 'lucide-react';

interface CircleVoiceMessageProps {
  onVoiceMessage: (audioBlob: Blob) => void;
}

export const CircleVoiceMessage = ({ onVoiceMessage }: CircleVoiceMessageProps) => {
  const [isRecording, setIsRecording] = useState(false);
  
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Mock audio blob for now
      const mockBlob = new Blob(['mock audio data'], { type: 'audio/wav' });
      onVoiceMessage(mockBlob);
    } else {
      // Start recording
      setIsRecording(true);
    }
  };
  
  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      size="sm"
      onClick={toggleRecording}
      className="shrink-0"
    >
      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
};