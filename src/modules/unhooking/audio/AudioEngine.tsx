import React, { useEffect, useRef } from 'react';
import { useUnhookingState } from '../context/UnhookingContext';
import * as Tone from 'tone';

export const AudioEngine: React.FC = () => {
  const { state } = useUnhookingState();
  const chatterRef = useRef<Tone.Player[]>([]);
  const quietRef = useRef<Tone.Oscillator | null>(null);
  const currentScene = state.context.currentScene;
  const audioGranted = state.context.audioGranted;

  useEffect(() => {
    if (!audioGranted) return;

    const initAudio = async () => {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      // Create quiet baseline
      quietRef.current = new Tone.Oscillator({
        frequency: 174, // Healing frequency
        type: 'sine',
        volume: -25
      }).toDestination();
    };

    initAudio();

    return () => {
      chatterRef.current.forEach(player => player.dispose());
      if (quietRef.current) {
        quietRef.current.dispose();
      }
    };
  }, [audioGranted]);

  useEffect(() => {
    if (!audioGranted || !quietRef.current) return;

    switch (currentScene) {
      case 'fog':
        // Layered chatter simulation
        quietRef.current.stop();
        // In a real implementation, this would play overlapping voice samples
        break;
        
      case 'recognition':
        // Slightly less chaotic
        break;
        
      case 'clearing':
        // Fading chatter
        break;
        
      case 'calm':
        // Pure quiet baseline
        quietRef.current.frequency.value = 174;
        quietRef.current.start();
        break;
        
      default:
        quietRef.current.stop();
    }
  }, [currentScene, audioGranted]);

  return null;
};