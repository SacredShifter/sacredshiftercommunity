import React from 'react';
import { useShiftStore } from '../state/useShiftStore';
import { onChapterJump } from '../events';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  Square,
  SkipForward,
  SkipBack 
} from 'lucide-react';

export const EnhancedHUD: React.FC = () => {
  const { 
    activeNode, 
    playbackMode, 
    setPlaybackMode, 
    volume, 
    setVolume,
    currentChapter,
    setCurrentChapter 
  } = useShiftStore();

  const handlePlayPause = () => {
    if (playbackMode === 'paused') {
      setPlaybackMode(activeNode ? 'chapter' : 'all');
    } else {
      setPlaybackMode('paused');
    }
  };

  const handlePlayAll = () => {
    setPlaybackMode('all');
    setCurrentChapter('all');
    onChapterJump(null);
  };

  const chapterButtons = [
    { key: 'cube', label: 'Cube', number: '1' },
    { key: 'circle', label: 'Circle', number: '2' },
    { key: 'witness', label: 'Witness', number: '3' },
    { key: 'eros', label: 'Eros', number: '4' },
    { key: 'butterfly', label: 'Butterfly', number: '5' },
    { key: 'justice', label: 'Justice', number: '6' },
  ];

  return (
    <div className="absolute top-4 left-4 space-y-4 z-10">
      {/* Main Controls */}
      <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              size="sm" 
              variant={playbackMode !== 'paused' ? 'default' : 'outline'}
              onClick={handlePlayPause}
              aria-label="Play/Pause"
            >
              {playbackMode !== 'paused' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={handlePlayAll}
            >
              <Square className="h-4 w-4 mr-2" />
              All
            </Button>
            
            <div className="flex items-center gap-2 ml-4">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume * 100]}
                onValueChange={(value) => setVolume(value[0] / 100)}
                max={100}
                step={1}
                className="w-20"
              />
            </div>
          </div>

          {/* Current Status */}
          <div className="text-xs text-muted-foreground">
            Mode: {playbackMode} | Active: {activeNode || 'none'}
            {currentChapter && ` | Chapter: ${currentChapter}`}
          </div>
        </CardContent>
      </Card>

      {/* Chapter Navigation */}
      <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4">
          <div className="text-sm font-medium mb-3 text-foreground">Chapters</div>
          <div className="grid grid-cols-2 gap-2">
            {chapterButtons.map((chapter) => (
              <Button
                key={chapter.key}
                size="sm"
                variant={activeNode === chapter.key ? 'default' : 'outline'}
                onClick={() => {
                  useShiftStore.getState().setActiveNode(chapter.key as any);
                  onChapterJump(chapter.key as any);
                }}
                className="text-xs justify-start"
              >
                <span className="mr-2 font-mono">{chapter.number}</span>
                {chapter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4">
          <div className="text-sm font-medium mb-3 text-foreground">Controls</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div>• Hover: Cursor change + outline</div>
            <div>• Click: Select node + jump chapter</div>
            <div>• Keys 1-6: Jump to chapters</div>
            <div>• Mouse: Orbit camera</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};