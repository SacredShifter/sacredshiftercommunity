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
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const backgroundOscillatorRef = useRef<OscillatorNode | null>(null);
  const backgroundGainRef = useRef<GainNode | null>(null);

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

  const createBackgroundTone = async (frequency: number) => {
    const result = await createSacredTone(frequency, 0.008); // Very low volume for background
    if (result) {
      backgroundOscillatorRef.current = result.oscillator;
      backgroundGainRef.current = result.gainNode;
      return result;
    }
    return null;
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

  const stopBackgroundTone = () => {
    if (backgroundOscillatorRef.current) {
      try {
        backgroundOscillatorRef.current.stop();
        backgroundOscillatorRef.current.disconnect();
      } catch (error) {}
      backgroundOscillatorRef.current = null;
    }
    if (backgroundGainRef.current) {
      backgroundGainRef.current.disconnect();
      backgroundGainRef.current = null;
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

  const toggleBackgroundTone = async () => {
    if (isBackgroundPlaying) {
      stopBackgroundTone();
      setIsBackgroundPlaying(false);
    } else {
      const result = await createBackgroundTone(selectedFrequency.hz);
      if (result) {
        setIsBackgroundPlaying(true);
      }
    }
  };

  const selectFrequency = async (frequency: SacredFrequency) => {
    const wasPlaying = isPlaying;
    const wasBackgroundPlaying = isBackgroundPlaying;
    setSelectedFrequency(frequency);
    setShowFrequencies(false);
    
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
    
    if (wasBackgroundPlaying) {
      stopBackgroundTone();
      const result = await createBackgroundTone(frequency.hz);
      if (!result) {
        setIsBackgroundPlaying(false);
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
      stopBackgroundTone();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed bottom-20 left-4 z-50 sacred-frequency-selector">
      <div className="relative"
           style={{
             filter: isPlaying || isBackgroundPlaying ? `drop-shadow(0 0 20px ${selectedFrequency.color}80)` : undefined
           }}>
        {/* Animated Tone Aura */}
        {(isPlaying || isBackgroundPlaying) && (
          <div 
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: `radial-gradient(circle, ${selectedFrequency.color}30 0%, ${selectedFrequency.color}10 50%, transparent 100%)`,
              animation: 'sacred-aura-pulse 2s ease-in-out infinite',
              transform: 'scale(2)',
              zIndex: -1
            }}
          />
        )}
        
        {/* Frequency Trails */}
        {(isPlaying || isBackgroundPlaying) && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-60"
                style={{
                  height: '100px',
                  left: '50%',
                  top: '50%',
                  transformOrigin: '50% 0%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  color: selectedFrequency.color,
                  animation: `sacred-trail-flow 3s linear infinite ${i * 0.2}s`
                }}
              />
            ))}
          </div>
        )}
        {/* Sacred Frequency Fan */}
        {showFrequencies && (
          <div className="absolute bottom-16 left-0">
            {sacredFrequencies.map((freq, index) => {
              const angle = (index * 360) / sacredFrequencies.length;
              const radius = 120;
              const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
              const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
              
              return (
                <button
                  key={freq.hz}
                  onClick={() => selectFrequency(freq)}
                  className={`absolute w-16 h-16 rounded-full border-2 transition-all duration-500 hover:scale-125 transform ${
                    selectedFrequency.hz === freq.hz 
                      ? 'border-primary bg-primary/20 shadow-2xl scale-110' 
                      : 'border-border bg-background/80 hover:border-primary/50'
                  }`}
                  style={{
                    left: `${x + 60}px`,
                    bottom: `${-y + 60}px`,
                    backgroundColor: selectedFrequency.hz === freq.hz ? `${freq.color}20` : undefined,
                    borderColor: freq.color,
                    boxShadow: selectedFrequency.hz === freq.hz ? `0 0 30px ${freq.color}60` : `0 0 10px ${freq.color}30`,
                    animationDelay: `${index * 50}ms`,
                    animation: showFrequencies ? 'sacred-fan-appear 0.6s ease-out forwards' : undefined
                  }}
                  title={`${freq.hz}Hz ${freq.name} - ${freq.purpose}`}
                >
                  <div className="flex flex-col items-center justify-center h-full text-xs">
                    <div className="font-bold" style={{ color: freq.color }}>
                      {freq.hz < 100 ? freq.hz : Math.round(freq.hz)}
                    </div>
                    <div className="text-[8px] opacity-80 leading-none">Hz</div>
                  </div>
                </button>
              );
            })}
            
            {/* Center connection lines */}
            <div className="absolute bottom-[60px] left-[60px] w-1 h-1">
              {sacredFrequencies.map((_, index) => {
                const angle = (index * 360) / sacredFrequencies.length;
                const radius = 120;
                
                return (
                  <div
                    key={index}
                    className="absolute w-px bg-gradient-to-r from-primary/30 to-transparent origin-left"
                    style={{
                      height: '2px',
                      width: `${radius}px`,
                      transform: `rotate(${angle - 90}deg)`,
                      transformOrigin: '0 50%',
                      animation: showFrequencies ? `sacred-line-draw 0.8s ease-out ${index * 30}ms forwards` : undefined,
                      opacity: 0
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Main Control Buttons */}
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

          <Button
            onClick={toggleBackgroundTone}
            variant="outline"
            size="sm"
            className={`sacred-button bg-background/20 backdrop-blur-sm border-primary/30 hover:border-primary/60 ${isBackgroundPlaying ? 'bg-primary/20' : ''}`}
            title={isBackgroundPlaying ? "Stop Background Tone" : "Start Background Tone (while typing)"}
          >
            🎧
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