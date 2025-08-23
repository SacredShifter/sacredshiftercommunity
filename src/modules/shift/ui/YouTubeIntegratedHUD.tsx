import React from 'react';
import { useShiftStore } from '../state/useShiftStore';
import { useYouTubeIntegration } from '../hooks/useYouTubeIntegration';
import { YouTubePlayer } from '@/components/media/YouTubePlayer';
import { EnhancedHUD } from './EnhancedHUD';
import { Card, CardContent } from '@/components/ui/card';

export const YouTubeIntegratedHUD: React.FC = () => {
  const { playerRef, handlePlayerReady, handleStateChange } = useYouTubeIntegration();

  return (
    <>
      <EnhancedHUD />
      
      {/* YouTube Player */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-2">
            <YouTubePlayer
              ref={playerRef}
              width={320}
              height={180}
              onReady={handlePlayerReady}
              onStateChange={handleStateChange}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};