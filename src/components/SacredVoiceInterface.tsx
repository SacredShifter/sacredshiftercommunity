import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Heart,
  Waves,
  Zap,
  Eye,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSacredVoiceEngine } from '@/hooks/useSacredVoiceEngine';

interface BiometricState {
  heartRate: number;
  breathing: number;
  stress: number;
  focus: number;
  coherence: number;
}

interface SacredVoiceInterfaceProps {
  biometricState?: BiometricState;
  consciousnessState?: string;
  disabled?: boolean;
  className?: string;
}

export const SacredVoiceInterface: React.FC<SacredVoiceInterfaceProps> = ({
  biometricState = {
    heartRate: 72,
    breathing: 0.5,
    stress: 0.3,
    focus: 0.7,
    coherence: 0.8
  },
  consciousnessState = 'grounded',
  disabled = false,
  className = ''
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [sacredMode, setSacredMode] = useState<'healing' | 'meditation' | 'awakening' | 'love'>('healing');
  
  const {
    isGenerating,
    isPlaying,
    synthesizeSacredVoice,
    stopSacredVoice,
    analyzeSacredContent
  } = useSacredVoiceEngine();

  // Handle text selection for voice synthesis
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    }
  }, []);

  // Play sacred voice with current consciousness state
  const playSacredVoice = useCallback(async (text?: string) => {
    const textToSpeak = text || selectedText;
    if (!textToSpeak) return;

    const sacredConfig = analyzeSacredContent(textToSpeak);
    
    // Override with current biometric state and sacred mode
    const enhancedConfig = {
      ...sacredConfig,
      biometricState,
      consciousnessState,
      sacredFrequency: getSacredFrequency(sacredMode),
      harmonics: true,
      binauralBeats: sacredMode === 'meditation' || sacredMode === 'awakening'
    };

    await synthesizeSacredVoice(textToSpeak, enhancedConfig);
  }, [selectedText, biometricState, consciousnessState, sacredMode, analyzeSacredContent, synthesizeSacredVoice]);

  // Get sacred frequency based on mode
  const getSacredFrequency = (mode: typeof sacredMode): number => {
    switch (mode) {
      case 'healing': return 528; // DNA repair frequency
      case 'meditation': return 432; // Earth frequency
      case 'awakening': return 963; // Crown chakra frequency
      case 'love': return 528; // Love frequency
      default: return 432;
    }
  };

  // Get consciousness color based on biometric state
  const getConsciousnessColor = (): string => {
    if (biometricState.coherence > 0.8) return 'hsl(var(--primary))';
    if (biometricState.focus > 0.7) return 'hsl(var(--secondary))';
    if (biometricState.stress > 0.6) return 'hsl(var(--destructive))';
    return 'hsl(var(--muted))';
  };

  return (
    <Card className={`sacred-voice-interface ${className}`}>
      <CardContent className="p-4 space-y-4">
        {/* Sacred Mode Selection */}
        <div className="flex flex-wrap gap-2">
          {(['healing', 'meditation', 'awakening', 'love'] as const).map((mode) => (
            <Button
              key={mode}
              variant={sacredMode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSacredMode(mode)}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>

        {/* Biometric Consciousness Display */}
        <div className="grid grid-cols-5 gap-2">
          <motion.div 
            className="flex items-center space-x-1 text-xs"
            animate={{ 
              color: getConsciousnessColor(),
              scale: biometricState.heartRate > 80 ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.6, repeat: biometricState.heartRate > 80 ? Infinity : 0 }}
          >
            <Heart size={12} />
            <span>{Math.round(biometricState.heartRate)}</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-1 text-xs"
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2 / biometricState.breathing,
              repeat: Infinity 
            }}
          >
            <Waves size={12} />
            <span>{Math.round(biometricState.breathing * 20)}</span>
          </motion.div>
          
          <div className="flex items-center space-x-1 text-xs">
            <Zap size={12} />
            <span>{Math.round(biometricState.stress * 100)}</span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs">
            <Eye size={12} />
            <span>{Math.round(biometricState.focus * 100)}</span>
          </div>
          
          <motion.div 
            className="flex items-center space-x-1 text-xs"
            animate={{ 
              color: biometricState.coherence > 0.7 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'
            }}
          >
            <Target size={12} />
            <span>{Math.round(biometricState.coherence * 100)}</span>
          </motion.div>
        </div>

        {/* Voice Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => playSacredVoice()}
              disabled={disabled || !selectedText || isGenerating}
              className="flex items-center space-x-2"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>Sacred Voice</span>
            </Button>
            
            {isPlaying && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSacredVoice}
                className="flex items-center space-x-2"
              >
                <VolumeX size={16} />
                <span>Stop</span>
              </Button>
            )}
          </div>

          {/* Sacred Frequency Display */}
          <Badge variant="outline" className="text-xs">
            {getSacredFrequency(sacredMode)}Hz
          </Badge>
        </div>

        {/* Selected Text Display */}
        {selectedText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-2 bg-background/50 rounded border text-xs italic"
          >
            "{selectedText.substring(0, 100)}{selectedText.length > 100 ? '...' : ''}"
          </motion.div>
        )}

        {/* Sacred Voice Status */}
        <AnimatePresence>
          {(isGenerating || isPlaying) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center space-x-2 p-2 bg-primary/10 rounded"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Volume2 size={16} className="text-primary" />
              </motion.div>
              <span className="text-xs text-primary">
                {isGenerating ? 'Harmonizing consciousness...' : 'Sacred voice active'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instruction */}
        {!selectedText && (
          <p className="text-xs text-muted-foreground text-center">
            Select text to transform it with sacred voice consciousness
          </p>
        )}
      </CardContent>

      {/* Global text selection listener */}
      <div
        className="absolute inset-0 pointer-events-none"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      />
    </Card>
  );
};