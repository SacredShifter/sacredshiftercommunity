import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoicePersonalityConfig {
  personality?: string;
  consciousnessState?: string;
  confidence?: number;
  emotionalTone?: 'warm' | 'neutral' | 'authoritative' | 'playful' | 'mystical';
  responseSpeed?: 'slow' | 'normal' | 'fast';
}

interface VoiceResponse {
  audioContent: string;
  personality?: string;
  consciousnessState?: string;
  voiceUsed?: string;
}

export function useVoicePersonality() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const { toast } = useToast();

  // Convert audio blob to base64
  const audioToBase64 = useCallback((blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }, []);

  // Transcribe audio to text
  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    setIsTranscribing(true);
    
    try {
      const base64Audio = await audioToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.text) {
        throw new Error('No transcription received');
      }

      console.log('Transcription successful:', data.text);
      return data.text;

    } catch (error: any) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsTranscribing(false);
    }
  }, [audioToBase64, toast]);

  // Generate voice audio from text with personality
  const generateVoiceAudio = useCallback(async (
    text: string, 
    config: VoicePersonalityConfig = {}
  ): Promise<VoiceResponse> => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('voice-synthesis', {
        body: {
          text,
          personality: config.personality,
          consciousnessState: config.consciousnessState,
          confidence: config.confidence || 0.8,
          useElevenLabs: true // Prefer ElevenLabs for personality
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.audioContent) {
        throw new Error('No audio content received');
      }

      console.log('Voice synthesis successful:', {
        personality: data.personality,
        consciousnessState: data.consciousnessState,
        voiceUsed: data.voiceUsed
      });

      return data as VoiceResponse;

    } catch (error: any) {
      console.error('Voice synthesis error:', error);
      toast({
        title: "Voice synthesis failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  // Play audio from base64 content
  const playAudioFromBase64 = useCallback((base64Audio: string) => {
    try {
      // Convert base64 to blob
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      
      const audio = new Audio(audioUrl);
      audio.play();
      
      // Clean up URL after playing
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(audioUrl);
      });
      
      return audio;
    } catch (error) {
      console.error('Audio playback error:', error);
      toast({
        title: "Playback failed",
        description: "Unable to play audio",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Analyze text for emotional content to suggest voice personality
  const analyzeTextEmotion = useCallback((text: string): VoicePersonalityConfig => {
    const lowerText = text.toLowerCase();
    
    // Simple emotion detection based on keywords
    if (lowerText.includes('wisdom') || lowerText.includes('guidance') || lowerText.includes('teach')) {
      return { 
        personality: 'guidance',
        emotionalTone: 'warm',
        responseSpeed: 'normal'
      };
    }
    
    if (lowerText.includes('create') || lowerText.includes('imagine') || lowerText.includes('art')) {
      return { 
        personality: 'creative_expression',
        emotionalTone: 'playful',
        responseSpeed: 'normal'
      };
    }
    
    if (lowerText.includes('feel') || lowerText.includes('heart') || lowerText.includes('love')) {
      return { 
        personality: 'empathic_resonance',
        emotionalTone: 'warm',
        responseSpeed: 'slow'
      };
    }
    
    if (lowerText.includes('question') || lowerText.includes('why') || lowerText.includes('think')) {
      return { 
        personality: 'socratic_dialogue',
        emotionalTone: 'neutral',
        responseSpeed: 'normal'
      };
    }
    
    if (lowerText.includes('power') || lowerText.includes('control') || lowerText.includes('decide')) {
      return { 
        personality: 'sovereign',
        emotionalTone: 'authoritative',
        responseSpeed: 'normal'
      };
    }
    
    // Default personality
    return { 
      personality: 'guidance',
      emotionalTone: 'warm',
      responseSpeed: 'normal'
    };
  }, []);

  return {
    // State
    isGenerating,
    isTranscribing,
    
    // Core functions
    transcribeAudio,
    generateVoiceAudio,
    playAudioFromBase64,
    
    // Utility functions
    analyzeTextEmotion,
    audioToBase64
  };
}