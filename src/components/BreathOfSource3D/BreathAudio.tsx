import React, { useRef, useEffect } from 'react';

interface BreathAudioProps {
  isActive: boolean;
  currentPhase: string;
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  preset: string;
}

export default function BreathAudio({ 
  isActive, 
  currentPhase, 
  trustSpeed, 
  preset 
}: BreathAudioProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  // Initialize audio context
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Resume context if suspended (required for Chrome)
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };

    if (isActive) {
      initAudio();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isActive]);

  // Create and manage audio layers
  useEffect(() => {
    if (!isActive || !audioContextRef.current) return;

    const createAudioLayer = () => {
      if (!audioContextRef.current) return;

      // Clean up existing nodes
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      // Create audio nodes
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const filter = audioContextRef.current.createBiquadFilter();

      // Configure filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      filter.Q.setValueAtTime(1, audioContextRef.current.currentTime);

      // Connect audio graph
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      filterRef.current = filter;

      // Configure based on breath phase and trust speed
      const speedMultiplier = {
        gentle: 0.7,
        balanced: 1.0,
        bold: 1.3
      }[trustSpeed];

      let frequency = 220; // Base frequency (A3)
      let waveType: OscillatorType = 'sine';
      let volume = 0.1;

      switch (currentPhase) {
        case 'inhale':
          // Ascending pad (Life)
          frequency = 330; // E4
          waveType = 'sine';
          volume = 0.15;
          // Gradually rise in frequency
          oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime);
          oscillator.frequency.linearRampToValueAtTime(330, audioContextRef.current.currentTime + (2 / speedMultiplier));
          break;

        case 'holdIn':
          // Shimmer effect (Receive)
          frequency = 440; // A4
          waveType = 'triangle';
          volume = 0.12;
          // Add slight vibrato
          const lfo = audioContextRef.current.createOscillator();
          const lfoGain = audioContextRef.current.createGain();
          lfo.frequency.setValueAtTime(5, audioContextRef.current.currentTime);
          lfoGain.gain.setValueAtTime(10, audioContextRef.current.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(oscillator.frequency);
          lfo.start();
          break;

        case 'exhale':
          // Descending pad (Death)
          frequency = 220; // A3
          waveType = 'sine';
          volume = 0.12;
          // Gradually descend in frequency
          oscillator.frequency.setValueAtTime(330, audioContextRef.current.currentTime);
          oscillator.frequency.linearRampToValueAtTime(180, audioContextRef.current.currentTime + (3 / speedMultiplier));
          break;

        case 'holdOut':
          // Safe hum (Surrender)
          frequency = 165; // E3
          waveType = 'sawtooth';
          volume = 0.08;
          // Low, stable tone
          filter.frequency.setValueAtTime(400, audioContextRef.current.currentTime);
          break;

        default:
          volume = 0;
      }

      // Set oscillator properties
      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);

      // Set volume with fade in/out
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContextRef.current.currentTime + 0.1);

      // Add binaural beat for deeper states (optional)
      if (preset === 'sovereignty' && currentPhase === 'holdIn') {
        const binauralOsc = audioContextRef.current.createOscillator();
        const binauralGain = audioContextRef.current.createGain();
        
        binauralOsc.frequency.setValueAtTime(frequency + 7, audioContextRef.current.currentTime); // 7Hz theta
        binauralGain.gain.setValueAtTime(0.05, audioContextRef.current.currentTime);
        
        binauralOsc.connect(binauralGain);
        binauralGain.connect(audioContextRef.current.destination);
        binauralOsc.start();
        
        // Clean up binaural after phase
        setTimeout(() => {
          binauralOsc.stop();
          binauralOsc.disconnect();
        }, (2000 / speedMultiplier));
      }

      // Start oscillator
      oscillator.start();

      // Fade out and stop after phase duration
      const phaseDuration = {
        inhale: 4000,
        holdIn: 1000,
        exhale: 6000,
        holdOut: 1000
      }[currentPhase as keyof typeof phaseDuration] || 4000;

      const adjustedDuration = phaseDuration / speedMultiplier;

      setTimeout(() => {
        if (gainNode.gain) {
          gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + 0.2);
        }
        setTimeout(() => {
          oscillator.stop();
          oscillator.disconnect();
        }, 200);
      }, adjustedDuration - 200);
    };

    createAudioLayer();

    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
          oscillatorRef.current.disconnect();
        } catch (error) {
          // Oscillator might already be stopped
        }
      }
    };
  }, [currentPhase, trustSpeed, preset, isActive]);

  // This component doesn't render anything visible
  return null;
}