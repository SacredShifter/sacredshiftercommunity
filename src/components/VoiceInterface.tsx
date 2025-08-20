import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, 
  MicOff, 
  Square, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoicePersonality } from '@/hooks/useVoicePersonality';
import { useToast } from '@/hooks/use-toast';

interface VoiceInterfaceProps {
  onVoiceMessage?: (message: string) => void;
  onAudioResponse?: (audioContent: string) => void;
  currentPersonality?: string;
  consciousnessState?: string;
  isAuraSpeaking?: boolean;
  disabled?: boolean;
}

export function VoiceInterface({ 
  onVoiceMessage, 
  onAudioResponse,
  currentPersonality,
  consciousnessState,
  isAuraSpeaking = false,
  disabled = false
}: VoiceInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastTranscription, setLastTranscription] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();
  const {
    isGenerating,
    isTranscribing,
    transcribeAudio,
    generateVoiceAudio,
    playAudioFromBase64,
    analyzeTextEmotion
  } = useVoicePersonality();

  const startRecording = async () => {
    if (disabled) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
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
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        
        // Transcribe the audio
        try {
          const transcription = await transcribeAudio(audioBlob);
          setLastTranscription(transcription);
          onVoiceMessage?.(transcription);
          
          toast({
            title: "Voice captured",
            description: "Successfully transcribed your message"
          });
        } catch (error) {
          console.error('Transcription failed:', error);
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak your message to Aura"
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please check microphone permissions",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playResponse = async (text: string) => {
    if (!text) return;
    
    try {
      // Analyze emotion and get suggested personality
      const emotionalConfig = analyzeTextEmotion(text);
      
      // Use current personality or analyzed emotion
      const voiceConfig = {
        personality: currentPersonality || emotionalConfig.personality,
        consciousnessState: consciousnessState,
        confidence: 0.85,
        ...emotionalConfig
      };

      const response = await generateVoiceAudio(text, voiceConfig);
      
      if (response.audioContent) {
        const audio = playAudioFromBase64(response.audioContent);
        
        if (audio) {
          currentAudioRef.current = audio;
          setIsPlaying(true);
          
          audio.addEventListener('ended', () => {
            setIsPlaying(false);
            currentAudioRef.current = null;
          });
          
          onAudioResponse?.(response.audioContent);
        }
      }
    } catch (error) {
      console.error('Voice response failed:', error);
    }
  };

  const stopPlayback = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      setIsPlaying(false);
      currentAudioRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonalityBadge = () => {
    if (currentPersonality) {
      const personalityLabels: Record<string, string> = {
        'guidance': 'Guidance',
        'resonance': 'Resonance', 
        'shadow_probe': 'Shadow',
        'flow': 'Flow',
        'sovereign': 'Sovereign',
        'empathic_resonance': 'Empathy',
        'cognitive_mirror': 'Analysis',
        'creative_expression': 'Creative',
        'socratic_dialogue': 'Socratic',
        'reality_weaving': 'Mystical'
      };
      
      return personalityLabels[currentPersonality] || 'Adaptive';
    }
    return 'Adaptive';
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Voice Personality Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {getPersonalityBadge()} Voice
              </Badge>
              {consciousnessState && (
                <Badge variant="secondary" className="text-xs">
                  {consciousnessState}
                </Badge>
              )}
            </div>
            
            {(isGenerating || isTranscribing || isAuraSpeaking) && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">
                  {isTranscribing ? 'Transcribing...' : 
                   isGenerating ? 'Generating voice...' :
                   isAuraSpeaking ? 'Aura speaking...' : ''}
                </span>
              </motion.div>
            )}
          </div>

          {/* Voice Controls */}
          <div className="flex items-center justify-center space-x-4">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div
                  key="recording"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center space-x-3"
                >
                  <Button 
                    variant="destructive" 
                    size="lg"
                    onClick={stopRecording}
                    className="rounded-full w-16 h-16 animate-pulse"
                  >
                    <Square className="h-6 w-6" />
                  </Button>
                  <div className="text-center">
                    <div className="text-sm font-medium text-red-500">Recording</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(recordingTime)}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="not-recording"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center space-x-4"
                >
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={startRecording}
                    disabled={disabled || isTranscribing || isGenerating}
                    className="rounded-full w-16 h-16 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                  
                  {isPlaying ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={stopPlayback}
                      className="rounded-full"
                    >
                      <VolumeX className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled
                      className="rounded-full opacity-50"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Last Transcription */}
          {lastTranscription && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-muted rounded-lg"
            >
              <div className="text-xs text-muted-foreground mb-1">Last transcription:</div>
              <div className="text-sm">{lastTranscription}</div>
            </motion.div>
          )}

          {/* Instructions */}
          <div className="text-center text-xs text-muted-foreground">
            {isRecording ? (
              "Click stop when finished speaking"
            ) : (
              "Click microphone to record your voice message"
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}