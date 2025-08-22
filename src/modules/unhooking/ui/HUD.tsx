import React from 'react';
import { useUnhookingState } from '../context/UnhookingContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pause, Play } from 'lucide-react';

export const HUD: React.FC = () => {
  const { state, send, onExit } = useUnhookingState();
  const currentScene = state.context.currentScene;
  const isPaused = state.matches('paused');

  const getSceneTitle = () => {
    switch (currentScene) {
      case 'intro':
        return 'Unhooking from Fear Broadcasts';
      case 'fog':
        return 'Fog of Broadcasts';
      case 'recognition':
        return 'Recognition';
      case 'clearing':
        return 'Clearing Process';
      case 'calm':
        return 'Calm Field';
      default:
        return 'Phase 2 - Sovereignty Foundations';
    }
  };

  const handlePause = () => {
    if (isPaused) {
      send({ type: 'RESUME' });
    } else {
      send({ type: 'PAUSE' });
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit
          </Button>
          <div className="bg-black/50 px-4 py-2 rounded-lg">
            <h1 className="text-white font-medium">{getSceneTitle()}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePause}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Bottom instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-auto">
        <div className="bg-black/50 px-6 py-3 rounded-lg inline-block">
          <p className="text-white text-sm">
            {currentScene === 'fog' && 'Click on fear fragments to dismiss them as "not yours"'}
            {currentScene === 'recognition' && 'Notice which fears belonged to others, not you'}
            {currentScene === 'clearing' && 'Use breath to clear the remaining fog'}
            {currentScene === 'calm' && 'Rest in the clarity you\'ve created'}
          </p>
        </div>
      </div>
    </div>
  );
};