import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Maximize2, Minimize2, Settings, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import FlowerOfLifeIcon from './FlowerOfLifeIcon';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BreathPattern {
  name: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

const breathPatterns: BreathPattern[] = [
  { name: '4-7-8 Relaxation', inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  { name: 'Box Breathing', inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  { name: 'Coherent Breathing', inhale: 5, hold1: 0, exhale: 5, hold2: 0 },
  { name: 'Energizing 4-4-6', inhale: 4, hold1: 4, exhale: 6, hold2: 0 },
];

const BreathOfSource: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState(breathPatterns[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const inhaleAudioRef = useRef<HTMLAudioElement>(null);
  const exhaleAudioRef = useRef<HTMLAudioElement>(null);
  const holdAudioRef = useRef<HTMLAudioElement>(null);

  const playSound = useCallback((phase: BreathPhase) => {
    if (!soundEnabled) return;

    let audioRef: React.RefObject<HTMLAudioElement> | null = null;
    switch (phase) {
      case 'inhale':
        audioRef = inhaleAudioRef;
        break;
      case 'exhale':
        audioRef = exhaleAudioRef;
        break;
      case 'hold1':
      case 'hold2':
        audioRef = holdAudioRef;
        break;
    }

    if (audioRef?.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  }, [soundEnabled, volume]);

  const startBreathing = useCallback(() => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeRemaining(selectedPattern.inhale * 1000);
    playSound('inhale');
  }, [selectedPattern, playSound]);

  const stopBreathing = useCallback(() => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeRemaining(0);
  }, []);

  const resetSession = useCallback(() => {
    stopBreathing();
    setCycleCount(0);
    setSessionDuration(0);
  }, [stopBreathing]);

  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 100) {
          const phases: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
          const currentIndex = phases.indexOf(currentPhase);
          let nextIndex = (currentIndex + 1) % phases.length;
          let nextPhase = phases[nextIndex];
          
          const durations = {
            inhale: selectedPattern.inhale,
            hold1: selectedPattern.hold1,
            exhale: selectedPattern.exhale,
            hold2: selectedPattern.hold2
          };

          while (durations[nextPhase] === 0) {
            nextIndex = (nextIndex + 1) % phases.length;
            nextPhase = phases[nextIndex];
          }

          setCurrentPhase(nextPhase);
          playSound(nextPhase);
          
          if (nextPhase === 'inhale') {
            setCycleCount(prev => prev + 1);
          }
          
          return durations[nextPhase] * 1000;
        }
        return prev - 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining, currentPhase, selectedPattern, playSound]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const getPhaseText = (phase: BreathPhase) => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
    }
  };

  const handlePatternChange = (patternName: string) => {
    const pattern = breathPatterns.find(p => p.name === patternName);
    if (pattern) {
      setSelectedPattern(pattern);
      resetSession();
    }
  };

  if (!user) return null;

  const iconAnimation = {
    scale: isActive ? (currentPhase === 'inhale' ? 1.2 : 1) : 1,
  };

  const iconTransition = {
    duration: selectedPattern.inhale,
    ease: 'linear',
  };

  return (
    <div className="relative">
      <audio ref={inhaleAudioRef} src="/inhale.mp3" preload="auto" />
      <audio ref={exhaleAudioRef} src="/exhale.mp3" preload="auto" />
      <audio ref={holdAudioRef} src="/hold.mp3" preload="auto" />

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
              transition={{ duration: selectedPattern.inhale + selectedPattern.exhale + selectedPattern.hold1 + selectedPattern.hold2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-sm"
            />
            <FlowerOfLifeIcon className="w-8 h-8 text-primary/80 relative z-10" />
            <div className="absolute -inset-1 bg-primary/10 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity" />
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {!isFullscreen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-24 left-20 z-40 w-80"
              >
                <Card className="bg-background/95 backdrop-blur-md border-primary/20 shadow-xl">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                      <div className="flex items-center gap-3">
                        <FlowerOfLifeIcon className="h-8 w-8 text-primary/80" />
                        <div>
                          <h3 className="font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Breath of Source
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {selectedPattern.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsFullscreen(true)}
                          className="h-6 w-6 p-0"
                        >
                          <Maximize2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsOpen(false)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </div>

                    {!showSettings ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-4">
                        <div className="relative mb-4">
                          <motion.div
                            animate={isActive ? {
                              scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 1.3 : 0.9,
                              opacity: currentPhase === 'inhale' || currentPhase === 'hold1' ? 0.9 : 0.6
                            } : { scale: 1, opacity: 0.8 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/30 via-blue-400/30 to-indigo-400/30 backdrop-blur-sm border border-purple-300/30"
                          />
                        </div>
                        <motion.div
                          key={currentPhase}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center mb-3"
                        >
                          <p className="font-medium text-sm">{getPhaseText(currentPhase)}</p>
                          {isActive && (
                            <p className="text-sm text-muted-foreground">
                              {Math.ceil(timeRemaining / 1000)}s
                            </p>
                          )}
                        </motion.div>
                        <div className="flex items-center gap-2">
                          {!isActive ? (
                            <Button onClick={startBreathing} size="sm">
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          ) : (
                            <Button onClick={stopBreathing} variant="outline" size="sm">
                              <Pause className="h-3 w-3 mr-1" />
                              Pause
                            </Button>
                          )}
                          <Button onClick={resetSession} variant="ghost" size="sm">
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                          <Button
                            onClick={() => setShowSettings(true)}
                            variant="ghost"
                            size="sm"
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                        {cycleCount > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Cycles: {cycleCount}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Settings</h4>
                            <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>Done</Button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label>Preset</Label>
                                <Select onValueChange={handlePatternChange} defaultValue={selectedPattern.name}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a pattern" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {breathPatterns.map(p => (
                                            <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Sound</Label>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
                                        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                                    </Button>
                                    <Slider
                                        disabled={!soundEnabled}
                                        value={[volume]}
                                        onValueChange={(value) => setVolume(value[0])}
                                        max={1}
                                        step={0.1}
                                    />
                                </div>
                            </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md"
              >
                <div className="relative z-10 flex items-center justify-between p-4 border-b border-border/30">
                  <div className="flex items-center gap-3">
                    <FlowerOfLifeIcon className="h-10 w-10 text-primary/80" />
                    <div>
                      <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Breath of Source
                      </h2>
                      <Badge variant="outline">
                        {selectedPattern.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setShowSettings(!showSettings)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsFullscreen(false)}
                    >
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Minimize
                    </Button>
                  </div>
                </div>

                {/* Main Breathing Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    <AnimatePresence>
                    {!showSettings ? (
                        <motion.div
                            key="breathing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center"
                        >
                            <div className="relative mb-8">
                                <motion.div
                                animate={isActive ? {
                                    scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 1.4 : 0.8,
                                    opacity: currentPhase === 'inhale' || currentPhase === 'hold1' ? 0.9 : 0.6
                                } : { scale: 1, opacity: 0.8 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-purple-400/30 via-blue-400/30 to-indigo-400/30 backdrop-blur-sm border border-purple-300/30"
                                />
                            </div>
                            <motion.div
                                key={currentPhase}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-6"
                            >
                                <h3 className="text-2xl font-semibold mb-2">{getPhaseText(currentPhase)}</h3>
                                {isActive && (
                                <p className="text-muted-foreground">
                                    {Math.ceil(timeRemaining / 1000)}s remaining
                                </p>
                                )}
                            </motion.div>
                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={isActive ? stopBreathing : startBreathing}
                                    size="lg"
                                    className="px-8"
                                >
                                    {isActive ? ( <> <Pause className="h-4 w-4 mr-2" /> Pause </> ) : 
                                    ( <> <Play className="h-4 w-4 mr-2" /> Start Breathing </>)}
                                </Button>
                                <Button onClick={resetSession} variant="outline" size="lg">
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                             {(cycleCount > 0 || sessionDuration > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 text-center text-sm text-muted-foreground"
                                >
                                    {cycleCount > 0 && <p>Cycles completed: {cycleCount}</p>}
                                    {sessionDuration > 0 && (
                                        <p>Session duration: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</p>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="settings"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-md p-8"
                        >
                            <h2 className="text-2xl font-semibold mb-6">Settings</h2>
                            <div className="space-y-6">
                                <div>
                                    <Label className="text-lg">Preset</Label>
                                    <Select onValueChange={handlePatternChange} defaultValue={selectedPattern.name}>
                                        <SelectTrigger className="text-lg py-6">
                                            <SelectValue placeholder="Select a pattern" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {breathPatterns.map(p => (
                                                <SelectItem key={p.name} value={p.name} className="text-lg">{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-lg">Sound</Label>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Button variant="outline" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
                                            {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                                        </Button>
                                        <Slider
                                            disabled={!soundEnabled}
                                            value={[volume]}
                                            onValueChange={(value) => setVolume(value[0])}
                                            max={1}
                                            step={0.1}
                                            className="h-2"
                                        />
                                    </div>
                                </div>
                            </div>
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