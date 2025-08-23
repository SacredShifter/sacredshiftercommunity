import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AudioEngineState {
  analyser: AnalyserNode | null;
}

const AudioAnalyserContext = createContext<AudioEngineState>({ analyser: null });

export const useAudioAnalyser = () => useContext(AudioAnalyserContext);

interface AudioEngineProps {
  children: ReactNode;
}

export const AudioEngine: React.FC<AudioEngineProps> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioEngineState>({ analyser: null });

  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    // Placeholder audio source: an oscillator
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 pitch

    oscillator.connect(analyser);
    analyser.connect(audioContext.destination);

    oscillator.start();

    setAudioState({ analyser });

    return () => {
      oscillator.stop();
      audioContext.close();
    };
  }, []);

  return (
    <AudioAnalyserContext.Provider value={audioState}>
      {children}
    </AudioAnalyserContext.Provider>
  );
};