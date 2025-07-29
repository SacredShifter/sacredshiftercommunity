import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Video, PhoneCall, VideoIcon } from 'lucide-react';
import { toast } from 'sonner';

interface CallButtonsProps {
  userId: string;
  userName: string;
}

export const CallButtons: React.FC<CallButtonsProps> = ({ userId, userName }) => {
  const handleVoiceCall = () => {
    toast.info(`Initiating voice call with ${userName}...`, {
      description: 'Voice calling feature coming soon!'
    });
    
    // Future implementation: WebRTC voice calling
    console.log('Voice call initiated with user:', userId);
  };

  const handleVideoCall = () => {
    toast.info(`Initiating video call with ${userName}...`, {
      description: 'Video calling feature coming soon!'
    });
    
    // Future implementation: WebRTC video calling
    console.log('Video call initiated with user:', userId);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleVoiceCall}
        className="text-muted-foreground hover:text-green-500"
      >
        <Phone className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleVideoCall}
        className="text-muted-foreground hover:text-blue-500"
      >
        <Video className="h-4 w-4" />
      </Button>
    </>
  );
};