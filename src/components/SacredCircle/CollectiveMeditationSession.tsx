import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Clock, Users, Play, Pause, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface CollectiveMeditationSessionProps {
  circleId?: string;
}

export const CollectiveMeditationSession = ({ circleId }: CollectiveMeditationSessionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [participants, setParticipants] = useState(3);
  const [sessionType, setSessionType] = useState('breathing');
  const [duration, setDuration] = useState(15);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          setProgress(((duration * 60 - newTime) / (duration * 60)) * 100);
          
          if (newTime <= 0) {
            setIsActive(false);
            toast({
              title: "Collective Meditation Complete! 🧘",
              description: "The group session has ended. Well done!",
            });
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeRemaining, duration, toast]);
  
  const toggleSession = () => {
    if (!isActive) {
      setTimeRemaining(duration * 60);
      setProgress(0);
      setIsActive(true);
      toast({
        title: "Collective Meditation Started",
        description: `${participants} members are now meditating together`,
      });
    } else {
      setIsActive(false);
      toast({
        title: "Meditation Paused",
        description: "The collective session has been paused",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Collective Meditation</h3>
      </div>
      
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Sacred Unity Session</h4>
          <p className="text-sm text-muted-foreground">
            Join your circle in synchronized meditation for collective consciousness expansion
          </p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {participants} participating
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {isActive ? formatTime(timeRemaining) : `${duration} min session`}
          </div>
        </div>
        
        <div className="mb-4">
          <Progress value={progress} className="h-3" />
        </div>

        <div className="flex gap-2 mb-4">
          <Button 
            onClick={toggleSession}
            className="flex-1"
            variant={isActive ? "outline" : "default"}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Session
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {progress > 0 ? 'Resume' : 'Start'} Session
              </>
            )}
          </Button>
        </div>

        <Link to="/meditation" className="block">
          <Button variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Full Meditation Module
          </Button>
        </Link>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h5 className="font-medium mb-2">Today's Sessions</h5>
          <p className="text-2xl font-bold text-primary">3</p>
          <p className="text-xs text-muted-foreground">+1 from yesterday</p>
        </Card>
        
        <Card className="p-4">
          <h5 className="font-medium mb-2">Total Participants</h5>
          <p className="text-2xl font-bold text-primary">12</p>
          <p className="text-xs text-muted-foreground">Active members</p>
        </Card>
      </div>
    </div>
  );
};