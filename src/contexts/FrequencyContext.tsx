import React, { createContext, useContext, useState, useEffect } from 'react';

interface SacredFrequency {
  hz: number;
  name: string;
  purpose: string;
  chakra: string;
  color: string;
}

interface FrequencyContextType {
  selectedFrequency: SacredFrequency;
  setSelectedFrequency: (frequency: SacredFrequency) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isBackgroundPlaying: boolean;
  setIsBackgroundPlaying: (playing: boolean) => void;
  syncWithFrequency: (frequency: SacredFrequency) => void;
}

const sacredFrequencies: SacredFrequency[] = [
  { hz: 396, name: 'Liberation', purpose: 'Releases guilt, fear, shame', chakra: 'Root', color: 'hsl(0, 84%, 60%)' },
  { hz: 417, name: 'Rebirth', purpose: 'Facilitates change, clears trauma', chakra: 'Sacral', color: 'hsl(24, 100%, 50%)' },
  { hz: 432, name: 'Natural Tuning', purpose: 'Harmonizes body and Earth', chakra: 'Earth', color: 'hsl(120, 61%, 34%)' },
  { hz: 444, name: 'Unity Consciousness', purpose: 'DNA healing, Christ grid', chakra: 'Crown/Heart', color: 'hsl(280, 100%, 70%)' },
  { hz: 528, name: 'Love Frequency', purpose: 'Cellular repair, unconditional love', chakra: 'Heart', color: 'hsl(120, 100%, 50%)' },
  { hz: 639, name: 'Connection', purpose: 'Restores relational balance', chakra: 'Heart/Sacral', color: 'hsl(60, 100%, 50%)' },
  { hz: 741, name: 'Truth', purpose: 'Clears expression blockages', chakra: 'Throat', color: 'hsl(200, 100%, 50%)' },
  { hz: 852, name: 'Awakening', purpose: 'Enhances intuition', chakra: 'Third Eye', color: 'hsl(240, 100%, 70%)' },
  { hz: 963, name: 'Source', purpose: 'Unity with the Divine', chakra: 'Crown', color: 'hsl(300, 100%, 80%)' },
  { hz: 1111, name: 'Portal Alignment', purpose: 'Soul contracts, timeline shifts', chakra: 'Transpersonal', color: 'hsl(320, 100%, 60%)' },
  { hz: 333, name: 'Angelic Messenger', purpose: 'Strengthens guidance', chakra: 'Auric Field', color: 'hsl(45, 100%, 70%)' },
  { hz: 888, name: 'Abundance Field', purpose: 'Divine flow, manifestation', chakra: 'Solar Plexus', color: 'hsl(50, 100%, 60%)' },
  { hz: 108, name: 'Sacred Repetition', purpose: 'Mantras, sacred chants', chakra: 'Universal', color: 'hsl(270, 50%, 60%)' },
  { hz: 7.83, name: 'Schumann Resonance', purpose: 'Earth\'s natural pulse', chakra: 'Earth Star', color: 'hsl(30, 70%, 50%)' },
  { hz: 285, name: 'Cellular Matrix', purpose: 'Physical renewal', chakra: 'Body Template', color: 'hsl(140, 80%, 45%)' },
  { hz: 174, name: 'Pain Relief', purpose: 'Deep physical healing', chakra: 'Nervous System', color: 'hsl(190, 80%, 50%)' },
];

const FrequencyContext = createContext<FrequencyContextType | undefined>(undefined);

export const FrequencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFrequency, setSelectedFrequency] = useState<SacredFrequency>(sacredFrequencies[4]); // Default to 528 Hz Love
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);

  // Sync other modules with selected frequency
  const syncWithFrequency = (frequency: SacredFrequency) => {
    setSelectedFrequency(frequency);
    
    // Broadcast frequency change event for module synchronization
    window.dispatchEvent(new CustomEvent('frequencyChange', { 
      detail: { frequency } 
    }));
  };

  // Listen for external frequency sync requests
  useEffect(() => {
    const handleFrequencySync = (event: CustomEvent) => {
      const { frequency } = event.detail;
      setSelectedFrequency(frequency);
    };

    window.addEventListener('frequencySync', handleFrequencySync as EventListener);
    
    return () => {
      window.removeEventListener('frequencySync', handleFrequencySync as EventListener);
    };
  }, []);

  const value: FrequencyContextType = {
    selectedFrequency,
    setSelectedFrequency,
    isPlaying,
    setIsPlaying,
    isBackgroundPlaying,
    setIsBackgroundPlaying,
    syncWithFrequency
  };

  return (
    <FrequencyContext.Provider value={value}>
      {children}
    </FrequencyContext.Provider>
  );
};

export const useFrequency = () => {
  const context = useContext(FrequencyContext);
  if (context === undefined) {
    throw new Error('useFrequency must be used within a FrequencyProvider');
  }
  return context;
};

export { sacredFrequencies };
export type { SacredFrequency };