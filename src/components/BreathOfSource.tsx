import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, Settings, Play, Pause, RotateCcw, Volume2, VolumeX, X, Minimize2, Maximize2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BreathingPreset {
  id: string;
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  description: string;
}

const BREATHING_PRESETS: BreathingPreset[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: 'Equal timing for balance and focus'
  },
  {
    id: 'relaxation',
    name: '4-7-8 Relaxation',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    description: 'Deeply calming, reduces anxiety'
  },
  {
    id: 'coherence',
    name: 'Coherence Breathing',
    inhale: 5.5,
    hold1: 0,
    exhale: 5.5,
    hold2: 0,
    description: 'Heart-brain coherence, 5.5 seconds each'
  },
  {
    id: 'resonant',
    name: 'Resonant Breath',
    inhale: 6,
    hold1: 0,
    exhale: 6,
    hold2: 0,
    description: 'Natural resonant frequency'
  }
];

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const BreathOfSource: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<BreathingPreset>(BREATHING_PRESETS[0]);
  const [customPreset, setCustomPreset] = useState<BreathingPreset>({
    id: 'custom',
    name: 'Custom',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: 'Your personalized breathing pattern'
  });
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentToneRef = useRef<{ oscillator: OscillatorNode; gainNode: GainNode } | null>(null);

  const activePreset = currentPreset.id === 'custom' ? customPreset : currentPreset;

  // Initialize audio context
  const initializeAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Create breathing tones
  const playBreathingTone = (phase: BreathPhase) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = initializeAudio();
      
      // Stop any current tone
      if (currentToneRef.current) {
        currentToneRef.current.gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        currentToneRef.current.oscillator.stop(audioContext.currentTime + 0.1);
        currentToneRef.current = null;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set frequency based on phase
      let frequency: number;
      let duration = getPhaseDuration(phase) / 1000;
      
      switch (phase) {
        case 'inhale':
          frequency = 220; // A3 - rising tone
          break;
        case 'hold1':
          frequency = 294; // D4 - stable tone
          break;
        case 'exhale':
          frequency = 174; // F3 - falling tone
          break;
        case 'hold2':
          frequency = 196; // G3 - gentle pause
          break;
        default:
          frequency = 220;
      }
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Gentle volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.3);
      
      if (phase === 'inhale') {
        // Rising frequency for inhale
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.currentTime + duration);
      } else if (phase === 'exhale') {
        // Falling frequency for exhale
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, audioContext.currentTime + duration);
      }
      
      // Fade out at the end
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration - 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      currentToneRef.current = { oscillator, gainNode };
      
    } catch (error) {
      console.log('Audio playback not available:', error);
    }
  };

  // Cleanup audio
  const stopAudio = () => {
    if (currentToneRef.current) {
      try {
        currentToneRef.current.gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current!.currentTime + 0.1);
        currentToneRef.current.oscillator.stop(audioContextRef.current!.currentTime + 0.1);
      } catch (error) {
        // Oscillator might already be stopped
      }
      currentToneRef.current = null;
    }
  };

  // Phase progression logic
  const getNextPhase = (phase: BreathPhase): BreathPhase => {
    const phases: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    const currentIndex = phases.indexOf(phase);
    return phases[(currentIndex + 1) % phases.length];
  };

  const getPhaseDuration = (phase: BreathPhase): number => {
    switch (phase) {
      case 'inhale': return activePreset.inhale * 1000;
      case 'hold1': return activePreset.hold1 * 1000;
      case 'exhale': return activePreset.exhale * 1000;
      case 'hold2': return activePreset.hold2 * 1000;
      default: return 0;
    }
  };

  const getPhaseLabel = (phase: BreathPhase): string => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return '';
    }
  };

  // Start breathing session
  const startBreathing = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setCycleCount(0);
    sessionStartRef.current = Date.now();
    
    const startPhase = (phase: BreathPhase) => {
      setCurrentPhase(phase);
      const duration = getPhaseDuration(phase);
      
      // Skip phases with 0 duration
      if (duration === 0) {
        const nextPhase = getNextPhase(phase);
        setCurrentPhase(nextPhase);
        startPhase(nextPhase);
        return;
      }
      
      setTimeRemaining(duration);
      
      // Play breathing tone for current phase
      playBreathingTone(phase);
      
      // Countdown timer
      let remainingTime = duration;
      const countdownInterval = setInterval(() => {
        remainingTime -= 100;
        setTimeRemaining(remainingTime);
        
        if (remainingTime <= 0) {
          clearInterval(countdownInterval);
          const nextPhase = getNextPhase(phase);
          
          // Increment cycle count when completing exhale
          if (phase === 'exhale' || (phase === 'hold2' && activePreset.hold2 > 0)) {
            setCycleCount(prev => prev + 1);
          }
          
          startPhase(nextPhase);
        }
      }, 100);
      
      intervalRef.current = countdownInterval;
    };
    
    startPhase('inhale');
  };

  // Stop breathing session
  const stopBreathing = () => {
    setIsActive(false);
    stopAudio();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Calculate session duration and show completion message
    if (sessionStartRef.current) {
      const duration = Math.round((Date.now() - sessionStartRef.current) / 1000);
      setSessionDuration(duration);
      
      if (cycleCount > 0) {
        toast({
          title: "Breath Session Complete",
          description: `You completed ${cycleCount} breathing cycles in ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}. You are here. You are safe.`,
        });
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Breath Button - Fixed position */}
      {!isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 z-40"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-14 w-14 rounded-full bg-background/20 backdrop-blur-md border border-primary/30 hover:border-primary/50 transition-all duration-300 group shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)]"
            size="icon"
          >
            <motion.div
              animate={isActive ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] } : { scale: 1, opacity: 0.8 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
            />
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              viewBox="0 0 100 100" 
              className="w-full h-full relative z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Flower of Life Pattern */}
              <g className="opacity-80">
                {/* Central circle */}
                <motion.circle
                  cx="50" cy="50" r="12"
                  fill="none"
                  stroke="hsl(var(--truth))"
                  strokeWidth="1.5"
                  animate={isActive ? { 
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  } : { scale: 1, opacity: 0.8 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Surrounding circles forming flower of life */}
                {[0, 60, 120, 180, 240, 300].map((angle, index) => (
                  <motion.circle
                    key={angle}
                    cx={50 + 12 * Math.cos((angle * Math.PI) / 180)}
                    cy={50 + 12 * Math.sin((angle * Math.PI) / 180)}
                    r="12"
                    fill="none"
                    stroke="hsl(var(--alignment))"
                    strokeWidth="1"
                    animate={isActive ? {
                      scale: [1, 1.05, 1],
                      opacity: [0.6, 0.9, 0.6]
                    } : { scale: 1, opacity: 0.6 }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />
                ))}
                
                {/* Breath ripples */}
                {[1, 2, 3].map((ring) => (
                  <motion.circle
                    key={ring}
                    cx="50" cy="50"
                    r={15 + ring * 8}
                    fill="none"
                    stroke="hsl(var(--truth))"
                    strokeWidth="0.5"
                    strokeDasharray="2,4"
                    animate={isActive ? {
                      r: [15 + ring * 8, 25 + ring * 8, 15 + ring * 8],
                      opacity: [0.3, 0.6, 0.3]
                    } : { opacity: 0.2 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: ring * 0.5
                    }}
                  />
                ))}
              </g>
            </motion.svg>
            <div className="absolute -inset-1 bg-primary/10 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
          </Button>
        </motion.div>
      )}

      {/* Breath Interface */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Compact Mode */}
            {!isFullscreen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-4 left-4 z-50"
              >
                <Card className={cn(
                  "w-80 flex flex-col shadow-2xl bg-background/95 backdrop-blur-sm border-2 border-purple-300/30 transition-all duration-300",
                  isMinimized ? "h-16" : "h-96"
                )}>
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="text-xl"
                      >
                        🌬️
                      </motion.div>
                      <div>
                        <h3 className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          Breath of Source
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isActive ? `${getPhaseLabel(currentPhase)} • Cycle ${cycleCount + 1}` : 'Find your center'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="h-7 w-7 p-0 hover:bg-muted"
                      >
                        <Minimize2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsFullscreen(true)}
                        className="h-7 w-7 p-0 hover:bg-muted"
                      >
                        <Maximize2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-7 w-7 p-0 hover:bg-destructive/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {!isMinimized && (
                    <>
                      {/* Compact Breathing Area */}
                      <div className="flex-1 flex flex-col items-center justify-center p-4">
                        {/* Mini Breathing Orb */}
                        <div className="relative mb-4">
                          <motion.div
                            animate={isActive ? {
                              scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 1.3 : 0.9,
                              opacity: currentPhase === 'inhale' || currentPhase === 'hold1' ? 0.9 : 0.6
                            } : { scale: 1, opacity: 0.8 }}
                            transition={{ 
                              duration: isActive ? activePreset[currentPhase] : 2, 
                              ease: "easeInOut",
                              repeat: isActive ? 0 : Infinity,
                              repeatType: "reverse"
                            }}
                            className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400/30 via-blue-400/30 to-indigo-400/30 backdrop-blur-sm border border-purple-300/30"
                          />
                        </div>

                        {/* Phase Indicator */}
                        <motion.div
                          key={currentPhase}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center mb-3"
                        >
                          <h4 className="text-lg font-light bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            {isActive ? getPhaseLabel(currentPhase) : 'Ready to Begin'}
                          </h4>
                          {timeRemaining > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {Math.ceil(timeRemaining / 1000)}s
                            </p>
                          )}
                        </motion.div>

                        {/* Compact Controls */}
                        <div className="flex items-center gap-2">
                          {!isActive ? (
                            <Button
                              onClick={startBreathing}
                              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                              size="sm"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          ) : (
                            <Button
                              onClick={stopBreathing}
                              variant="outline"
                              size="sm"
                            >
                              <Pause className="h-3 w-3 mr-1" />
                              Stop
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                          >
                            {soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowCustomSettings(!showCustomSettings)}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </Card>

                {/* Settings Panel for compact mode */}
                <AnimatePresence>
                  {showCustomSettings && !isMinimized && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-2"
                    >
                      <Card className="w-80 bg-background/95 backdrop-blur-sm border-2 border-purple-300/30">
                        <CardContent className="p-4 space-y-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Breathing Pattern</Label>
                            <Select
                              value={currentPreset.id}
                              onValueChange={(value) => {
                                const preset = BREATHING_PRESETS.find(p => p.id === value);
                                if (preset) setCurrentPreset(preset);
                                else if (value === 'custom') setCurrentPreset(customPreset);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {BREATHING_PRESETS.map((preset) => (
                                  <SelectItem key={preset.id} value={preset.id}>
                                    {preset.name}
                                  </SelectItem>
                                ))}
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Sound Guidance</Label>
                            <Switch
                              checked={soundEnabled}
                              onCheckedChange={setSoundEnabled}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Fullscreen Mode */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
                
                {/* Fullscreen Header */}
                <div className="relative z-10 flex items-center justify-between p-4 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="text-2xl"
                    >
                      🌬️
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Breath of Source
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {isActive ? `${getPhaseLabel(currentPhase)} • Cycle ${cycleCount + 1}` : 'Find your center'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCustomSettings(!showCustomSettings)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFullscreen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col lg:flex-row h-[calc(100vh-80px)]">
                  {/* Main Breathing Area */}
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                    {/* Breathing Orb */}
                    <div className="relative mb-8">
                      <motion.div
                        animate={isActive ? {
                          scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 1.4 : 0.8,
                          opacity: currentPhase === 'inhale' || currentPhase === 'hold1' ? 0.9 : 0.6
                        } : { scale: 1, opacity: 0.8 }}
                        transition={{ 
                          duration: isActive ? activePreset[currentPhase] : 2, 
                          ease: "easeInOut",
                          repeat: isActive ? 0 : Infinity,
                          repeatType: "reverse"
                        }}
                        className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-purple-400/30 via-blue-400/30 to-indigo-400/30 backdrop-blur-sm border border-purple-300/30"
                      />
                      <motion.div
                        animate={isActive ? {
                          scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 1.4 : 0.8,
                          opacity: currentPhase === 'inhale' || currentPhase === 'hold1' ? 0.9 : 0.6
                        } : { scale: 1, opacity: 0.8 }}
                        transition={{ 
                          duration: isActive ? activePreset[currentPhase] : 2, 
                          ease: "easeInOut",
                          repeat: isActive ? 0 : Infinity,
                          repeatType: "reverse"
                        }}
                        className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-300/20 via-blue-300/20 to-indigo-300/20 backdrop-blur-sm"
                      />
                      <motion.div
                        animate={isActive ? {
                          scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 1.4 : 0.8,
                          opacity: currentPhase === 'inhale' || currentPhase === 'hold1' ? 0.9 : 0.6
                        } : { scale: 1, opacity: 0.8 }}
                        transition={{ 
                          duration: isActive ? activePreset[currentPhase] : 2, 
                          ease: "easeInOut",
                          repeat: isActive ? 0 : Infinity,
                          repeatType: "reverse"
                        }}
                        className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-200/10 via-blue-200/10 to-indigo-200/10 backdrop-blur-sm"
                      />
                      
                      {/* Sacred Geometry Pattern */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 opacity-20"
                      >
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                          <defs>
                            <linearGradient id="sacred-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="rgb(168, 85, 247)" />
                              <stop offset="50%" stopColor="rgb(59, 130, 246)" />
                              <stop offset="100%" stopColor="rgb(99, 102, 241)" />
                            </linearGradient>
                          </defs>
                          <circle cx="100" cy="100" r="80" fill="none" stroke="url(#sacred-gradient)" strokeWidth="1" />
                          <circle cx="100" cy="100" r="60" fill="none" stroke="url(#sacred-gradient)" strokeWidth="1" />
                          <circle cx="100" cy="100" r="40" fill="none" stroke="url(#sacred-gradient)" strokeWidth="1" />
                          <path d="M100,20 L173.2,60 L173.2,140 L100,180 L26.8,140 L26.8,60 Z" fill="none" stroke="url(#sacred-gradient)" strokeWidth="1" />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Phase Indicator */}
                    <motion.div
                      key={currentPhase}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mb-6"
                    >
                      <h3 className="text-2xl lg:text-3xl font-light bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        {isActive ? getPhaseLabel(currentPhase) : 'Ready to Begin'}
                      </h3>
                      {isActive && (
                        <p className="text-muted-foreground">
                          {Math.ceil(timeRemaining / 1000)}s remaining
                        </p>
                      )}
                    </motion.div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={isActive ? stopBreathing : startBreathing}
                        size="lg"
                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {isActive ? (
                          <>
                            <Pause className="mr-2 h-5 w-5" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-5 w-5" />
                            Begin
                          </>
                        )}
                      </Button>
                      
                      {isActive && (
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => {
                            stopBreathing();
                            setTimeout(startBreathing, 100);
                          }}
                          className="px-6 py-3 rounded-full"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reset
                        </Button>
                      )}
                    </div>

                    {/* Session Stats */}
                    {(cycleCount > 0 || sessionDuration > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 text-center text-sm text-muted-foreground"
                      >
                        {cycleCount > 0 && <p>Cycles completed: {cycleCount}</p>}
                        {sessionDuration > 0 && (
                          <p>Last session: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Settings Panel */}
                  <AnimatePresence>
                    {showCustomSettings && (
                      <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border/30 p-6 bg-background/50 backdrop-blur-sm"
                      >
                        <Card>
                          <CardContent className="p-6 space-y-6">
                            <div>
                              <Label className="text-sm font-medium mb-3 block">Breathing Pattern</Label>
                              <Select
                                value={currentPreset.id}
                                onValueChange={(value) => {
                                  const preset = BREATHING_PRESETS.find(p => p.id === value);
                                  if (preset) setCurrentPreset(preset);
                                  else if (value === 'custom') setCurrentPreset(customPreset);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {BREATHING_PRESETS.map((preset) => (
                                    <SelectItem key={preset.id} value={preset.id}>
                                      {preset.name}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="text-xs text-muted-foreground mt-1">
                                {activePreset.description}
                              </p>
                            </div>

                            {currentPreset.id === 'custom' && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs">Inhale (s)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={customPreset.inhale}
                                      onChange={(e) => setCustomPreset(prev => ({ ...prev, inhale: parseFloat(e.target.value) || 0 }))}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Hold (s)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={customPreset.hold1}
                                      onChange={(e) => setCustomPreset(prev => ({ ...prev, hold1: parseFloat(e.target.value) || 0 }))}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Exhale (s)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={customPreset.exhale}
                                      onChange={(e) => setCustomPreset(prev => ({ ...prev, exhale: parseFloat(e.target.value) || 0 }))}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Hold (s)</Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={customPreset.hold2}
                                      onChange={(e) => setCustomPreset(prev => ({ ...prev, hold2: parseFloat(e.target.value) || 0 }))}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Sound Guidance</Label>
                              <Switch
                                checked={soundEnabled}
                                onCheckedChange={setSoundEnabled}
                              />
                            </div>

                            <div className="pt-4 border-t border-border/30">
                              <h4 className="text-sm font-medium mb-2">Pattern Overview</h4>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>Inhale: {activePreset.inhale}s</p>
                                {activePreset.hold1 > 0 && <p>Hold: {activePreset.hold1}s</p>}
                                <p>Exhale: {activePreset.exhale}s</p>
                                {activePreset.hold2 > 0 && <p>Hold: {activePreset.hold2}s</p>}
                                <p className="mt-2 font-medium">
                                  Total cycle: {activePreset.inhale + activePreset.hold1 + activePreset.exhale + activePreset.hold2}s
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BreathOfSource;