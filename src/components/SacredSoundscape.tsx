import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

export const SacredSoundscape = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const createSacredTone = async (frequency: number = 528) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      // Resume context if suspended (required by browsers)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      // Create oscillator for sacred frequency
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Set frequency (528 Hz = Love Frequency)
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      // Set very low volume for ambient effect
      gainNode.gain.value = 0.02;
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      // Start the tone
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
      } catch (error) {
        // Oscillator already stopped
      }
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
      const result = await createSacredTone(528); // Love frequency
      if (result) {
        setIsPlaying(true);
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

  return (
    <div className="fixed bottom-20 left-4 z-50">
      <Button
        onClick={toggleSacredSound}
        variant="outline"
        size="sm"
        className="sacred-button bg-background/20 backdrop-blur-sm border-primary/30 hover:border-primary/60"
        title={isPlaying ? "Silence the Sacred Tone" : "Activate Sacred Soundscape (528Hz)"}
      >
        {isPlaying ? (
          <Volume2 className="h-4 w-4 text-primary" />
        ) : (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};