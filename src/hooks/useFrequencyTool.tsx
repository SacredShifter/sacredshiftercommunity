import { useState, useEffect, useRef } from 'react';

interface SacredFrequency {
  hz: number;
  name: string;
  purpose: string;
  chakra: string;
  color: string;
}

const SACRED_FREQUENCIES: SacredFrequency[] = [
  { hz: 396, name: 'Liberation', purpose: 'Releases guilt, fear, shame', chakra: 'Root', color: 'hsl(0, 84%, 60%)' },
  { hz: 417, name: 'Rebirth', purpose: 'Facilitates change, clears trauma', chakra: 'Sacral', color: 'hsl(24, 100%, 50%)' },
  { hz: 528, name: 'Love Frequency', purpose: 'Cellular repair, unconditional love', chakra: 'Heart', color: 'hsl(120, 100%, 50%)' },
  { hz: 639, name: 'Connection', purpose: 'Restores relational balance', chakra: 'Heart/Sacral', color: 'hsl(60, 100%, 50%)' },
  { hz: 741, name: 'Truth', purpose: 'Clears expression blockages', chakra: 'Throat', color: 'hsl(200, 100%, 50%)' },
  { hz: 852, name: 'Awakening', purpose: 'Enhances intuition', chakra: 'Third Eye', color: 'hsl(240, 100%, 70%)' },
  { hz: 963, name: 'Source', purpose: 'Unity with the Divine', chakra: 'Crown', color: 'hsl(300, 100%, 80%)' }
];

export function useFrequencyTool() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<SacredFrequency>(SACRED_FREQUENCIES[2]); // Default to 528 Hz Love
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const createSacredTone = async (frequency: number, volume: number = 0.015) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      return { oscillator, gainNode };
    } catch (error) {
      console.warn('Sacred soundscape not available:', error);
      return null;
    }
  };

  const stopSacredTone = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (error) {}
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  };

  const toggleSacredSound = async () => {
    if (isPlaying) {
      stopSacredTone();
      setIsPlaying(false);
    } else {
      const result = await createSacredTone(selectedFrequency.hz);
      if (result) {
        oscillatorRef.current = result.oscillator;
        gainNodeRef.current = result.gainNode;
        setIsPlaying(true);
      }
    }
  };

  const selectFrequency = async (frequency: SacredFrequency) => {
    const wasPlaying = isPlaying;
    setSelectedFrequency(frequency);
    
    if (wasPlaying) {
      stopSacredTone();
      const result = await createSacredTone(frequency.hz);
      if (result) {
        oscillatorRef.current = result.oscillator;
        gainNodeRef.current = result.gainNode;
      } else {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopSacredTone();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    selectedFrequency,
    frequencies: SACRED_FREQUENCIES,
    toggleSacredSound,
    selectFrequency
  };
}