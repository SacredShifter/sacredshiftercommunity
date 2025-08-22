import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Star } from 'lucide-react';

export const CircleAstrologicalTiming = () => {
  return (
    <Card className="p-3 mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-medium">Waxing Gibbous</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Mercury Direct
          </Badge>
          <Badge variant="outline" className="text-xs">
            High Energy
          </Badge>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Optimal time for manifestation and sacred communication
      </p>
    </Card>
  );
};