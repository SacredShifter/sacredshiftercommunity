import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Clock, Users, Play, Pause } from 'lucide-react';

interface CollectiveMeditationSessionProps {
  circleId?: string;
}

export const CollectiveMeditationSession = ({ circleId }: CollectiveMeditationSessionProps) => {
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const toggleSession = () => {
    setIsActive(!isActive);
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
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Session Progress</span>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              3 Active
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {isActive ? '5:30 remaining' : '10:00 duration'}
            </div>
            <span>Frequency: 432 Hz</span>
          </div>
          
          <Button 
            onClick={toggleSession}
            className="w-full"
            variant={isActive ? "outline" : "default"}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Leave Session
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Join Meditation
              </>
            )}
          </Button>
        </div>
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