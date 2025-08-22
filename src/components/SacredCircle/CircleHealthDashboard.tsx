import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, MessageCircle, Heart } from 'lucide-react';

interface CircleHealthDashboardProps {
  circleId?: string;
}

export const CircleHealthDashboard = ({ circleId }: CircleHealthDashboardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Circle Health</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Active Members</span>
          </div>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-muted-foreground">+2 this week</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Messages</span>
          </div>
          <p className="text-2xl font-bold">47</p>
          <p className="text-xs text-muted-foreground">Today</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-rose-500" />
            <span className="text-sm font-medium">Resonance</span>
          </div>
          <p className="text-2xl font-bold">8.4</p>
          <p className="text-xs text-muted-foreground">Average rating</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Energy Level</span>
          </div>
          <p className="text-2xl font-bold">High</p>
          <Badge variant="secondary" className="text-xs">Expanding</Badge>
        </Card>
      </div>
    </div>
  );
};