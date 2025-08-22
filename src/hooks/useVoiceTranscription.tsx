import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VoiceTranscriptionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
  language?: string;
}

interface UseVoiceTranscriptionProps {
  onTranscription: (result: VoiceTranscriptionResult) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
}

export const useVoiceTranscription = ({
  onTranscription,
  onError,
  language = 'en-US',
  continuous = true
}: UseVoiceTranscriptionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize speech recognition (browser-based)
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      onError?.('Speech recognition not supported in this browser');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          onTranscription({
            text: transcript,
            confidence: confidence || 0.8,
            isFinal: true,
            language
          });
        } else {
          interimTranscript += transcript;
          onTranscription({
            text: transcript,
            confidence: confidence || 0.5,
            isFinal: false,
            language
          });
        }
      }

      setCurrentTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      onError?.(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return true;
  }, [continuous, language, onTranscription, onError]);

  // Enhanced audio recording for server-side transcription
  const initializeAudioRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await processAudioWithOpenAI(audioBlob);
          audioChunksRef.current = [];
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      return true;
    } catch (error) {
      console.error('Error initializing audio recording:', error);
      onError?.('Could not access microphone for voice transcription');
      return false;
    }
  }, [onError]);

  // Process audio with OpenAI Whisper via Supabase Edge Function
  const processAudioWithOpenAI = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert blob to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });

      if (error) throw error;

      if (data.text) {
        onTranscription({
          text: data.text,
          confidence: 0.9, // OpenAI Whisper typically has high confidence
          isFinal: true,
          language: data.language || language
        });
      }
    } catch (error) {
      console.error('Error processing audio with OpenAI:', error);
      onError?.('Failed to transcribe audio');
    } finally {
      setIsProcessing(false);
    }
  }, [language, onTranscription, onError]);

  // Start voice transcription
  const startListening = useCallback(async (useServerTranscription = false) => {
    if (isListening) return;

    try {
      if (useServerTranscription) {
        // Use server-side transcription with OpenAI Whisper
        const initialized = await initializeAudioRecording();
        if (!initialized) return;

        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.start(1000); // Capture audio chunks every second
          setIsListening(true);
          toast.success('Voice transcription started (AI-powered)');
        }
      } else {
        // Use browser-based speech recognition
        const initialized = initializeSpeechRecognition();
        if (!initialized) return;

        if (recognitionRef.current) {
          recognitionRef.current.start();
          toast.success('Voice transcription started (browser)');
        }
      }
    } catch (error) {
      console.error('Error starting voice transcription:', error);
      onError?.('Failed to start voice transcription');
    }
  }, [isListening, initializeAudioRecording, initializeSpeechRecognition, onError]);

  // Stop voice transcription
  const stopListening = useCallback(() => {
    if (!isListening) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsListening(false);
    setCurrentTranscript('');
    toast.info('Voice transcription stopped');
  }, [isListening]);

  // Toggle listening state
  const toggleListening = useCallback((useServerTranscription = false) => {
    if (isListening) {
      stopListening();
    } else {
      startListening(useServerTranscription);
    }
  }, [isListening, startListening, stopListening]);

  // Apply consciousness-aware transcription filters
  const applyConsciousnessFilter = useCallback((text: string, consciousnessState: string): string => {
    // Apply different processing based on consciousness state
    switch (consciousnessState) {
      case 'meditative':
        // Enhance spiritual and contemplative words
        return text.replace(/\b(peace|calm|center|breath|flow)\b/gi, (match) => `✨${match}✨`);
      
      case 'creative':
        // Enhance creative and artistic expressions
        return text.replace(/\b(imagine|create|vision|dream|inspire)\b/gi, (match) => `🎨${match}🎨`);
      
      case 'analytical':
        // Enhance logical and analytical terms
        return text.replace(/\b(analyze|logic|reason|understand|process)\b/gi, (match) => `🧠${match}🧠`);
      
      case 'expanded':
        // Enhance expanded consciousness terms
        return text.replace(/\b(universe|cosmic|infinite|transcend|elevate)\b/gi, (match) => `🌌${match}🌌`);
      
      default:
        return text;
    }
  }, []);

  return {
    isListening,
    isProcessing,
    currentTranscript,
    startListening,
    stopListening,
    toggleListening,
    applyConsciousnessFilter
  };
};