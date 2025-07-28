import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Waves } from 'lucide-react';

interface SacredFrequency {
  hz: number;
  name: string;
  purpose: string;
  chakra: string;
  color: string;
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

export const SacredSoundscape = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFrequencies, setShowFrequencies] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<SacredFrequency>(sacredFrequencies[4]); // Default to 528 Hz Love
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const createSacredTone = async (frequency: number) => {
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
      gainNode.gain.value = 0.015;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
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
        setIsPlaying(true);
      }
    }
  };

  const selectFrequency = async (frequency: SacredFrequency) => {
    setSelectedFrequency(frequency);
    setShowFrequencies(false);
    
    if (isPlaying) {
      stopSacredTone();
      const result = await createSacredTone(frequency.hz);
      if (!result) {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.sacred-frequency-selector')) {
        setShowFrequencies(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      stopSacredTone();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-20 left-4 z-50 sacred-frequency-selector">
      <div className="relative">
        {/* Frequency Selection Menu */}
        {showFrequencies && (
          <div className="absolute bottom-16 left-0 w-80 bg-background/95 backdrop-blur-md border border-primary/30 rounded-2xl shadow-2xl z-50 p-4 max-h-96 overflow-y-auto">
            <h3 className="text-sm font-semibold text-primary mb-3 text-center">Sacred Frequencies</h3>
            <div className="grid gap-2">
              {sacredFrequencies.map((freq) => (
                <button
                  key={freq.hz}
                  onClick={() => selectFrequency(freq)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-300 hover:scale-105 ${
                    selectedFrequency.hz === freq.hz 
                      ? 'border-primary bg-primary/10 shadow-lg' 
                      : 'border-border hover:border-primary/50 bg-card/50'
                  }`}
                  style={{
                    boxShadow: selectedFrequency.hz === freq.hz ? `0 0 20px ${freq.color}30` : undefined
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm" style={{ color: freq.color }}>
                        {freq.hz}Hz - {freq.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {freq.purpose}
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        {freq.chakra}
                      </div>
                    </div>
                    <Waves 
                      className="h-4 w-4 ml-2 opacity-60" 
                      style={{ color: freq.color }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Sound Button */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={toggleSacredSound}
            variant="outline"
            size="sm"
            className="sacred-button bg-background/20 backdrop-blur-sm border-primary/30 hover:border-primary/60"
            title={isPlaying ? `Playing ${selectedFrequency.hz}Hz ${selectedFrequency.name}` : `Activate ${selectedFrequency.hz}Hz ${selectedFrequency.name}`}
          >
            {isPlaying ? (
              <Volume2 className="h-4 w-4 text-primary animate-pulse" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          
          <Button
            onClick={() => setShowFrequencies(!showFrequencies)}
            variant="outline"
            size="sm"
            className="sacred-button bg-background/20 backdrop-blur-sm border-primary/30 hover:border-primary/60"
            title="Select Sacred Frequency"
          >
            <Waves className="h-4 w-4 text-primary" />
          </Button>
        </div>

        {/* Current Frequency Display */}
        {isPlaying && (
          <div className="mt-2 text-xs text-center bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1 border border-primary/20">
            <div className="text-primary font-medium">{selectedFrequency.hz}Hz</div>
            <div className="text-muted-foreground">{selectedFrequency.name}</div>
          </div>
        )}
      </div>
    </div>
  );
};