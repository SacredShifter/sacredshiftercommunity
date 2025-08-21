import React, { useState } from 'react';
import { Volume2, VolumeX, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useFrequencyTool } from '@/hooks/useFrequencyTool';

export const ToolbarFrequencyInterface = () => {
  const {
    isPlaying,
    selectedFrequency,
    frequencies,
    toggleSacredSound,
    selectFrequency
  } = useFrequencyTool();

  const [showFrequencies, setShowFrequencies] = useState(false);

  return (
    <div className="p-4 w-full max-w-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Sacred Frequencies
          </h3>
          <p className="text-xs text-muted-foreground">
            {isPlaying ? `Playing ${selectedFrequency.hz}Hz ${selectedFrequency.name}` : 'Activate healing tones'}
          </p>
        </div>

        {/* Current Frequency Display */}
        <div className="text-center">
          <div 
            className="inline-block px-4 py-3 rounded-lg border"
            style={{ 
              borderColor: selectedFrequency.color,
              backgroundColor: `${selectedFrequency.color}20`,
              boxShadow: isPlaying ? `0 0 20px ${selectedFrequency.color}40` : 'none'
            }}
          >
            <div className="text-2xl font-bold" style={{ color: selectedFrequency.color }}>
              {selectedFrequency.hz}Hz
            </div>
            <div className="text-sm font-medium">{selectedFrequency.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{selectedFrequency.purpose}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {/* Play/Stop Button */}
          <Button
            onClick={toggleSacredSound}
            className={`w-full h-10 ${
              isPlaying
                ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-300'
                : 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/50 text-purple-300'
            }`}
            variant="outline"
          >
            {isPlaying ? (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                Stop Frequency
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Play Frequency
              </>
            )}
          </Button>

          {/* Frequency Selection Toggle */}
          <Button
            onClick={() => setShowFrequencies(!showFrequencies)}
            variant="outline"
            className="w-full h-8 bg-background/50 hover:bg-background/70"
          >
            <Waves className="h-3 w-3 mr-2" />
            {showFrequencies ? 'Hide' : 'Choose'} Frequencies
          </Button>

          {/* Frequency List */}
          {showFrequencies && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <Label className="text-xs">Sacred Frequencies</Label>
              <div className="grid gap-1">
                {frequencies.map((freq) => (
                  <button
                    key={freq.hz}
                    onClick={() => selectFrequency(freq)}
                    className={`p-2 rounded text-left text-xs transition-all duration-200 border ${
                      selectedFrequency.hz === freq.hz
                        ? 'border-primary bg-primary/20'
                        : 'border-border bg-background/50 hover:bg-background/70'
                    }`}
                    style={{
                      borderColor: selectedFrequency.hz === freq.hz ? freq.color : undefined,
                      backgroundColor: selectedFrequency.hz === freq.hz ? `${freq.color}20` : undefined
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium" style={{ color: freq.color }}>
                        {freq.hz}Hz {freq.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{freq.chakra}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{freq.purpose}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};