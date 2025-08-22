import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Zap, Brain, Heart, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface QuantumMessage {
  id: string;
  sender_id: string;
  content: string;
  position: [number, number, number];
  consciousness_state: 'focused' | 'expanded' | 'meditative' | 'creative' | 'analytical';
  resonance_frequency: number;
  emotional_tone: 'joy' | 'calm' | 'excitement' | 'contemplation' | 'curiosity';
  sacred_geometry: 'circle' | 'triangle' | 'hexagon' | 'flower_of_life' | 'merkaba';
  created_at: string;
  entanglement_level: number;
  sender_profile?: {
    display_name?: string;
    consciousness_level?: number;
  };
}

interface UserPresence {
  user_id: string;
  position: [number, number, number];
  consciousness_state: string;
  aura_color: string;
  is_typing: boolean;
  last_seen: string;
}

interface QuantumChatCoreProps {
  roomId: string;
  onClose?: () => void;
}

const QuantumMessageBubble: React.FC<{ 
  message: QuantumMessage; 
  isOwn: boolean;
  onClick: () => void;
}> = ({ message, isOwn, onClick }) => {
  const getColorFromState = (state: string) => {
    switch (state) {
      case 'focused': return '#4F46E5';
      case 'expanded': return '#7C3AED';
      case 'meditative': return '#059669';
      case 'creative': return '#DC2626';
      case 'analytical': return '#0891B2';
      default: return '#6366F1';
    }
  };

  const getGeometryFromType = (type: string) => {
    switch (type) {
      case 'circle': return 'rounded-full';
      case 'triangle': return 'rounded-none clip-triangle';
      case 'hexagon': return 'rounded-lg clip-hexagon';
      default: return 'rounded-xl';
    }
  };

  return (
    <mesh position={message.position} onClick={onClick}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial 
        color={getColorFromState(message.consciousness_state)}
        transparent 
        opacity={0.8}
        emissive={getColorFromState(message.consciousness_state)}
        emissiveIntensity={message.entanglement_level * 0.3}
      />
      <Html distanceFactor={10}>
        <div className={`
          max-w-xs p-3 shadow-lg backdrop-blur-sm
          ${isOwn ? 'bg-primary/90 text-primary-foreground' : 'bg-background/90 border'}
          ${getGeometryFromType(message.sacred_geometry)}
          transform -translate-x-1/2 -translate-y-1/2
        `}>
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getColorFromState(message.consciousness_state) }}
            />
            <Badge variant="outline" className="text-xs">
              {message.emotional_tone}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs opacity-70">
              {new Date(message.created_at).toLocaleTimeString()}
            </span>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span className="text-xs">{message.resonance_frequency}Hz</span>
            </div>
          </div>
        </div>
      </Html>
    </mesh>
  );
};

const UserPresenceOrb: React.FC<{ presence: UserPresence }> = ({ presence }) => {
  return (
    <mesh position={presence.position}>
      <sphereGeometry args={[0.3, 8, 8]} />
      <meshStandardMaterial 
        color={presence.aura_color}
        transparent 
        opacity={0.6}
        emissive={presence.aura_color}
        emissiveIntensity={0.4}
      />
      <Html distanceFactor={15}>
        <div className="bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 border transform -translate-x-1/2 -translate-y-full mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: presence.aura_color }}
            />
            <span className="text-xs">User {presence.user_id.slice(0, 6)}</span>
            {presence.is_typing && (
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            )}
          </div>
        </div>
      </Html>
    </mesh>
  );
};

export const QuantumChatCore: React.FC<QuantumChatCoreProps> = ({ roomId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<QuantumMessage[]>([]);
  const [userPresences, setUserPresences] = useState<UserPresence[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [consciousnessState, setConsciousnessState] = useState<QuantumMessage['consciousness_state']>('focused');
  const [emotionalTone, setEmotionalTone] = useState<QuantumMessage['emotional_tone']>('calm');
  const [selectedMessage, setSelectedMessage] = useState<QuantumMessage | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userPosition, setUserPosition] = useState<[number, number, number]>([0, 0, 0]);
  
  const channelRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Generate random position for new messages
  const generateMessagePosition = (): [number, number, number] => {
    const radius = 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    return [x, y, z];
  };

  // Calculate resonance frequency based on consciousness state and content
  const calculateResonanceFrequency = (state: string, content: string): number => {
    const baseFrequencies = {
      focused: 40,
      expanded: 8,
      meditative: 4,
      creative: 15,
      analytical: 25
    };
    const contentModifier = content.length * 0.1;
    return Math.round((baseFrequencies[state as keyof typeof baseFrequencies] + contentModifier) * 10) / 10;
  };

  // Generate entanglement level based on message synchronicity
  const calculateEntanglementLevel = (content: string, recentMessages: QuantumMessage[]): number => {
    const keywords = content.toLowerCase().split(' ');
    let synchronicityScore = 0;
    
    recentMessages.slice(-5).forEach(msg => {
      const msgKeywords = msg.content.toLowerCase().split(' ');
      keywords.forEach(keyword => {
        if (msgKeywords.includes(keyword) && keyword.length > 3) {
          synchronicityScore += 0.2;
        }
      });
    });
    
    return Math.min(Math.max(synchronicityScore, 0.1), 1.0);
  };

  // Update user presence
  const updateUserPresence = async () => {
    if (!user || !channelRef.current) return;

    const presence = {
      user_id: user.id,
      position: userPosition,
      consciousness_state: consciousnessState,
      aura_color: getAuraColor(consciousnessState),
      is_typing: isTyping,
      last_seen: new Date().toISOString()
    };

    await channelRef.current.track(presence);
  };

  const getAuraColor = (state: string): string => {
    switch (state) {
      case 'focused': return '#4F46E5';
      case 'expanded': return '#7C3AED';
      case 'meditative': return '#059669';
      case 'creative': return '#DC2626';
      case 'analytical': return '#0891B2';
      default: return '#6366F1';
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to messages - use any type until database types are updated
    const messagesChannel = supabase
      .channel(`quantum_chat_${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quantum_messages' as any,
        filter: `room_id=eq.${roomId}`
      }, (payload) => {
        const newMsg = payload.new as QuantumMessage;
        setMessages(prev => [...prev, newMsg]);
        
        // Check for synchronicity
        if (newMsg.entanglement_level > 0.7) {
          toast.success('🌌 Quantum entanglement detected!', {
            description: 'Your consciousness frequencies are aligning...'
          });
        }
      })
      .subscribe();

    // Subscribe to presence updates
    const presenceChannel = supabase
      .channel(`quantum_presence_${roomId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const presences: UserPresence[] = [];
        
        Object.keys(state).forEach(key => {
          const presenceArray = state[key];
          if (presenceArray && presenceArray.length > 0) {
            const presenceData = presenceArray[0];
            // Ensure we have valid UserPresence data with all required properties
            if (presenceData && 
                typeof presenceData === 'object' &&
                'user_id' in presenceData && 
                'position' in presenceData && 
                'consciousness_state' in presenceData &&
                'aura_color' in presenceData &&
                'is_typing' in presenceData &&
                'last_seen' in presenceData &&
                presenceData.user_id !== user.id) {
              presences.push(presenceData as UserPresence);
            }
          }
        });
        
        setUserPresences(presences);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('New user joined quantum space:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left quantum space:', leftPresences);
      })
      .subscribe();

    channelRef.current = presenceChannel;

    // Initial presence update
    setTimeout(() => updateUserPresence(), 1000);

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [user, roomId, userPosition, consciousnessState, isTyping]);

  // Handle typing indicators
  const handleTyping = (value: string) => {
    setNewMessage(value);
    
    if (!isTyping) {
      setIsTyping(true);
      updateUserPresence();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      updateUserPresence();
    }, 1000);
  };

  // Send quantum message
  const sendQuantumMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const position = generateMessagePosition();
    const resonanceFreq = calculateResonanceFrequency(consciousnessState, newMessage);
    const entanglementLevel = calculateEntanglementLevel(newMessage, messages);

    const quantumMessage = {
      room_id: roomId,
      sender_id: user.id,
      content: newMessage.trim(),
      position,
      consciousness_state: consciousnessState,
      resonance_frequency: resonanceFreq,
      emotional_tone: emotionalTone,
      sacred_geometry: 'circle' as const,
      entanglement_level: entanglementLevel,
      created_at: new Date().toISOString()
    };

    try {
      // Direct insert using any type until database types are updated
      const { error } = await supabase
        .from('quantum_messages' as any)
        .insert(quantumMessage);
      
      if (error) throw error;

      setNewMessage('');
      setIsTyping(false);
      updateUserPresence();
      
      toast.success('✨ Quantum message transmitted', {
        description: `Resonating at ${resonanceFreq}Hz`
      });
    } catch (error) {
      console.error('Error sending quantum message:', error);
      toast.error('Failed to transmit quantum message');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* 3D Quantum Space */}
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.4} color="#7C3AED" />
          
          {/* Quantum Messages */}
          {messages.map((message) => (
            <QuantumMessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender_id === user?.id}
              onClick={() => setSelectedMessage(message)}
            />
          ))}
          
          {/* User Presence Orbs */}
          {userPresences.map((presence) => (
            <UserPresenceOrb key={presence.user_id} presence={presence} />
          ))}
          
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
          />
        </Canvas>

        {/* Selected Message Details */}
        {selectedMessage && (
          <Card className="absolute top-4 right-4 p-4 bg-background/90 backdrop-blur-sm border-2 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">{selectedMessage.consciousness_state}</Badge>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(null)}>
                ×
              </Button>
            </div>
            <p className="text-sm mb-3">{selectedMessage.content}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                <span>{selectedMessage.consciousness_state}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{selectedMessage.emotional_tone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>{selectedMessage.resonance_frequency}Hz</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{Math.round(selectedMessage.entanglement_level * 100)}%</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Consciousness Controls */}
      <Card className="m-4 p-4 bg-background/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium">Consciousness State:</span>
          <div className="flex gap-1">
            {['focused', 'expanded', 'meditative', 'creative', 'analytical'].map((state) => (
              <Button
                key={state}
                variant={consciousnessState === state ? 'default' : 'outline'}
                size="sm"
                onClick={() => setConsciousnessState(state as any)}
                className="text-xs"
              >
                {state}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium">Emotional Tone:</span>
          <div className="flex gap-1">
            {['joy', 'calm', 'excitement', 'contemplation', 'curiosity'].map((tone) => (
              <Button
                key={tone}
                variant={emotionalTone === tone ? 'default' : 'outline'}
                size="sm"
                onClick={() => setEmotionalTone(tone as any)}
                className="text-xs"
              >
                {tone}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Transmit your quantum thoughts..."
            onKeyPress={(e) => e.key === 'Enter' && sendQuantumMessage()}
            className="flex-1"
          />
          <Button onClick={sendQuantumMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};