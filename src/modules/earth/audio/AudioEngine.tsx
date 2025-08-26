import React, { useEffect, useRef } from 'react';
import { useEarthState } from '../context/EarthContext';

const frequencies = {
  forest: 528,
  ocean: 432,
  atmosphere: 639,
  magnetic: 7.83,
  sun: 963,
  moon: 336,
};

export const AudioEngine: React.FC = () => {
  const { state } = useEarthState();
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const soundscapeGainRef = useRef<GainNode | null>(null);
  const soundscapeSourceRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);


  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;

    if (!oscillatorRef.current) {
      // Tone generator
      oscillatorRef.current = audioContext.createOscillator();
      gainRef.current = audioContext.createGain();
      oscillatorRef.current.connect(gainRef.current);
      gainRef.current.connect(audioContext.destination);
      oscillatorRef.current.start();

      // Soundscape generator
      soundscapeGainRef.current = audioContext.createGain();
      soundscapeGainRef.current.connect(audioContext.destination);
    }

    // Stop previous soundscape
    if (soundscapeSourceRef.current) {
      soundscapeSourceRef.current.stop();
    }

    const breathingMode = state.context.breathingMode;
    const celestialBody = state.context.celestialBody;

    if (celestialBody && frequencies[celestialBody]) {
      // Play celestial tone
      gainRef.current.gain.setValueAtTime(0.4, audioContext.currentTime);
      oscillatorRef.current.frequency.setValueAtTime(frequencies[celestialBody], audioContext.currentTime);
    } else if (breathingMode && frequencies[breathingMode]) {
      // Play breathing tone
      gainRef.current.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillatorRef.current.frequency.setValueAtTime(frequencies[breathingMode], audioContext.currentTime);
    } else {
      gainRef.current.gain.setValueAtTime(0, audioContext.currentTime);
    }

    if (breathingMode) {
      soundscapeGainRef.current.gain.setValueAtTime(0.2, audioContext.currentTime);

      let source;
      switch(breathingMode) {
        case 'forest':
          source = audioContext.createBufferSource();
          const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          source.buffer = buffer;
          source.loop = true;
          const filter = audioContext.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 400;
          source.connect(filter);
          filter.connect(soundscapeGainRef.current);
          break;
        case 'ocean':
          source = audioContext.createOscillator();
          source.type = 'sine';
          source.frequency.value = 0.5;
          const lfo = audioContext.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 0.2;
          lfo.connect(soundscapeGainRef.current.gain);
          source.connect(soundscapeGainRef.current);
          lfo.start();
          break;
        case 'atmosphere':
          source = audioContext.createBufferSource();
          const atmBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
          const atmData = atmBuffer.getChannelData(0);
          for (let i = 0; i < atmData.length; i++) {
            atmData[i] = Math.random() * 2 - 1;
          }
          source.buffer = atmBuffer;
          source.loop = true;
          source.connect(soundscapeGainRef.current);
          break;
        case 'magnetic':
          source = audioContext.createOscillator();
          source.type = 'sine';
          source.frequency.value = 7.83;
          source.connect(soundscapeGainRef.current);
          break;
      }
      if (source) {
        source.start();
        soundscapeSourceRef.current = source;
      }

    } else {
      gainRef.current.gain.setValueAtTime(0, audioContext.currentTime);
      soundscapeGainRef.current.gain.setValueAtTime(0, audioContext.currentTime);
    }

    return () => {
      if (gainRef.current) {
        gainRef.current.gain.setValueAtTime(0, audioContext.currentTime);
      }
      if (soundscapeGainRef.current) {
        soundscapeGainRef.current.gain.setValueAtTime(0, audioContext.currentTime);
      }
    };
  }, [state.context.breathingMode, state.context.celestialBody]);

  return null;
};