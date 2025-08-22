import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useDirectMessages } from '@/hooks/useDirectMessages';
import { usePersonalSignature } from '@/hooks/usePersonalSignature';
import { useAuth } from '@/hooks/useAuth';
import { useAuraPlatformIntegration } from '@/hooks/useAuraPlatformIntegration';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Smile, Mic, Heart, Brain, Eye, Zap, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { formatDistance } from 'date-fns/formatDistance';
import { toast } from 'sonner';
import { SacredVoiceInterface } from './SacredVoiceInterface';
import { SacredSigilPicker } from './SacredSigilPicker';
import { useSacredSigilEngine } from '@/hooks/useSacredSigilEngine';
import { SacredSigil } from '@/types/sacredSigils';

interface ConsciousnessState {
  energy: number; // 0-1
  coherence: number; // 0-1
  anxiety: number; // 0-1
  clarity: number; // 0-1
  breathing: number; // breaths per minute
}

interface SacredMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  consciousness_state: ConsciousnessState;
  aura_color: string;
  sacred_geometry: string;
  resonance_frequency: number;
  synchronicity_threads: string[];
}

interface SacredQuantumMessageProps {
  selectedUserId: string | null;
  onBack: () => void;
}

export const SacredQuantumMessageInterface: React.FC<SacredQuantumMessageProps> = ({
  selectedUserId,
  onBack
}) => {
  const { user } = useAuth();
  const { signature, getPersonalizedContent } = usePersonalSignature();
  const auraPlatform = useAuraPlatformIntegration();
  const { createSacredMessage, alchemizeMessage, consciousness, getRecommendedSigils } = useSacredSigilEngine();
  
  const {
    messages,
    sendMessage,
    loading,
    isTyping
  } = useDirectMessages(selectedUserId || undefined);

  const [newMessage, setNewMessage] = useState('');
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState>({
    energy: 0.7,
    coherence: 0.8,
    anxiety: 0.2,
    clarity: 0.9,
    breathing: 14
  });
  const [groupCoherence, setGroupCoherence] = useState(0);
  const [synchronicityThreads, setSynchronicityThreads] = useState<string[]>([]);
  const [showQuantumView, setShowQuantumView] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();

  // Simulate biometric consciousness state detection
  useEffect(() => {
    if (!signature) return;

    const updateConsciousnessFromBiometrics = () => {
      const { energeticFrequency, coherenceIndex, temperament } = signature;
      
      setConsciousnessState(prev => ({
        energy: energeticFrequency,
        coherence: coherenceIndex,
        anxiety: temperament === 'dynamic' ? 0.6 : 0.2,
        clarity: coherenceIndex,
        breathing: temperament === 'contemplative' ? 12 : 16
      }));
    };

    const interval = setInterval(updateConsciousnessFromBiometrics, 2000);
    return () => clearInterval(interval);
  }, [signature]);

  // Calculate group coherence from multiple users' consciousness states
  useEffect(() => {
    // Simulate group coherence calculation
    const calculateGroupCoherence = () => {
      const baseCoherence = consciousnessState.coherence;
      const variation = Math.sin(Date.now() / 1000) * 0.1;
      setGroupCoherence(Math.max(0, Math.min(1, baseCoherence + variation)));
    };

    const interval = setInterval(calculateGroupCoherence, 1000);
    return () => clearInterval(interval);
  }, [consciousnessState]);

  // Detect synchronicity threads with Aura AI
  useEffect(() => {
    const detectSynchronicity = async () => {
      if (messages.length < 2) return;

      try {
        const recentMessages = messages.slice(-5);
        // Simulate semantic connections for now
        const connections: any[] = [];

        setSynchronicityThreads(connections.map(c => c.id));
      } catch (error) {
        console.error('Synchronicity detection failed:', error);
      }
    };

    detectSynchronicity();
  }, [messages]);

  // Breath-synced animation controls
  useEffect(() => {
    const breatheAnimation = async () => {
      const breathCycle = 60000 / consciousnessState.breathing; // ms per breath
      
      await controls.start({
        scale: [1, 1.02, 1],
        transition: { 
          duration: breathCycle / 1000,
          ease: "easeInOut",
          repeat: Infinity
        }
      });
    };

    breatheAnimation();
  }, [consciousnessState.breathing, controls]);

  // Sacred geometry background based on group coherence
  const getSacredGeometry = useCallback(() => {
    if (groupCoherence > 0.9) return 'flower-of-life';
    if (groupCoherence > 0.7) return 'seed-of-life';
    if (groupCoherence > 0.5) return 'merkaba';
    if (groupCoherence > 0.3) return 'hexagon';
    return 'circle';
  }, [groupCoherence]);

  // Message physics based on consciousness state
  const getMessagePhysics = useCallback((isOwn: boolean) => {
    if (consciousnessState.anxiety > 0.6) {
      return {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { type: "spring" as const, stiffness: 300, damping: 15 }
        },
        exit: { opacity: 0, y: -20, scale: 0.9 }
      };
    }

    if (consciousnessState.energy < 0.3) {
      return {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] as const }
        },
        exit: { opacity: 0, y: -20, scale: 0.9 }
      };
    }

    // Calm state - golden ratio timing
    return {
      initial: { opacity: 0, y: 20, scale: 0.9 },
      animate: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 1.618, ease: "easeOut" as const }
      },
      exit: { opacity: 0, y: -20, scale: 0.9 }
    };
  }, [consciousnessState]);

  // Aura color based on consciousness state
  const getAuraColor = useCallback(() => {
    const { energy, coherence, clarity } = consciousnessState;
    
    if (coherence > 0.8 && clarity > 0.8) return 'hsl(280, 80%, 70%)'; // Violet - high consciousness
    if (energy > 0.7) return 'hsl(45, 95%, 65%)'; // Golden - high energy
    if (clarity > 0.7) return 'hsl(200, 85%, 70%)'; // Blue - mental clarity
    return 'hsl(140, 70%, 60%)'; // Green - balanced
  }, [consciousnessState]);

  // Handle message sending with consciousness metadata
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    try {
      // Transform emojis to sigils and create sacred message
      const { content: alchemizedContent } = alchemizeMessage(newMessage.trim());
      
      await sendMessage(selectedUserId, alchemizedContent, 'text', {
        consciousness_state: consciousnessState,
        aura_color: getAuraColor(),
        sacred_geometry: getSacredGeometry(),
        resonance_frequency: 40 + (consciousnessState.energy * 20),
        synchronicity_threads: synchronicityThreads
      });

      setNewMessage('');
      
      // Sacred feedback
      toast.success('✨ Sacred message transmitted with sigil resonance', {
        description: `Resonating at ${Math.round(40 + (consciousnessState.energy * 20))}Hz`
      });
    } catch (error) {
      toast.error('Sacred transmission interrupted');
    }
  };

  const handleSigilSelect = (sigil: SacredSigil) => {
    setNewMessage(prev => prev + sigil.symbol);
    inputRef.current?.focus();
  };

  // Render sacred geometry background
  const renderSacredGeometry = () => {
    const geometry = getSacredGeometry();
    const opacity = groupCoherence * 0.3;

    return (
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at center, ${getAuraColor()}10 0%, transparent 70%)`,
          opacity
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`w-96 h-96 opacity-20 ${
              geometry === 'flower-of-life' ? 'sacred-flower-of-life' :
              geometry === 'seed-of-life' ? 'sacred-seed-of-life' :
              geometry === 'merkaba' ? 'sacred-merkaba' :
              geometry === 'hexagon' ? 'sacred-hexagon' :
              'sacred-circle'
            }`}
          />
        </div>
      </div>
    );
  };

  if (!selectedUserId) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">Sacred Connection Portal</h3>
          <p className="text-muted-foreground mb-4">
            Select a soul to begin consciousness-synchronized communication
          </p>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-full flex flex-col relative overflow-hidden"
      animate={controls}
    >
      {/* Sacred Geometry Background */}
      {renderSacredGeometry()}

      {/* Header with Consciousness Indicators */}
      <Card className="m-4 p-4 bg-background/80 backdrop-blur-md border-primary/20 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  SS
                </AvatarFallback>
              </Avatar>
              <div 
                className="absolute -inset-1 rounded-full animate-pulse"
                style={{ 
                  background: `conic-gradient(from 0deg, ${getAuraColor()}, transparent, ${getAuraColor()})`,
                  opacity: consciousnessState.coherence
                }}
              />
            </div>
            <div>
              <h3 className="font-medium">Sacred Seeker</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Coherence: {Math.round(groupCoherence * 100)}%
                </Badge>
                {synchronicityThreads.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    ⚡ {synchronicityThreads.length} sync threads
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={showQuantumView ? "default" : "outline"}
              size="sm"
              onClick={() => setShowQuantumView(!showQuantumView)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Consciousness State Indicators */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Energy</div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-400 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${consciousnessState.energy * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Coherence</div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${consciousnessState.coherence * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Clarity</div>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${consciousnessState.clarity * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Breath</div>
            <div className="text-sm font-medium text-primary">
              {consciousnessState.breathing}/min
            </div>
          </div>
        </div>
      </Card>

      {/* Messages Container with Consciousness-Responsive Physics */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-4 relative z-10"
        style={{
          scrollBehavior: consciousnessState.energy > 0.7 ? 'auto' : 'smooth',
          scrollbarWidth: 'thin'
        }}
      >
          <AnimatePresence>
            {messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              const physics = getMessagePhysics(isOwn);
              const hasSync = synchronicityThreads.some(thread => 
                message.content.toLowerCase().includes(thread.toLowerCase())
              );

              return (
                <motion.div
                  key={message.id}
                  className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  initial={physics.initial}
                  animate={physics.animate}
                  exit={physics.exit}
                >
                <div className={`max-w-xs lg:max-w-md relative ${isOwn ? 'ml-8' : 'mr-8'}`}>
                  {/* Synchronicity Thread Indicator */}
                  {hasSync && (
                    <motion.div
                      className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Message Bubble with Consciousness-Responsive Styling */}
                  <motion.div
                    className={`
                      px-4 py-3 rounded-2xl relative overflow-hidden
                      ${isOwn ? 
                        'bg-primary text-primary-foreground ml-auto' : 
                        'bg-background/80 backdrop-blur-sm border border-border/50'
                      }
                    `}
                    style={{
                      boxShadow: isOwn ? 
                        `0 0 20px ${getAuraColor()}40` : 
                        '0 4px 12px rgba(0,0,0,0.1)',
                      transform: consciousnessState.anxiety > 0.6 ? 
                        `rotate(${Math.random() * 2 - 1}deg)` : 'none'
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Consciousness Aura */}
                    {isOwn && (
                      <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `radial-gradient(circle at center, ${getAuraColor()}40, transparent)`
                        }}
                      />
                    )}
                    
                    <p className="text-sm leading-relaxed relative z-10">
                      {message.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2 relative z-10">
                      <span className="text-xs opacity-70">
                        {formatDistance(new Date(message.created_at), new Date(), { addSuffix: true })}
                      </span>
                      
                      {/* Consciousness Indicators */}
                      <div className="flex items-center gap-1">
                        {hasSync && <Zap className="w-3 h-3 text-yellow-400" />}
                        {message.metadata && typeof message.metadata === 'object' && 'resonance_frequency' in message.metadata && (
                          <span className="text-xs opacity-70">
                            {Math.round(Number(message.metadata.resonance_frequency))}Hz
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Floating Sacred Input Pod */}
      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent relative z-20">
        <Card className="p-4 bg-background/80 backdrop-blur-md border-primary/20">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-3">
                <SacredSigilPicker onSigilSelect={handleSigilSelect} />
                <Button variant="ghost" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
                
                {/* Live Consciousness State Indicator */}
                <div className="flex items-center gap-2 ml-auto">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: getAuraColor() }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {consciousnessState.coherence > 0.8 ? 'Coherent' :
                     consciousnessState.energy > 0.7 ? 'Energized' :
                     consciousnessState.clarity > 0.7 ? 'Clear' : 'Balanced'}
                  </span>
                </div>
              </div>
              
              <motion.div
                className="relative"
                animate={{
                  boxShadow: consciousnessState.coherence > 0.8 ?
                    `0 0 20px ${getAuraColor()}40` : 'none'
                }}
              >
                <Input
                  ref={inputRef}
                  placeholder="Transmit your consciousness..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="bg-background/20 border-primary/20 focus:border-primary/40"
                  style={{
                    animationDuration: `${60000 / consciousnessState.breathing}ms`
                  }}
                />
              </motion.div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${getAuraColor()}, ${getAuraColor()}80)`
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </Card>

        {/* Sacred Voice Interface */}
        <AnimatePresence>
          {showQuantumView && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10"
            >
              <SacredVoiceInterface
                biometricState={{
                  heartRate: 60 + (consciousnessState.energy * 40),
                  breathing: consciousnessState.breathing / 20,
                  stress: consciousnessState.anxiety,
                  focus: consciousnessState.clarity,
                  coherence: consciousnessState.coherence
                }}
                consciousnessState={groupCoherence > 0.7 ? 'transcendent' : 'grounded'}
                className="w-64"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CSS for Sacred Geometry */}
      <style>{`
        .sacred-flower-of-life {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Ccircle cx='50' cy='50' r='20'/%3E%3Ccircle cx='35' cy='35' r='20'/%3E%3Ccircle cx='65' cy='35' r='20'/%3E%3Ccircle cx='35' cy='65' r='20'/%3E%3Ccircle cx='65' cy='65' r='20'/%3E%3Ccircle cx='50' cy='28' r='20'/%3E%3Ccircle cx='50' cy='72' r='20'/%3E%3C/g%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        
        .sacred-merkaba {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='0.5'%3E%3Cpolygon points='50,10 80,50 50,90 20,50'/%3E%3Cpolygon points='50,10 80,50 50,90 20,50' transform='rotate(90 50 50)'/%3E%3C/g%3E%3C/svg%3E");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}</style>
    </motion.div>
  );
};