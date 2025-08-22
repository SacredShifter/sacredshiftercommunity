import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useBreathingTool } from '@/hooks/useBreathingTool';

export const ToolbarBreathingInterface = () => {
  const {
    isActive,
    currentPreset,
    currentPhase,
    cycleCount,
    timeRemaining,
    soundEnabled,
    presets,
    startBreathing,
    stopBreathing,
    setCurrentPreset,
    setSoundEnabled,
    getPhaseLabel,
    getPhaseDuration
  } = useBreathingTool();

  return (
    <div className="p-4 w-full max-w-sm">
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Breath of Source
          </h3>
          <p className="text-xs text-muted-foreground">
            {isActive ? `${getPhaseLabel(currentPhase)} • Cycle ${cycleCount + 1}` : 'Embrace the rhythm of sovereignty'}
          </p>
        </div>

        {/* Breathing Orb */}
        <div className="flex justify-center">
          <motion.div
            animate={isActive ? {
              scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 1.4 : 0.8,
              opacity: currentPhase === 'inhale' || currentPhase === 'hold1' ? 0.9 : 0.6
            } : { scale: 1, opacity: 0.8 }}
            transition={{ 
              duration: isActive ? currentPreset[currentPhase] : 2, 
              ease: "easeInOut",
              repeat: isActive ? 0 : Infinity,
              repeatType: "reverse"
            }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400/30 via-teal-400/30 to-cyan-400/30 backdrop-blur-sm border border-emerald-300/30 flex items-center justify-center"
          >
            {isActive && (
              <div className="text-xs font-medium text-emerald-300">
                {Math.ceil(timeRemaining / 1000)}s
              </div>
            )}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {/* Preset Selection */}
          <div className="space-y-2">
            <Label className="text-xs">Breathing Pattern</Label>
            <Select 
              value={currentPreset.id} 
              onValueChange={(value) => {
                const preset = presets.find(p => p.id === value);
                if (preset) setCurrentPreset(preset);
              }}
              disabled={isActive}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {presets.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Sound Guide</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
              {soundEnabled ? (
                <Volume2 className="h-3 w-3 text-emerald-400" />
              ) : (
                <VolumeX className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Start/Stop Button */}
          <Button
            onClick={isActive ? stopBreathing : startBreathing}
            className={`w-full h-10 ${
              isActive 
                ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-300'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/50 text-emerald-300'
            }`}
            variant="outline"
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Session
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Begin Breathing
              </>
            )}
          </Button>
        </div>

                        {/* Session Stats */}
                        {isActive && (
                          <div className="text-center text-xs text-muted-foreground space-y-1">
                            <div>Pattern: {currentPreset.inhale}s in • {currentPreset.hold1}s hold • {currentPreset.exhale}s out • {currentPreset.hold2}s hold</div>
                            <div className="text-emerald-300/80 italic">The Rhythm - not to be feared, but embraced</div>
                          </div>
                        )}
      </div>
    </div>
  );
};