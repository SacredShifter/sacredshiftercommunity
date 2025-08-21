import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

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
  }
];

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export function useBreathingTool() {
  const [isActive, setIsActive] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<BreathingPreset>(BREATHING_PRESETS[0]);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentToneRef = useRef<{ oscillator: OscillatorNode; gainNode: GainNode } | null>(null);

  const initializeAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

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
      switch (phase) {
        case 'inhale': frequency = 220; break;
        case 'hold1': frequency = 294; break;
        case 'exhale': frequency = 174; break;
        case 'hold2': frequency = 196; break;
        default: frequency = 220;
      }
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Gentle volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.3);
      
      const duration = getPhaseDuration(phase) / 1000;
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration - 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      currentToneRef.current = { oscillator, gainNode };
      
    } catch (error) {
      console.log('Audio playback not available:', error);
    }
  };

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

  const getNextPhase = (phase: BreathPhase): BreathPhase => {
    const phases: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];
    const currentIndex = phases.indexOf(phase);
    return phases[(currentIndex + 1) % phases.length];
  };

  const getPhaseDuration = (phase: BreathPhase): number => {
    switch (phase) {
      case 'inhale': return currentPreset.inhale * 1000;
      case 'hold1': return currentPreset.hold1 * 1000;
      case 'exhale': return currentPreset.exhale * 1000;
      case 'hold2': return currentPreset.hold2 * 1000;
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
          if (phase === 'exhale' || (phase === 'hold2' && currentPreset.hold2 > 0)) {
            setCycleCount(prev => prev + 1);
          }
          
          startPhase(nextPhase);
        }
      }, 100);
      
      intervalRef.current = countdownInterval;
    };
    
    startPhase('inhale');
  };

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

  return {
    isActive,
    currentPreset,
    currentPhase,
    cycleCount,
    timeRemaining,
    soundEnabled,
    presets: BREATHING_PRESETS,
    startBreathing,
    stopBreathing,
    setCurrentPreset,
    setSoundEnabled,
    getPhaseLabel,
    getPhaseDuration
  };
}