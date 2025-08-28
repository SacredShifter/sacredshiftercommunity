import React from 'react';

interface SimpleMeditationVisualProps {
  type: string;
  isActive: boolean;
  phase?: string;
  progress?: number;
}

export default function SimpleMeditationVisual({ 
  type, 
  isActive, 
  phase = '', 
  progress = 0 
}: SimpleMeditationVisualProps) {
  const getVisualizationForType = () => {
    switch (type) {
      case 'breathing':
        return {
          icon: '🫁',
          color: phase === 'inhale' ? 'from-blue-400 to-cyan-400' : 
                 phase === 'exhale' ? 'from-pink-400 to-rose-400' : 
                 'from-purple-400 to-indigo-400',
          text: phase ? phase.toUpperCase() : 'BREATHE'
        };
      case 'loving-kindness':
        return {
          icon: '💕',
          color: 'from-pink-400 to-rose-400',
          text: 'LOVE & KINDNESS'
        };
      case 'chakra':
        return {
          icon: '🌈',
          color: 'from-violet-400 to-purple-400',
          text: 'CHAKRA ALIGNMENT'
        };
      case 'mindfulness':
        return {
          icon: '🧘',
          color: 'from-blue-400 to-teal-400',
          text: 'MINDFUL PRESENCE'
        };
      case 'body-scan':
        return {
          icon: '✨',
          color: 'from-teal-400 to-cyan-400',
          text: 'BODY SCAN'
        };
      default:
        return {
          icon: '🕉️',
          color: 'from-primary to-secondary',
          text: 'MEDITATION'
        };
    }
  };

  const visual = getVisualizationForType();
  const pulseClass = isActive ? 'animate-pulse' : '';
  const scaleClass = isActive ? 'scale-110' : 'scale-100';

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-background/50 to-muted/50 flex flex-col items-center justify-center">
      <div className={`transition-all duration-1000 ${scaleClass}`}>
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${visual.color} ${pulseClass} flex items-center justify-center mb-4 shadow-lg`}>
          <span className="text-6xl filter drop-shadow-lg">
            {visual.icon}
          </span>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {visual.text}
        </h3>
        
        {isActive && progress !== undefined && (
          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${visual.color} transition-all duration-300 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {isActive && (
          <p className="text-sm text-muted-foreground animate-fade-in">
            {type === 'breathing' && phase ? `${phase.charAt(0).toUpperCase() + phase.slice(1)} slowly...` :
             type === 'loving-kindness' ? 'Send love to all beings...' :
             type === 'chakra' ? 'Feel the energy flowing...' :
             type === 'mindfulness' ? 'Stay present in this moment...' :
             type === 'body-scan' ? 'Notice the sensations...' :
             'Focus on your practice...'}
          </p>
        )}
      </div>
    </div>
  );
}