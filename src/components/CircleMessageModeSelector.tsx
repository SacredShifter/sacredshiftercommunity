import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Brain, Send } from 'lucide-react';

type MessageMode = 'sacred' | 'quantum' | 'classic';

interface CircleMessageModeSelectorProps {
  mode: MessageMode;
  onModeChange: (mode: MessageMode) => void;
  className?: string;
}

export const CircleMessageModeSelector: React.FC<CircleMessageModeSelectorProps> = ({
  mode,
  onModeChange,
  className
}) => {
  const modes = [
    {
      id: 'sacred' as MessageMode,
      label: 'Sacred',
      icon: Heart,
      description: 'Heart-centered conscious communication',
      color: 'text-rose-500'
    },
    {
      id: 'quantum' as MessageMode,
      label: 'Quantum',
      icon: Brain,
      description: 'Multi-dimensional awareness messaging',
      color: 'text-purple-500'
    },
    {
      id: 'classic' as MessageMode,
      label: 'Classic',
      icon: Send,
      description: 'Traditional messaging interface',
      color: 'text-blue-500'
    }
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="text-xs font-medium text-muted-foreground px-1 flex items-center gap-2">
        Communication Mode
        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
          {modes.find(m => m.id === mode)?.label}
        </Badge>
      </div>
      <div className="flex flex-col gap-1">
        {modes.map((modeOption) => {
          const IconComponent = modeOption.icon;
          const isActive = mode === modeOption.id;
          
          return (
            <Button
              key={modeOption.id}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onModeChange(modeOption.id)}
              className="justify-start text-xs h-8 group"
              title={modeOption.description}
            >
              <IconComponent className={`h-3 w-3 mr-2 ${isActive ? '' : modeOption.color}`} />
              <span className="flex-1 text-left">{modeOption.label}</span>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};