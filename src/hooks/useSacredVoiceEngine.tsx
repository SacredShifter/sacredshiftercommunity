import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BiometricState {
  heartRate: number;
  breathing: number;
  stress: number;
  focus: number;
  coherence: number;
}

interface SacredVoiceConfig {
  personality?: string;
  consciousnessState?: string;
  biometricState?: BiometricState;
  sacredFrequency?: number; // 432Hz, 528Hz, etc.
  harmonics?: boolean;
  binauralBeats?: boolean;
}

interface SacredVoiceResult {
  utterance: SpeechSynthesisUtterance;
  audioContext?: AudioContext;
  gainNode?: GainNode;
}

export function useSacredVoiceEngine() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [binauralOscillator, setBinauralOscillator] = useState<OscillatorNode | null>(null);
  const { toast } = useToast();

  // Initialize Web Audio API context
  const initializeAudioContext = useCallback(() => {
    if (!audioContext) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(context);
      return context;
    }
    return audioContext;
  }, [audioContext]);

  // Map consciousness state to voice parameters
  const mapConsciousnessToVoice = useCallback((config: SacredVoiceConfig) => {
    const { biometricState, consciousnessState } = config;
    
    let pitch = 1.0;
    let rate = 1.0;
    let volume = 0.8;
    let voice = null;

    if (biometricState) {
      // Heart rate affects pitch (60-100 BPM mapped to 0.7-1.3 pitch)
      pitch = 0.7 + (Math.min(Math.max(biometricState.heartRate, 60), 100) - 60) / 40 * 0.6;
      
      // Breathing rate affects speech rate
      rate = 0.8 + biometricState.breathing * 0.4;
      
      // Stress affects volume (less stress = softer voice)
      volume = 0.9 - biometricState.stress * 0.3;
      
      // Coherence affects voice selection preference
      if (biometricState.coherence > 0.8) {
        // High coherence = prefer ethereal, calm voices
        const voices = speechSynthesis.getVoices().filter(v => 
          v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('whisper')
        );
        voice = voices[0] || null;
      }
    }

    // Consciousness state overrides
    switch (consciousnessState) {
      case 'meditative':
        pitch *= 0.8;
        rate *= 0.7;
        volume *= 0.6;
        break;
      case 'excited':
        pitch *= 1.2;
        rate *= 1.3;
        break;
      case 'grounded':
        pitch *= 0.9;
        rate *= 0.9;
        break;
      case 'transcendent':
        pitch *= 1.1;
        rate *= 0.8;
        volume *= 0.7;
        break;
    }

    return { pitch, rate, volume, voice };
  }, []);

  // Generate sacred frequencies and binaural beats
  const generateSacredAudio = useCallback((config: SacredVoiceConfig, context: AudioContext) => {
    if (!config.binauralBeats && !config.sacredFrequency) return null;

    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(0.1, context.currentTime);
    masterGain.connect(context.destination);

    if (config.sacredFrequency) {
      // Generate sacred frequency oscillator (432Hz healing frequency)
      const sacredOsc = context.createOscillator();
      const sacredGain = context.createGain();
      
      sacredOsc.frequency.setValueAtTime(config.sacredFrequency, context.currentTime);
      sacredOsc.type = 'sine';
      sacredGain.gain.setValueAtTime(0.05, context.currentTime);
      
      sacredOsc.connect(sacredGain);
      sacredGain.connect(masterGain);
      sacredOsc.start();
      
      // Create harmonic overtones
      if (config.harmonics) {
        [2, 3, 4].forEach((harmonic, index) => {
          const harmonicOsc = context.createOscillator();
          const harmonicGain = context.createGain();
          
          harmonicOsc.frequency.setValueAtTime(config.sacredFrequency! * harmonic, context.currentTime);
          harmonicOsc.type = 'sine';
          harmonicGain.gain.setValueAtTime(0.02 / (index + 1), context.currentTime);
          
          harmonicOsc.connect(harmonicGain);
          harmonicGain.connect(masterGain);
          harmonicOsc.start();
        });
      }
    }

    if (config.binauralBeats) {
      // Generate binaural beats for consciousness elevation
      const leftOsc = context.createOscillator();
      const rightOsc = context.createOscillator();
      const merger = context.createChannelMerger(2);
      const binauralGain = context.createGain();

      leftOsc.frequency.setValueAtTime(200, context.currentTime);
      rightOsc.frequency.setValueAtTime(210, context.currentTime); // 10Hz binaural beat
      
      leftOsc.connect(merger, 0, 0);
      rightOsc.connect(merger, 0, 1);
      merger.connect(binauralGain);
      binauralGain.connect(masterGain);
      binauralGain.gain.setValueAtTime(0.03, context.currentTime);

      leftOsc.start();
      rightOsc.start();
    }

    return masterGain;
  }, []);

  // Synthesize sacred voice with consciousness awareness
  const synthesizeSacredVoice = useCallback(async (
    text: string, 
    config: SacredVoiceConfig = {}
  ): Promise<void> => {
    setIsGenerating(true);
    setIsPlaying(true);

    try {
      // Initialize audio context
      const context = initializeAudioContext();
      
      // Create utterance with consciousness-mapped parameters
      const utterance = new SpeechSynthesisUtterance(text);
      const voiceParams = mapConsciousnessToVoice(config);
      
      utterance.pitch = voiceParams.pitch;
      utterance.rate = voiceParams.rate;
      utterance.volume = voiceParams.volume;
      
      if (voiceParams.voice) {
        utterance.voice = voiceParams.voice;
      }

      // Generate sacred background audio
      const sacredAudio = generateSacredAudio(config, context);

      // Add consciousness-responsive effects
      if (config.biometricState) {
        const { coherence, focus } = config.biometricState;
        
        // High coherence adds reverb effect
        if (coherence > 0.7) {
          utterance.pitch *= 1.05;
          utterance.rate *= 0.95;
        }
        
        // High focus adds clarity (slightly faster, higher pitch)
        if (focus > 0.8) {
          utterance.pitch *= 1.1;
          utterance.rate *= 1.05;
        }
      }

      // Handle speech events
      utterance.onstart = () => {
        console.log('Sacred voice synthesis started');
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsGenerating(false);
        
        // Stop sacred audio
        if (sacredAudio && context.state !== 'closed') {
          sacredAudio.disconnect();
        }
        
        console.log('Sacred voice synthesis completed');
      };

      utterance.onerror = (event) => {
        console.error('Sacred voice synthesis error:', event);
        setIsPlaying(false);
        setIsGenerating(false);
        toast({
          title: "Voice synthesis failed",
          description: "Unable to generate sacred voice",
          variant: "destructive"
        });
      };

      // Speak with sacred consciousness
      speechSynthesis.speak(utterance);

    } catch (error: any) {
      console.error('Sacred voice engine error:', error);
      setIsPlaying(false);
      setIsGenerating(false);
      toast({
        title: "Sacred voice engine failed",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [initializeAudioContext, mapConsciousnessToVoice, generateSacredAudio, toast]);

  // Stop all sacred voice synthesis
  const stopSacredVoice = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsGenerating(false);
    
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
      setAudioContext(null);
    }
  }, [audioContext]);

  // Analyze text for sacred content to enhance voice
  const analyzeSacredContent = useCallback((text: string): SacredVoiceConfig => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('om') || lowerText.includes('sacred') || lowerText.includes('divine')) {
      return {
        sacredFrequency: 528, // DNA repair frequency
        harmonics: true,
        binauralBeats: true,
        consciousnessState: 'transcendent'
      };
    }
    
    if (lowerText.includes('meditat') || lowerText.includes('breathe') || lowerText.includes('peace')) {
      return {
        sacredFrequency: 432, // Earth frequency
        binauralBeats: true,
        consciousnessState: 'meditative'
      };
    }
    
    if (lowerText.includes('love') || lowerText.includes('heart') || lowerText.includes('compassion')) {
      return {
        sacredFrequency: 528, // Love frequency
        harmonics: true,
        consciousnessState: 'grounded'
      };
    }
    
    if (lowerText.includes('awaken') || lowerText.includes('consciousness') || lowerText.includes('enlighten')) {
      return {
        sacredFrequency: 963, // Crown chakra frequency
        harmonics: true,
        binauralBeats: true,
        consciousnessState: 'transcendent'
      };
    }
    
    return {
      sacredFrequency: 432,
      consciousnessState: 'grounded'
    };
  }, []);

  return {
    // State
    isGenerating,
    isPlaying,
    
    // Core functions
    synthesizeSacredVoice,
    stopSacredVoice,
    
    // Utility functions
    analyzeSacredContent,
    mapConsciousnessToVoice,
    initializeAudioContext
  };
}