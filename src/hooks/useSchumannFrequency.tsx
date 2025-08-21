import { useState, useEffect, useRef, useCallback } from 'react';

interface SchumannFrequency {
  frequency: number;
  name: string;
  description: string;
  brainwaveState: string;
  color: string;
}

const SCHUMANN_FREQUENCIES: SchumannFrequency[] = [
  { 
    frequency: 7.83, 
    name: 'Fundamental', 
    description: "Earth's heartbeat frequency", 
    brainwaveState: 'Alpha-Theta Bridge',
    color: '#ff0000' 
  },
  { 
    frequency: 14.3, 
    name: '2nd Harmonic', 
    description: 'Beta resonance frequency', 
    brainwaveState: 'Alert Awareness',
    color: '#ff7f00' 
  },
  { 
    frequency: 20.8, 
    name: '3rd Harmonic', 
    description: 'High beta frequency', 
    brainwaveState: 'Analytical Thinking',
    color: '#ffff00' 
  },
  { 
    frequency: 27.3, 
    name: '4th Harmonic', 
    description: 'Gamma range frequency', 
    brainwaveState: 'Heightened Awareness',
    color: '#00ff00' 
  },
  { 
    frequency: 33.8, 
    name: '5th Harmonic', 
    description: 'High gamma frequency', 
    brainwaveState: 'Transcendent States',
    color: '#0000ff' 
  },
];

export function useSchumannFrequency() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFrequencies, setActiveFrequencies] = useState<number[]>([7.83]); // Default fundamental
  const [selectedFrequency, setSelectedFrequency] = useState<SchumannFrequency>(SCHUMANN_FREQUENCIES[0]);
  const [spaceWeatherModulation, setSpaceWeatherModulation] = useState(1.0); // 1.0 = no modulation
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<Map<number, { oscillator: OscillatorNode; gainNode: GainNode }>>(new Map());

  const createSchumannTone = useCallback(async (frequency: number, volume: number = 0.01) => {
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
      
      // Apply space weather modulation to frequency
      const modulatedFrequency = frequency * spaceWeatherModulation;
      
      oscillator.frequency.value = modulatedFrequency;
      oscillator.type = 'sine';
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      return { oscillator, gainNode };
    } catch (error) {
      console.warn('Schumann frequency tone not available:', error);
      return null;
    }
  }, [spaceWeatherModulation]);

  const stopFrequency = useCallback((frequency: number) => {
    const nodes = oscillatorsRef.current.get(frequency);
    if (nodes) {
      try {
        nodes.oscillator.stop();
        nodes.oscillator.disconnect();
        nodes.gainNode.disconnect();
      } catch (error) {
        console.warn('Error stopping frequency:', error);
      }
      oscillatorsRef.current.delete(frequency);
    }
  }, []);

  const stopAllFrequencies = useCallback(() => {
    oscillatorsRef.current.forEach((nodes, frequency) => {
      stopFrequency(frequency);
    });
    oscillatorsRef.current.clear();
    setIsPlaying(false);
  }, [stopFrequency]);

  const playFrequency = useCallback(async (frequency: number) => {
    // Stop if already playing
    if (oscillatorsRef.current.has(frequency)) {
      stopFrequency(frequency);
      return;
    }

    const nodes = await createSchumannTone(frequency);
    if (nodes) {
      oscillatorsRef.current.set(frequency, nodes);
    }
  }, [createSchumannTone, stopFrequency]);

  const toggleFrequency = useCallback(async (frequency: number) => {
    if (oscillatorsRef.current.has(frequency)) {
      stopFrequency(frequency);
      setActiveFrequencies(prev => prev.filter(f => f !== frequency));
    } else {
      await playFrequency(frequency);
      setActiveFrequencies(prev => [...prev, frequency]);
    }
  }, [playFrequency, stopFrequency]);

  const togglePlayback = useCallback(async () => {
    if (isPlaying) {
      stopAllFrequencies();
    } else {
      // Play all active frequencies
      for (const frequency of activeFrequencies) {
        await playFrequency(frequency);
      }
      setIsPlaying(true);
    }
  }, [isPlaying, activeFrequencies, playFrequency, stopAllFrequencies]);

  const setSpaceWeatherImpact = useCallback((impact: 'low' | 'moderate' | 'high') => {
    // Modulate frequencies based on space weather
    const modulations = {
      low: 1.0,      // No change
      moderate: 1.02, // +2% frequency shift
      high: 1.05     // +5% frequency shift
    };
    setSpaceWeatherModulation(modulations[impact]);
  }, []);

  // Layer multiple frequencies for complex harmonics
  const playHarmonicSeries = useCallback(async (fundamentalFreq: number = 7.83) => {
    const harmonics = [fundamentalFreq, fundamentalFreq * 2, fundamentalFreq * 3];
    for (const freq of harmonics) {
      await playFrequency(freq);
    }
    setActiveFrequencies(harmonics);
    setIsPlaying(true);
  }, [playFrequency]);

  const cleanup = useCallback(() => {
    stopAllFrequencies();
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  }, [stopAllFrequencies]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    isPlaying,
    activeFrequencies,
    selectedFrequency,
    frequencies: SCHUMANN_FREQUENCIES,
    spaceWeatherModulation,
    
    // Core functions
    toggleFrequency,
    togglePlayback,
    playFrequency,
    stopFrequency,
    stopAllFrequencies,
    setSelectedFrequency,
    
    // Advanced functions
    setSpaceWeatherImpact,
    playHarmonicSeries,
    
    // Status helpers
    isFrequencyActive: (frequency: number) => oscillatorsRef.current.has(frequency),
    getActiveCount: () => oscillatorsRef.current.size,
  };
}