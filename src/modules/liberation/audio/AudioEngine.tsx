import React, { useEffect, useRef, useState } from 'react';
import { useLiberationState } from '../context/LiberationContext';

interface AudioLayer {
  id: string;
  type: 'binaural' | 'ambient' | 'voice' | 'frequency';
  frequency?: number;
  volume: number;
  playing: boolean;
}

export const AudioEngine: React.FC = () => {
  const { state } = useLiberationState();
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<Map<string, OscillatorNode>>(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  // Scene-specific audio configurations
  const sceneAudioConfig = {
    intro: {
      ambient: { frequency: 528, volume: 0.2 }, // Love frequency
      binaural: { frequency: 10, volume: 0.1 }, // Alpha waves
    },
    fear: {
      ambient: { frequency: 174, volume: 0.3 }, // Pain relief frequency
      binaural: { frequency: 6, volume: 0.15 }, // Theta waves for deep healing
      dissolve: { frequency: 396, volume: 0.25 }, // Liberation from fear
    },
    crossing: {
      ambient: { frequency: 639, volume: 0.3 }, // Connection frequency
      binaural: { frequency: 8, volume: 0.2 }, // Alpha-theta transition
    },
    expansion: {
      ambient: { frequency: 741, volume: 0.35 }, // Consciousness expansion
      binaural: { frequency: 4, volume: 0.1 }, // Theta for transcendence
      harmony: { frequency: 852, volume: 0.2 }, // Return to spiritual order
    },
    integration: {
      ambient: { frequency: 963, volume: 0.3 }, // Pineal gland activation
      binaural: { frequency: 40, volume: 0.05 }, // Gamma waves for integration
    },
  };

  // Initialize Web Audio API
  const initializeAudio = async () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.connect(audioContextRef.current.destination);
        gainNodeRef.current.gain.value = state.context.comfortSettings.volumeLevel;
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio context:', error);
      }
    }
  };

  // Create oscillator for specific frequency
  const createOscillator = (frequency: number, type: OscillatorType = 'sine', volume: number = 0.1): OscillatorNode | null => {
    if (!audioContextRef.current || !gainNodeRef.current) return null;

    const oscillator = audioContextRef.current.createOscillator();
    const oscillatorGain = audioContextRef.current.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillatorGain.gain.value = volume;

    oscillator.connect(oscillatorGain);
    oscillatorGain.connect(gainNodeRef.current);

    return oscillator;
  };

  // Create binaural beats effect
  const createBinauralBeats = (baseFrequency: number, beatFrequency: number, volume: number = 0.1) => {
    if (!audioContextRef.current) return null;

    const leftOsc = createOscillator(baseFrequency, 'sine', volume);
    const rightOsc = createOscillator(baseFrequency + beatFrequency, 'sine', volume);

    if (!leftOsc || !rightOsc) return null;

    // Pan left and right
    const leftPanner = audioContextRef.current.createStereoPanner();
    const rightPanner = audioContextRef.current.createStereoPanner();
    leftPanner.pan.value = -1;
    rightPanner.pan.value = 1;

    leftOsc.connect(leftPanner);
    rightOsc.connect(rightPanner);
    leftPanner.connect(gainNodeRef.current!);
    rightPanner.connect(gainNodeRef.current!);

    return { left: leftOsc, right: rightOsc };
  };

  // Start scene-specific audio
  const startSceneAudio = (scene: string) => {
    if (!isInitialized || !state.context.audioGranted) return;

    // Stop all current oscillators
    stopAllOscillators();

    const config = sceneAudioConfig[scene as keyof typeof sceneAudioConfig];
    if (!config) return;

    // Create ambient frequency
    if (config.ambient) {
      const ambientOsc = createOscillator(
        config.ambient.frequency,
        'sine',
        config.ambient.volume
      );
      if (ambientOsc) {
        ambientOsc.start();
        oscillatorsRef.current.set(`${scene}-ambient`, ambientOsc);
      }
    }

    // Create binaural beats
    if (config.binaural) {
      const binaural = createBinauralBeats(
        200, // Base frequency
        config.binaural.frequency,
        config.binaural.volume
      );
      if (binaural) {
        binaural.left.start();
        binaural.right.start();
        oscillatorsRef.current.set(`${scene}-binaural-left`, binaural.left);
        oscillatorsRef.current.set(`${scene}-binaural-right`, binaural.right);
      }
    }

    // Add special frequencies for specific scenes
    if (scene === 'fear' && config.dissolve) {
      const dissolveOsc = createOscillator(
        config.dissolve.frequency,
        'triangle',
        config.dissolve.volume
      );
      if (dissolveOsc) {
        dissolveOsc.start();
        oscillatorsRef.current.set(`${scene}-dissolve`, dissolveOsc);
      }
    }

    if (scene === 'expansion' && config.harmony) {
      const harmonyOsc = createOscillator(
        config.harmony.frequency,
        'sine',
        config.harmony.volume
      );
      if (harmonyOsc) {
        harmonyOsc.start();
        oscillatorsRef.current.set(`${scene}-harmony`, harmonyOsc);
      }
    }
  };

  // Stop all oscillators
  const stopAllOscillators = () => {
    oscillatorsRef.current.forEach((oscillator) => {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (error) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current.clear();
  };

  // Update volume based on comfort settings
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = state.context.comfortSettings.volumeLevel;
    }
  }, [state.context.comfortSettings.volumeLevel]);

  // Handle scene changes
  useEffect(() => {
    if (state.context.audioGranted && isInitialized) {
      startSceneAudio(state.context.currentScene);
    }
  }, [state.context.currentScene, state.context.audioGranted, isInitialized]);

  // Handle audio permission
  useEffect(() => {
    if (state.context.audioGranted && !isInitialized) {
      initializeAudio();
    }
  }, [state.context.audioGranted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllOscillators();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Request audio permission on first interaction
  const handleAudioPermission = async () => {
    try {
      await initializeAudio();
      if (audioContextRef.current) {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      console.error('Audio permission denied:', error);
    }
  };

  // Show audio permission prompt if not granted
  if (!state.context.audioGranted && !isInitialized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg max-w-sm">
          <h3 className="font-semibold mb-2">Enable Audio Experience</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Liberation features binaural beats and healing frequencies to enhance your journey.
          </p>
          <button
            onClick={handleAudioPermission}
            className="w-full bg-primary text-primary-foreground rounded-md px-3 py-2 hover:bg-primary/90 transition-colors"
          >
            Enable Audio
          </button>
        </div>
      </div>
    );
  }

  return null;
};