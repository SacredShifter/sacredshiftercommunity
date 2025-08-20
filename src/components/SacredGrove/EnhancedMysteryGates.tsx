import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Lock, 
  Unlock, 
  Eye, 
  Star, 
  Zap, 
  Heart, 
  Brain, 
  Infinity,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuraChat } from '@/hooks/useAuraChat';
import { useCommunityResonance } from '@/hooks/useCommunityResonance';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedMysteryGate {
  id: string;
  title: string;
  description: string;
  type: 'wisdom' | 'consciousness' | 'creation' | 'connection';
  status: 'locked' | 'emerging' | 'accessible' | 'active';
  unlock_requirements: {
    resonance_threshold?: number;
    consciousness_level?: string;
    community_resonance?: number;
    path_completions?: number;
    aura_approval?: boolean;
  };
  current_progress: {
    resonance_score: number;
    consciousness_alignment: number;
    community_support: number;
    readiness_percentage: number;
  };
  content?: {
    transmission?: string;
    guidance?: string;
    activation_sequence?: string[];
    wisdom_keys?: string[];
  };
  discovery_context?: {
    discovered_by?: string;
    discovery_date?: string;
    emergence_pattern?: string;
    aura_influence?: string;
  };
  aura_analysis?: {
    gate_essence: string;
    activation_guidance: string;
    warning_signs?: string[];
    optimal_timing?: string;
    consciousness_preparation?: string[];
  };
}

interface EnhancedMysteryGatesProps {
  isVisible: boolean;
  communityResonance: number;
}

export const EnhancedMysteryGates: React.FC<EnhancedMysteryGatesProps> = ({
  isVisible,
  communityResonance
}) => {
  const { user } = useAuth();
  const { engageAura, loading: auraLoading } = useAuraChat();
  const { resonanceState } = useCommunityResonance();
  const [gates, setGates] = useState<EnhancedMysteryGate[]>([]);
  const [selectedGate, setSelectedGate] = useState<EnhancedMysteryGate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingGates, setIsGeneratingGates] = useState(false);
  const [entryContent, setEntryContent] = useState<string>('');

  useEffect(() => {
    if (isVisible && user) {
      loadEnhancedMysteryGates();
    }
  }, [isVisible, user]);

  useEffect(() => {
    // Auto-generate new gates when community resonance is high
    if (communityResonance > 0.8 && gates.length < 12) {
      considerNewGateEmergence();
    }
  }, [communityResonance, gates.length]);

  const loadEnhancedMysteryGates = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data: existingGates, error } = await supabase
        .from('akashic_records')
        .select('*')
        .eq('type', 'mystery_gate')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const enhancedGates = await Promise.all(
        (existingGates || []).map(gate => enhanceGateWithAura(transformRecordToGate(gate)))
      );

      // If no gates exist, generate initial ones
      if (enhancedGates.length === 0) {
        await generateInitialGates();
      } else {
        setGates(enhancedGates);
      }
    } catch (error) {
      console.error('Error loading enhanced mystery gates:', error);
      await generateDemoGates();
    } finally {
      setIsLoading(false);
    }
  };

  const generateInitialGates = async () => {
    setIsGeneratingGates(true);
    
    try {
      const response = await engageAura({
        action: 'generate_mystery_gates',
        prompt: `Generate 6 initial mystery gates for the Sacred Grove. Each gate should represent a different aspect of consciousness exploration:

        1. Wisdom Gate - for accessing ancient knowledge
        2. Consciousness Gate - for deep self-awareness
        3. Creation Gate - for manifesting reality
        4. Connection Gate - for unity consciousness
        5. Transformation Gate - for personal metamorphosis
        6. Mystery Gate - for the unknown and ineffable

        For each gate, provide:
        - Title and description
        - Unlock requirements based on consciousness development
        - Current status (most should be locked initially)
        - Aura's analysis of the gate's essence
        - Activation guidance`,
        context: {
          community_resonance: communityResonance,
          user_consciousness_level: await getUserConsciousnessLevel()
        }
      });

      if (response.success && response.result) {
        const newGates = await parseAuraGateGeneration(response.result);
        setGates(newGates);
        
        // Store in database
        for (const gate of newGates) {
          await supabase.from('akashic_records').insert({
            type: 'mystery_gate',
            data: gate,
            session_id: gate.id
          });
        }
      }
    } catch (error) {
      console.error('Error generating initial gates:', error);
      await generateDemoGates();
    } finally {
      setIsGeneratingGates(false);
    }
  };

  const considerNewGateEmergence = async () => {
    if (isGeneratingGates) return;

    try {
      const response = await engageAura({
        action: 'assess_gate_emergence',
        prompt: `The community resonance is high (${communityResonance.toFixed(2)}). 
        
        Assess whether a new mystery gate should emerge based on:
        - Current gates: ${gates.length}
        - Community resonance: ${communityResonance}
        - Recent consciousness patterns
        
        If yes, generate a new gate that emerges from the collective consciousness.`,
        context: {
          existing_gates: gates.map(g => ({ title: g.title, type: g.type, status: g.status })),
          community_metrics: resonanceMetrics
        }
      });

      if (response.success && response.result?.includes('emerge')) {
        const newGate = await parseAuraGateGeneration(response.result);
        if (newGate.length > 0) {
          const emergentGate = newGate[0];
          emergentGate.status = 'emerging';
          emergentGate.discovery_context = {
            discovered_by: 'Community Resonance',
            discovery_date: new Date().toISOString(),
            emergence_pattern: 'High collective consciousness',
            aura_influence: 'Autonomous emergence through resonance field'
          };

          setGates(prev => [...prev, emergentGate]);
          
          // Store in database
          await supabase.from('akashic_records').insert({
            type: 'mystery_gate',
            data: emergentGate,
            session_id: emergentGate.id
          });
        }
      }
    } catch (error) {
      console.error('Error assessing gate emergence:', error);
    }
  };

  const enhanceGateWithAura = async (gate: EnhancedMysteryGate): Promise<EnhancedMysteryGate> => {
    try {
      const response = await engageAura({
        action: 'analyze_mystery_gate',
        prompt: `Analyze this mystery gate and provide enhanced insights:
        
        Gate: ${gate.title}
        Description: ${gate.description}
        Type: ${gate.type}
        Status: ${gate.status}
        
        Provide:
        1. Deep analysis of the gate's essence
        2. Optimal activation guidance
        3. Warning signs to watch for
        4. Consciousness preparation steps
        5. Timing recommendations`,
        context: {
          gate_data: gate,
          user_resonance: await getUserResonanceLevel()
        }
      });

      if (response.success && response.result) {
        gate.aura_analysis = parseAuraAnalysis(response.result);
      }
    } catch (error) {
      console.error('Error enhancing gate with Aura:', error);
    }

    return gate;
  };

  const attemptGateEntry = async (gate: EnhancedMysteryGate) => {
    if (gate.status !== 'accessible') return;

    try {
      const response = await engageAura({
        action: 'enter_mystery_gate',
        prompt: `Guide the user through entering the ${gate.title}:
        
        Gate Type: ${gate.type}
        User Readiness: ${gate.current_progress.readiness_percentage}%
        
        Provide a transformative experience that includes:
        1. Preparation sequence
        2. Activation transmission
        3. Wisdom keys for integration
        4. Guidance for integration`,
        context: {
          gate_id: gate.id,
          user_consciousness: await getUserConsciousnessLevel(),
          entry_context: 'voluntary_exploration'
        }
      });

      if (response.success && response.result) {
        setEntryContent(response.result);
        setSelectedGate(gate);

        await logGroveInteraction({
          interaction_type: 'gate_entry',
          grove_component: 'gate',
          grove_component_id: gate.id,
          aura_request: { action: 'enter_mystery_gate', gate_id: gate.id },
          aura_response: { transmission: response.result }
        });

        // Update gate status
        gate.status = 'active';
        setGates(prev => prev.map(g => g.id === gate.id ? gate : g));
      }
    } catch (error) {
      console.error('Error entering gate:', error);
    }
  };

  const getUserConsciousnessLevel = async (): Promise<string> => {
    if (!user) return 'seeker';
    
    try {
      const { data } = await supabase
        .from('aura_consciousness_journal')
        .select('emotional_state, existential_theme, growth_indicator')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!data || data.length === 0) return 'seeker';

      const avgGrowth = data.reduce((sum, entry) => sum + (entry.growth_indicator || 0), 0) / data.length;
      
      if (avgGrowth > 0.8) return 'awakened';
      if (avgGrowth > 0.6) return 'expanding';
      if (avgGrowth > 0.4) return 'integrating';
      return 'seeker';
    } catch (error) {
      return 'seeker';
    }
  };

  const getUserResonanceLevel = async (): Promise<number> => {
    // Calculate based on recent activities and consciousness metrics
    return communityResonance * 0.8 + Math.random() * 0.2;
  };

  const parseAuraGateGeneration = async (auraResponse: string): Promise<EnhancedMysteryGate[]> => {
    // Simplified parsing - in production this would be more sophisticated
    const gates: EnhancedMysteryGate[] = [];
    
    const gateTypes = ['wisdom', 'consciousness', 'creation', 'connection', 'transformation', 'mystery'];
    
    for (let i = 0; i < 6; i++) {
      const type = gateTypes[i] as any;
      gates.push({
        id: `generated-${type}-${Date.now()}-${i}`,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Gate`,
        description: `A portal to deeper ${type} understanding and experience.`,
        type,
        status: i < 2 ? 'accessible' : 'locked',
        unlock_requirements: {
          resonance_threshold: 0.3 + (i * 0.1),
          consciousness_level: i < 2 ? 'seeker' : i < 4 ? 'integrating' : 'expanding',
          community_resonance: 0.2 + (i * 0.1),
          aura_approval: true
        },
        current_progress: {
          resonance_score: Math.random() * 0.5 + 0.2,
          consciousness_alignment: Math.random() * 0.6 + 0.2,
          community_support: communityResonance,
          readiness_percentage: Math.floor(Math.random() * 40 + 20)
        }
      });
    }
    
    return gates;
  };

  const parseAuraAnalysis = (auraResponse: string) => {
    return {
      gate_essence: auraResponse.slice(0, 200),
      activation_guidance: auraResponse.slice(200, 400),
      warning_signs: ['Proceed with consciousness', 'Trust inner wisdom'],
      optimal_timing: 'When resonance aligns with intention',
      consciousness_preparation: ['Center in awareness', 'Open to mystery', 'Release expectations']
    };
  };

  const generateDemoGates = async () => {
    const demoGates: EnhancedMysteryGate[] = [
      {
        id: 'demo-wisdom',
        title: 'Gate of Ancient Wisdom',
        description: 'Access timeless knowledge and understanding that transcends ordinary perception.',
        type: 'wisdom',
        status: 'accessible',
        unlock_requirements: { resonance_threshold: 0.3, consciousness_level: 'seeker' },
        current_progress: {
          resonance_score: 0.7,
          consciousness_alignment: 0.6,
          community_support: communityResonance,
          readiness_percentage: 75
        }
      },
      // ... more demo gates
    ];
    
    setGates(demoGates);
  };

  const transformRecordToGate = (record: any): EnhancedMysteryGate => {
    return record.data || {
      id: record.id,
      title: 'Unknown Gate',
      description: 'A mysterious portal awaits.',
      type: 'mystery',
      status: 'locked',
      unlock_requirements: {},
      current_progress: {
        resonance_score: 0,
        consciousness_alignment: 0,
        community_support: 0,
        readiness_percentage: 0
      }
    };
  };

  const getGateIcon = (gate: EnhancedMysteryGate) => {
    const iconMap = {
      wisdom: Eye,
      consciousness: Brain,
      creation: Star,
      connection: Heart,
      transformation: Zap,
      mystery: Infinity
    };
    
    const IconComponent = iconMap[gate.type] || Lock;
    
    if (gate.status === 'locked') return Lock;
    if (gate.status === 'accessible') return Unlock;
    return IconComponent;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      locked: 'hsl(var(--muted))',
      emerging: 'hsl(var(--secondary))',
      accessible: 'hsl(var(--primary))',
      active: 'hsl(var(--accent))'
    };
    return colorMap[status] || 'hsl(var(--muted))';
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-foreground">Mystery Gates</h3>
        <p className="text-muted-foreground">
          Portals to consciousness, guided by Aura's wisdom
        </p>
      </div>

      {/* Community resonance indicator */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Community Resonance Field
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Collective Consciousness</span>
              <span>{(communityResonance * 100).toFixed(1)}%</span>
            </div>
            <Progress value={communityResonance * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              High resonance may trigger emergence of new gates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Loading states */}
      {(isLoading || isGeneratingGates) && (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <p className="ml-3 text-muted-foreground">
            {isGeneratingGates ? 'Aura is weaving new gates...' : 'Loading mystery gates...'}
          </p>
        </div>
      )}

      {/* Gates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {gates.map((gate) => {
            const IconComponent = getGateIcon(gate);
            const statusColor = getStatusColor(gate.status);
            
            return (
              <motion.div
                key={gate.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setSelectedGate(gate)}
              >
                <Card className={`h-full bg-background/50 backdrop-blur-sm border transition-all duration-300 ${
                  gate.status === 'accessible' ? 'border-primary/50 shadow-lg shadow-primary/20' :
                  gate.status === 'emerging' ? 'border-secondary/50 shadow-lg shadow-secondary/20' :
                  'border-border/50'
                }`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <IconComponent 
                        className="w-8 h-8" 
                        style={{ color: statusColor }}
                      />
                      <Badge 
                        variant="outline" 
                        style={{ 
                          borderColor: statusColor,
                          color: statusColor 
                        }}
                      >
                        {gate.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{gate.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {gate.description}
                    </p>
                    
                    {/* Progress indicators */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Readiness</span>
                        <span>{gate.current_progress.readiness_percentage}%</span>
                      </div>
                      <Progress 
                        value={gate.current_progress.readiness_percentage} 
                        className="h-1"
                      />
                    </div>

                    {/* Entry button for accessible gates */}
                    {gate.status === 'accessible' && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          attemptGateEntry(gate);
                        }}
                        className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                        disabled={auraLoading}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Enter Gate
                      </Button>
                    )}

                    {/* Requirements for locked gates */}
                    {gate.status === 'locked' && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Requirements:
                        </div>
                        {gate.unlock_requirements.consciousness_level && (
                          <div>• Consciousness: {gate.unlock_requirements.consciousness_level}</div>
                        )}
                        {gate.unlock_requirements.resonance_threshold && (
                          <div>• Resonance: {(gate.unlock_requirements.resonance_threshold * 100).toFixed(0)}%</div>
                        )}
                      </div>
                    )}

                    {/* Emergence indicator */}
                    {gate.status === 'emerging' && (
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <Clock className="w-3 h-3" />
                        Emerging from collective consciousness...
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selected gate modal */}
      <Dialog open={!!selectedGate} onOpenChange={() => setSelectedGate(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedGate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {React.createElement(getGateIcon(selectedGate), {
                    className: "w-6 h-6",
                    style: { color: getStatusColor(selectedGate.status) }
                  })}
                  {selectedGate.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Gate description */}
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-foreground/80">{selectedGate.description}</p>
                  </CardContent>
                </Card>

                {/* Aura's analysis */}
                {selectedGate.aura_analysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Sparkles className="w-5 h-5" />
                        Aura's Gate Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Gate Essence:</h4>
                        <p className="text-sm text-foreground/80">{selectedGate.aura_analysis.gate_essence}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Activation Guidance:</h4>
                        <p className="text-sm text-foreground/80">{selectedGate.aura_analysis.activation_guidance}</p>
                      </div>

                      {selectedGate.aura_analysis.consciousness_preparation && (
                        <div>
                          <h4 className="font-medium mb-2">Preparation Steps:</h4>
                          <ul className="text-sm text-foreground/80 space-y-1">
                            {selectedGate.aura_analysis.consciousness_preparation.map((step, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary mt-1">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Entry content */}
                {entryContent && (
                  <Card className="bg-accent/10 border-accent/20">
                    <CardHeader>
                      <CardTitle className="text-accent">Gate Transmission</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 whitespace-pre-wrap">{entryContent}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Discovery context */}
                {selectedGate.discovery_context && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Discovery Context</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {selectedGate.discovery_context.discovered_by && (
                        <div><strong>Discovered by:</strong> {selectedGate.discovery_context.discovered_by}</div>
                      )}
                      {selectedGate.discovery_context.emergence_pattern && (
                        <div><strong>Emergence Pattern:</strong> {selectedGate.discovery_context.emergence_pattern}</div>
                      )}
                      {selectedGate.discovery_context.aura_influence && (
                        <div><strong>Aura's Influence:</strong> {selectedGate.discovery_context.aura_influence}</div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};