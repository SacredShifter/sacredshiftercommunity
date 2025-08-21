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
    <div className="p-4 w-full max-w-md">
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

          {/* Frequency Wheel */}
          {showFrequencies && (
            <div className="relative w-full h-48 mt-4">
              <Label className="text-xs mb-2 block text-center">Sacred Frequencies</Label>
              <div className="relative w-full h-full flex items-center justify-center">
                {frequencies.map((freq, index) => {
                  const angle = (index * 360) / frequencies.length;
                  const radius = 70;
                  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                  
                  return (
                    <button
                      key={freq.hz}
                      onClick={() => selectFrequency(freq)}
                      className={`absolute w-12 h-12 rounded-full border-2 transition-all duration-300 flex flex-col items-center justify-center text-[8px] font-bold ${
                        selectedFrequency.hz === freq.hz
                          ? 'scale-125 shadow-lg'
                          : 'hover:scale-110'
                      }`}
                      style={{
                        left: `calc(50% + ${x}px - 24px)`,
                        top: `calc(50% + ${y}px - 24px)`,
                        borderColor: freq.color,
                        backgroundColor: selectedFrequency.hz === freq.hz ? `${freq.color}40` : `${freq.color}10`,
                        color: freq.color,
                        boxShadow: selectedFrequency.hz === freq.hz ? `0 0 15px ${freq.color}60` : `0 0 5px ${freq.color}20`
                      }}
                      title={`${freq.hz}Hz ${freq.name} - ${freq.purpose}`}
                    >
                      <span className="leading-none">{freq.hz}</span>
                      <span className="leading-none text-[6px] opacity-80">{freq.name.slice(0,3)}</span>
                    </button>
                  );
                })}
                
                {/* Center indicator */}
                <div 
                  className="absolute w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  style={{
                    left: 'calc(50% - 12px)',
                    top: 'calc(50% - 12px)',
                    borderColor: selectedFrequency.color,
                    backgroundColor: `${selectedFrequency.color}20`,
                    boxShadow: isPlaying ? `0 0 10px ${selectedFrequency.color}40` : 'none'
                  }}
                >
                  <Waves className="h-3 w-3" style={{ color: selectedFrequency.color }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};