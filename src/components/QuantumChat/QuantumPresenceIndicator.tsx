import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Heart, 
  Eye, 
  Zap, 
  Waves, 
  Circle, 
  Triangle, 
  Hexagon,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useVoiceTranscription } from '@/hooks/useVoiceTranscription';

interface UserPresence {
  user_id: string;
  display_name?: string;
  consciousness_state: 'focused' | 'expanded' | 'meditative' | 'creative' | 'analytical';
  emotional_tone: 'joy' | 'calm' | 'excitement' | 'contemplation' | 'curiosity';
  resonance_frequency: number;
  aura_intensity: number;
  is_speaking: boolean;
  is_listening: boolean;
  last_activity: string;
  biometric_coherence?: number;
  sacred_geometry: 'circle' | 'triangle' | 'hexagon' | 'flower_of_life' | 'merkaba';
}

interface QuantumPresenceIndicatorProps {
  roomId: string;
  userPresences: UserPresence[];
  onPresenceUpdate?: (presence: Partial<UserPresence>) => void;
}

export const QuantumPresenceIndicator: React.FC<QuantumPresenceIndicatorProps> = ({
  roomId,
  userPresences,
  onPresenceUpdate
}) => {
  const { user } = useAuth();
  const [localPresence, setLocalPresence] = useState<UserPresence>({
    user_id: user?.id || '',
    consciousness_state: 'focused',
    emotional_tone: 'calm',
    resonance_frequency: 40,
    aura_intensity: 0.5,
    is_speaking: false,
    is_listening: false,
    last_activity: new Date().toISOString(),
    biometric_coherence: 0.7,
    sacred_geometry: 'circle'
  });

  const {
    isConnected,
    isMuted,
    connectedUsers,
    connect,
    disconnect,
    toggleMute,
    applyConsciousnessFilter
  } = useWebRTC({
    roomId,
    userId: user?.id || '',
    onUserJoined: (userId) => console.log('User joined:', userId),
    onUserLeft: (userId) => console.log('User left:', userId)
  });

  const {
    isListening,
    toggleListening,
    applyConsciousnessFilter: applyTranscriptionFilter
  } = useVoiceTranscription({
    onTranscription: (result) => {
      if (result.isFinal) {
        const filteredText = applyTranscriptionFilter(result.text, localPresence.consciousness_state);
        console.log('Transcribed:', filteredText);
      }
    }
  });

  // Update local presence when consciousness state changes
  useEffect(() => {
    if (user) {
      onPresenceUpdate?.(localPresence);
      applyConsciousnessFilter(localPresence.consciousness_state);
    }
  }, [localPresence, user, onPresenceUpdate, applyConsciousnessFilter]);

  const getConsciousnessIcon = (state: string) => {
    switch (state) {
      case 'focused': return <Eye className="w-4 h-4" />;
      case 'expanded': return <Brain className="w-4 h-4" />;
      case 'meditative': return <Circle className="w-4 h-4" />;
      case 'creative': return <Zap className="w-4 h-4" />;
      case 'analytical': return <Triangle className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getEmotionalIcon = (tone: string) => {
    switch (tone) {
      case 'joy': return '😊';
      case 'calm': return '😌';
      case 'excitement': return '🤩';
      case 'contemplation': return '🤔';
      case 'curiosity': return '🧐';
      default: return '😊';
    }
  };

  const getGeometryIcon = (geometry: string) => {
    switch (geometry) {
      case 'circle': return <Circle className="w-3 h-3" />;
      case 'triangle': return <Triangle className="w-3 h-3" />;
      case 'hexagon': return <Hexagon className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  const getAuraColor = (state: string, intensity: number) => {
    const baseColors = {
      focused: [79, 70, 229],      // Blue
      expanded: [124, 58, 237],    // Purple  
      meditative: [5, 150, 105],   // Green
      creative: [220, 38, 38],     // Red
      analytical: [8, 145, 178]    // Cyan
    };
    
    const [r, g, b] = baseColors[state as keyof typeof baseColors] || baseColors.focused;
    return `rgba(${r}, ${g}, ${b}, ${intensity})`;
  };

  const updateConsciousnessState = (state: UserPresence['consciousness_state']) => {
    setLocalPresence(prev => ({
      ...prev,
      consciousness_state: state,
      resonance_frequency: {
        focused: 40,
        expanded: 8,
        meditative: 4,
        creative: 15,
        analytical: 25
      }[state],
      last_activity: new Date().toISOString()
    }));
  };

  const updateEmotionalTone = (tone: UserPresence['emotional_tone']) => {
    setLocalPresence(prev => ({
      ...prev,
      emotional_tone: tone,
      last_activity: new Date().toISOString()
    }));
  };

  const simulateBiometricCoherence = () => {
    // Simulate heart rate variability and coherence measurement
    const coherence = 0.5 + (Math.random() * 0.5);
    setLocalPresence(prev => ({
      ...prev,
      biometric_coherence: coherence,
      aura_intensity: coherence,
      last_activity: new Date().toISOString()
    }));
  };

  // Simulate biometric updates
  useEffect(() => {
    const interval = setInterval(simulateBiometricCoherence, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Local User Controls */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-2">
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-full border-4 flex items-center justify-center"
            style={{ 
              borderColor: getAuraColor(localPresence.consciousness_state, localPresence.aura_intensity),
              backgroundColor: getAuraColor(localPresence.consciousness_state, 0.2)
            }}
          >
            {getConsciousnessIcon(localPresence.consciousness_state)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Your Quantum Presence</h3>
              <span className="text-lg">{getEmotionalIcon(localPresence.emotional_tone)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Waves className="w-3 h-3" />
              <span>{localPresence.resonance_frequency}Hz</span>
              {getGeometryIcon(localPresence.sacred_geometry)}
              <span>{Math.round(localPresence.biometric_coherence! * 100)}% coherence</span>
            </div>
          </div>
        </div>

        {/* Consciousness State Controls */}
        <div className="mb-3">
          <label className="text-sm font-medium mb-2 block">Consciousness State</label>
          <div className="flex gap-1 flex-wrap">
            {['focused', 'expanded', 'meditative', 'creative', 'analytical'].map((state) => (
              <Button
                key={state}
                variant={localPresence.consciousness_state === state ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateConsciousnessState(state as any)}
                className="text-xs"
              >
                {getConsciousnessIcon(state)}
                <span className="ml-1 capitalize">{state}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Emotional Tone Controls */}
        <div className="mb-3">
          <label className="text-sm font-medium mb-2 block">Emotional Resonance</label>
          <div className="flex gap-1 flex-wrap">
            {(['joy', 'calm', 'excitement', 'contemplation', 'curiosity'] as const).map((tone) => (
              <Button
                key={tone}
                variant={localPresence.emotional_tone === tone ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateEmotionalTone(tone)}
                className="text-xs"
              >
                <span className="mr-1">{getEmotionalIcon(tone)}</span>
                <span className="capitalize">{tone}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Voice Controls */}
        <div className="flex gap-2">
          <Button
            variant={isConnected ? 'default' : 'outline'}
            size="sm"
            onClick={isConnected ? disconnect : connect}
            className="flex-1"
          >
            {isConnected ? (
              <>
                <Volume2 className="w-4 h-4 mr-1" />
                Connected
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-1" />
                Connect Voice
              </>
            )}
          </Button>
          
          {isConnected && (
            <Button
              variant={isMuted ? 'destructive' : 'default'}
              size="sm"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          )}
          
          <Button
            variant={isListening ? 'default' : 'outline'}
            size="sm"
            onClick={() => toggleListening(true)}
          >
            {isListening ? (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs">Listening</span>
              </div>
            ) : (
              <>
                <Mic className="w-3 h-3 mr-1" />
                <span className="text-xs">Transcribe</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Other Users Presence */}
      {userPresences.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Quantum Field Participants ({userPresences.length})
          </h4>
          
          <div className="space-y-3">
            {userPresences.map((presence) => (
              <div key={presence.user_id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <div 
                  className="w-10 h-10 rounded-full border-3 flex items-center justify-center relative"
                  style={{ 
                    borderColor: getAuraColor(presence.consciousness_state, presence.aura_intensity),
                    backgroundColor: getAuraColor(presence.consciousness_state, 0.1)
                  }}
                >
                  {getConsciousnessIcon(presence.consciousness_state)}
                  
                  {/* Activity indicators */}
                  {presence.is_speaking && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  )}
                  {presence.is_listening && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm truncate">
                      {presence.display_name || `User ${presence.user_id.slice(0, 6)}`}
                    </span>
                    <span className="text-sm">{getEmotionalIcon(presence.emotional_tone)}</span>
                    <Badge variant="outline" className="text-xs">
                      {presence.consciousness_state}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Waves className="w-3 h-3" />
                      <span>{presence.resonance_frequency}Hz</span>
                    </div>
                    
                    {presence.biometric_coherence && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{Math.round(presence.biometric_coherence * 100)}%</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      {getGeometryIcon(presence.sacred_geometry)}
                      <span>{presence.sacred_geometry}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Voice Chat Status */}
      {isConnected && connectedUsers.length > 0 && (
        <Card className="p-3 bg-green-50 border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">
              Voice chat active with {connectedUsers.length} user{connectedUsers.length !== 1 ? 's' : ''}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};
