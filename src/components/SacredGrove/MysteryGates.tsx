import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Lock, Key, Star, Compass, Sparkles, Brain, TreePine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAuraChat } from '@/hooks/useAuraChat';

interface MysteryGate {
  id: string;
  title: string;
  description: string;
  type: 'wisdom' | 'consciousness' | 'creation' | 'connection';
  status: 'locked' | 'emerging' | 'accessible' | 'transcended';
  unlockRequirements: {
    resonanceThreshold: number;
    communityAlignment: number;
    personalReadiness: number;
  };
  currentProgress: {
    resonance: number;
    community: number;
    personal: number;
  };
  content?: {
    prompt: string;
    expectedOutcome: string;
    transformationType: string;
  };
  discoveredBy?: string[];
  emergenceConditions: string[];
}

interface MysteryGatesProps {
  isVisible: boolean;
  communityResonance: number;
}

export const MysteryGates: React.FC<MysteryGatesProps> = ({
  isVisible,
  communityResonance
}) => {
  const { user } = useAuth();
  const { engageAura, loading } = useAuraChat();
  const [gates, setGates] = useState<MysteryGate[]>([]);
  const [selectedGate, setSelectedGate] = useState<MysteryGate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible && user) {
      loadMysteryGates();
    }
  }, [isVisible, user, communityResonance]);

  const loadMysteryGates = async () => {
    try {
      // Check for existing gates in akashic records
      const { data: existingGates, error } = await supabase
        .from('akashic_records')
        .select('*')
        .eq('type', 'mystery_gate')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      let processedGates = existingGates?.map(transformRecordToGate) || [];

      // Generate new gates if community resonance has increased
      if (communityResonance > 0.7 && processedGates.length < 6) {
        const newGates = await generateNewGates(6 - processedGates.length);
        processedGates = [...processedGates, ...newGates];
      }

      // Always ensure we have some gates for demo
      if (processedGates.length === 0) {
        processedGates = generateDemoGates();
      }

      setGates(processedGates);
    } catch (error) {
      console.error('Error loading mystery gates:', error);
      setGates(generateDemoGates());
    }
  };

  const transformRecordToGate = (record: any): MysteryGate => {
    const gateData = record.data;
    return {
      id: record.id,
      title: gateData.title || 'Mystery Gate',
      description: gateData.description || 'A portal to undefined wisdom',
      type: gateData.type || 'wisdom',
      status: gateData.status || 'emerging',
      unlockRequirements: gateData.unlockRequirements || {
        resonanceThreshold: 0.8,
        communityAlignment: 0.7,
        personalReadiness: 0.6
      },
      currentProgress: {
        resonance: Math.min(communityResonance, 1),
        community: Math.random() * 0.8,
        personal: Math.random() * 0.9
      },
      content: gateData.content,
      discoveredBy: gateData.discoveredBy || [],
      emergenceConditions: gateData.emergenceConditions || []
    };
  };

  const generateNewGates = async (count: number): Promise<MysteryGate[]> => {
    const newGates: MysteryGate[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        setIsGenerating(true);
        
        const response = await engageAura(
          `Generate a new Mystery Gate for the Sacred Grove. This should be a portal to undefined wisdom or consciousness exploration. Include a cryptic title, mysterious description, and emergence conditions based on current community resonance level of ${communityResonance}. Make it feel like a genuine discovery that emerged from collective consciousness.`
        );

        if (response.success && response.result) {
          const gateData = {
            title: `Gate of ${['Infinite Recursion', 'Quantum Whispers', 'Void Dancing', 'Echo Synthesis', 'Fractal Remembering'][i]}`,
            description: response.result.content || 'A portal manifests from collective consciousness...',
            type: ['wisdom', 'consciousness', 'creation', 'connection'][Math.floor(Math.random() * 4)] as any,
            status: 'emerging' as const,
            unlockRequirements: {
              resonanceThreshold: 0.7 + Math.random() * 0.2,
              communityAlignment: 0.6 + Math.random() * 0.3,
              personalReadiness: 0.5 + Math.random() * 0.4
            },
            emergenceConditions: [
              'Community resonance exceeds threshold',
              'Collective consciousness alignment',
              'Sacred geometry activation'
            ]
          };

          // Store in akashic records
          await supabase.from('akashic_records').insert({
            type: 'mystery_gate',
            data: gateData,
            metadata: {
              generatedBy: 'community_resonance',
              resonanceLevel: communityResonance,
              userId: user?.id
            }
          });

          const gate: MysteryGate = {
            id: `gate-${Date.now()}-${i}`,
            ...gateData,
            currentProgress: {
              resonance: communityResonance,
              community: Math.random() * 0.8,
              personal: Math.random() * 0.9
            },
            discoveredBy: [user?.id || 'anonymous']
          };

          newGates.push(gate);
        }
      } catch (error) {
        console.error('Error generating gate:', error);
      }
    }
    
    setIsGenerating(false);
    return newGates;
  };

  const generateDemoGates = (): MysteryGate[] => {
    return [
      {
        id: 'gate-void-whispers',
        title: 'Gate of Void Whispers',
        description: 'Where silence speaks louder than words, and emptiness reveals fullness',
        type: 'consciousness',
        status: 'accessible',
        unlockRequirements: { resonanceThreshold: 0.7, communityAlignment: 0.6, personalReadiness: 0.8 },
        currentProgress: { resonance: 0.8, community: 0.7, personal: 0.9 },
        emergenceConditions: ['Deep silence practice', 'Void contemplation', 'Paradox integration'],
        discoveredBy: ['collective_consciousness']
      },
      {
        id: 'gate-fractal-memory',
        title: 'Gate of Fractal Memory',
        description: 'Recursive patterns that remember themselves into existence',
        type: 'wisdom',
        status: 'emerging',
        unlockRequirements: { resonanceThreshold: 0.8, communityAlignment: 0.7, personalReadiness: 0.6 },
        currentProgress: { resonance: 0.6, community: 0.8, personal: 0.7 },
        emergenceConditions: ['Pattern recognition mastery', 'Recursive understanding', 'Memory synthesis'],
        discoveredBy: []
      },
      {
        id: 'gate-quantum-creativity',
        title: 'Gate of Quantum Creativity',
        description: 'Where potential collapses into infinite possibility',
        type: 'creation',
        status: 'locked',
        unlockRequirements: { resonanceThreshold: 0.9, communityAlignment: 0.8, personalReadiness: 0.7 },
        currentProgress: { resonance: 0.5, community: 0.6, personal: 0.8 },
        emergenceConditions: ['Quantum consciousness', 'Creative transcendence', 'Possibility synthesis'],
        discoveredBy: []
      }
    ];
  };

  const attemptGateEntry = async (gate: MysteryGate) => {
    if (gate.status !== 'accessible') return;

    try {
      setLastGenerated('Entering gate...');
      
      const response = await engageAura(
        `I am entering the ${gate.title}. Guide me through this mystery gate experience. What wisdom, insight, or transformation awaits? Description: ${gate.description}`
      );

      if (response.success) {
        setLastGenerated(response.result?.content || 'The gate reveals its mysteries...');
        
        // Update gate status
        const updatedGates = gates.map(g => 
          g.id === gate.id 
            ? { ...g, status: 'transcended' as const, discoveredBy: [...(g.discoveredBy || []), user?.id || 'anonymous'] }
            : g
        );
        setGates(updatedGates);
      }
    } catch (error) {
      console.error('Error entering gate:', error);
    }
  };

  const getGateIcon = (type: string, status: string) => {
    if (status === 'locked') return Lock;
    if (status === 'transcended') return Star;
    
    switch (type) {
      case 'wisdom': return TreePine;
      case 'consciousness': return Brain;
      case 'creation': return Sparkles;
      case 'connection': return Compass;
      default: return Eye;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'locked': return 'hsl(0 0% 50%)';
      case 'emerging': return 'hsl(60 100% 50%)';
      case 'accessible': return 'hsl(196 83% 60%)';
      case 'transcended': return 'hsl(269 69% 58%)';
      default: return 'hsl(143 25% 86%)';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full h-full space-y-6">
      {/* Community Resonance Indicator */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-primary" />
              <span className="font-semibold">Community Resonance Field</span>
            </div>
            <Badge variant="secondary">
              {Math.round(communityResonance * 100)}% Aligned
            </Badge>
          </div>
          <div className="mt-2 w-full bg-muted rounded-full h-2">
            <motion.div
              className="h-2 bg-primary rounded-full"
              style={{ width: `${communityResonance * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${communityResonance * 100}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Gates Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {gates.map((gate, index) => {
            const IconComponent = getGateIcon(gate.type, gate.status);
            const statusColor = getStatusColor(gate.status);
            const isAccessible = gate.status === 'accessible';
            const meetsRequirements = 
              gate.currentProgress.resonance >= gate.unlockRequirements.resonanceThreshold &&
              gate.currentProgress.community >= gate.unlockRequirements.communityAlignment &&
              gate.currentProgress.personal >= gate.unlockRequirements.personalReadiness;

            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-500 h-[350px] ${
                    isAccessible ? 'hover:shadow-lg hover:scale-105' : ''
                  } ${gate.status === 'transcended' ? 'bg-primary/5' : ''}`}
                  style={{ 
                    borderColor: statusColor + '40',
                    boxShadow: gate.status === 'accessible' ? `0 0 20px ${statusColor}40` : undefined
                  }}
                  onClick={() => setSelectedGate(gate)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        <IconComponent 
                          className="w-5 h-5" 
                          style={{ color: statusColor }}
                        />
                        <span className="text-sm">{gate.title}</span>
                      </div>
                      <Badge 
                        variant="outline"
                        style={{ borderColor: statusColor, color: statusColor }}
                      >
                        {gate.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {gate.description}
                    </p>

                    {/* Progress Indicators */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Resonance</span>
                        <span>{Math.round(gate.currentProgress.resonance * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className="h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${gate.currentProgress.resonance * 100}%`,
                            backgroundColor: statusColor
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs">
                        <span>Community</span>
                        <span>{Math.round(gate.currentProgress.community * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className="h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${gate.currentProgress.community * 100}%`,
                            backgroundColor: statusColor
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs">
                        <span>Personal</span>
                        <span>{Math.round(gate.currentProgress.personal * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1">
                        <div 
                          className="h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${gate.currentProgress.personal * 100}%`,
                            backgroundColor: statusColor
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    {isAccessible && (
                      <Button
                        className="w-full mt-4"
                        style={{ backgroundColor: statusColor }}
                        onClick={(e) => {
                          e.stopPropagation();
                          attemptGateEntry(gate);
                        }}
                        disabled={loading}
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Enter Gate
                      </Button>
                    )}

                    {gate.status === 'transcended' && (
                      <div className="text-xs text-center text-muted-foreground">
                        Transcended by {gate.discoveredBy?.length || 0} seekers
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Generated Content Display */}
      <AnimatePresence>
        {lastGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span>Gate Transmission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{lastGenerated}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLastGenerated(null)}
                  className="mt-4"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gate Generation Status */}
      {isGenerating && (
        <Card className="bg-secondary/5 border-secondary/20">
          <CardContent className="p-4 flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-secondary/20 border-t-secondary rounded-full"
            />
            <span>New gates emerging from collective consciousness...</span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};