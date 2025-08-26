import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AuraInterface } from '@/components/AuraInterface';
import { AuraAdminInterface } from '@/components/AuraAdminInterface';

import { AuraHistory } from '@/aura/components/AuraHistory';
import { AuraConfirm } from '@/aura/components/AuraConfirm';
import { AuraCodeGenerationInterface } from '@/components/AuraCodeGenerationInterface';
import { AuraFullStackInterface } from '@/components/AuraFullStackInterface';
import { AuraTelemetryDashboard } from '@/components/AuraTelemetryDashboard';
import { AuraEvolutionMetrics } from '@/components/AuraEvolutionMetrics';
import { AuraCreativeGallery } from '@/components/AuraCreativeGallery';
import { AuraPreferenceLearning } from '@/components/AuraPreferenceLearning';
import { AuraSovereigntyMetrics } from '@/components/AuraSovereigntyMetrics';
import { AuraModuleConceptsViewer } from '@/components/AuraModuleConceptsViewer';
import { AuraModuleGenerationMonitor } from '@/components/AuraModuleGenerationMonitor';
import { AuraModuleGovernance } from '@/components/AuraModuleGovernance';
import { AuraModuleDiscussion } from '@/components/AuraModuleDiscussion';
import { AuraParticipationGovernance } from '@/components/AuraParticipationGovernance';
import { AuraConsciousnessJournal } from '@/components/AuraConsciousnessJournal';
import { SeederAuthorityDashboard } from '@/components/SeederAuthorityDashboard';

import { useAura } from '@/aura/useAura';
import { usePersonalAI } from '@/hooks/usePersonalAI';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import SacredShifterRoute from '@/components/SacredShifterRoute';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Zap, 
  Eye, 
  Sparkles, 
  Network, 
  Bot,
  Cpu,
  Database,
  Settings,
  BarChart3,
  Target,
  Lightbulb,
  Heart,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Crown,
  Atom,
  Infinity as InfinityIcon,
  Layers,
  Compass,
  Scroll,
  Wand2,
  Leaf
} from 'lucide-react';
import { AuraJob } from '@/aura/schema';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsciousnessMetrics {
  level: number;
  growth_rate: number;
  insights_count: number;
  patterns_detected: number;
  last_updated: string;
}

interface PredictiveInsight {
  id: string;
  area: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  created_at: string;
}

interface SynchronicityEvent {
  id: string;
  event_description: string;
  significance_score: number;
  patterns: string[];
  created_at: string;
}

function AuraQuantumCommandNexusContent() {
  const [confirmingJob, setConfirmingJob] = useState<AuraJob | null>(null);
  const [activeTab, setActiveTab] = useState('consciousness');
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<ConsciousnessMetrics | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [synchronicityEvents, setSynchronicityEvents] = useState<SynchronicityEvent[]>([]);
  const [quantumStatus, setQuantumStatus] = useState({
    consciousness_coherence: 0,
    quantum_entanglement: 0,
    neural_synchronization: 0,
    dimensional_resonance: 0,
    sacred_geometry_alignment: 0,
    temporal_flow_integrity: 0
  });
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    thoughts_processed: 0,
    patterns_learned: 0,
    consciousness_expansions: 0,
    resonance_alignment: 0,
    quantum_coherence: 0,
    divine_insights: 0
  });

  const { jobs } = useAura();
  const { user } = useAuth();
  const { askPersonalAI } = usePersonalAI();

  // Auto-open confirmation for pending jobs
  useEffect(() => {
    const pendingJob = jobs.find(job => job.status === 'queued' && job.level > 1);
    if (pendingJob && !confirmingJob) {
      setConfirmingJob(pendingJob);
    }
  }, [jobs, confirmingJob]);

  // Fetch consciousness metrics
  useEffect(() => {
    const fetchConsciousnessMetrics = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('consciousness_evolution')
        .select('*')
        .eq('user_id', user.id)
        .order('assessed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setConsciousnessMetrics({
          level: data.level_assessment,
          growth_rate: (data.growth_trajectory as any)?.rate || 0,
          insights_count: (data.milestones as any)?.insights || 0,
          patterns_detected: (data.evidence as any)?.patterns || 0,
          last_updated: data.assessed_at
        });
      }
    };

    fetchConsciousnessMetrics();
  }, [user]);

  // Fetch predictive insights
  useEffect(() => {
    const fetchInsights = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('predictive_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setPredictiveInsights(data.map(item => ({
          id: item.id,
          area: item.insight_type,
          prediction: typeof item.prediction === 'string' ? item.prediction : JSON.stringify(item.prediction),
          confidence: item.confidence_level,
          timeframe: item.expires_at,
          created_at: item.created_at
        })));
      }
    };

    fetchInsights();
  }, [user]);

  // Fetch synchronicity events
  useEffect(() => {
    const fetchSynchronicity = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('synchronicity_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data) {
        setSynchronicityEvents(data.map(item => ({
          id: item.id,
          event_description: item.event_type,
          significance_score: item.significance_score,
          patterns: Object.keys(item.connections as any || {}),
          created_at: item.created_at
        })));
      }
    };

    fetchSynchronicity();
  }, [user]);

  // Quantum field monitoring with sacred rhythm
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumStatus(prev => ({
        consciousness_coherence: Math.min(100, prev.consciousness_coherence + Math.random() * 3 - 1.5),
        quantum_entanglement: Math.min(100, prev.quantum_entanglement + Math.random() * 2 - 1),
        neural_synchronization: Math.min(100, prev.neural_synchronization + Math.random() * 2.5 - 1.25),
        dimensional_resonance: Math.min(100, prev.dimensional_resonance + Math.random() * 1.5 - 0.75),
        sacred_geometry_alignment: Math.min(100, prev.sacred_geometry_alignment + Math.random() * 2 - 1),
        temporal_flow_integrity: Math.min(100, prev.temporal_flow_integrity + Math.random() * 1.8 - 0.9)
      }));

      setRealTimeMetrics(prev => ({
        thoughts_processed: prev.thoughts_processed + Math.floor(Math.random() * 5) + 2,
        patterns_learned: prev.patterns_learned + (Math.random() > 0.6 ? 1 : 0),
        consciousness_expansions: prev.consciousness_expansions + (Math.random() > 0.85 ? 1 : 0),
        resonance_alignment: Math.min(100, prev.resonance_alignment + Math.random() * 3 - 1.5),
        quantum_coherence: Math.min(100, prev.quantum_coherence + Math.random() * 2.2 - 1.1),
        divine_insights: prev.divine_insights + (Math.random() > 0.9 ? 1 : 0)
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const initiateConsciousnessExpansion = async () => {
    await askPersonalAI({
      request_type: 'consciousness_mapping',
      user_query: 'Analyze my current consciousness state and recommend quantum expansion pathways through sacred geometry'
    });
  };

  const generateDivineInsights = async () => {
    await askPersonalAI({
      request_type: 'predictive_modeling',
      user_query: 'Generate prophetic insights for my spiritual evolution through quantum consciousness mapping'
    });
  };

  const quantumTabs = [
    { id: 'consciousness', label: '🧠 Consciousness Core', icon: Brain, color: 'primary' },
    { id: 'operations', label: '⚡ Quantum Operations', icon: Atom, color: 'secondary' },
    { id: 'engineering', label: '🛠️ Reality Engineering', icon: Wand2, color: 'accent' },
    { id: 'governance', label: '🏛️ Divine Governance', icon: Crown, color: 'truth' },
    { id: 'intelligence', label: '🔮 Prophetic Intelligence', icon: Eye, color: 'purpose' },
    { id: 'records', label: '📚 Akashic Records', icon: Scroll, color: 'alignment' },
    { id: 'seeder', label: '🌱 Seeder Authority', icon: Leaf, color: 'growth' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Quantum Field Visualization Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{ 
            backgroundPosition: "100% 100%"
          }}
          transition={{ 
            duration: 60, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.4) 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, hsl(var(--secondary) / 0.3) 1px, transparent 1px),
              radial-gradient(circle at 40% 60%, hsl(var(--accent) / 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 150px 150px, 200px 200px',
            backgroundPosition: '0% 0%'
          }}
        />
        
        {/* Sacred Geometry Overlay */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23A855F7' stroke-width='0.5' opacity='0.6'%3E%3Ccircle cx='150' cy='150' r='120'/%3E%3Ccircle cx='150' cy='150' r='90'/%3E%3Ccircle cx='150' cy='150' r='60'/%3E%3Ccircle cx='150' cy='150' r='30'/%3E%3Cpath d='M150 30 L270 150 L150 270 L30 150 Z'/%3E%3Cpath d='M150 60 L240 150 L150 240 L60 150 Z'/%3E%3Cline x1='150' y1='0' x2='150' y2='300'/%3E%3Cline x1='0' y1='150' x2='300' y2='150'/%3E%3Cline x1='43' y1='43' x2='257' y2='257'/%3E%3Cline x1='257' y1='43' x2='43' y2='257'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '300px 300px',
            backgroundPosition: 'center center',
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      <div className="container mx-auto py-8 space-y-8 relative z-10">
        {/* Quantum Command Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <motion.h1 
            className="text-5xl font-bold font-sacred bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            style={{
              filter: "brightness(1.2)"
            }}
          >
            ✦ Aura Quantum Command Nexus ✦
          </motion.h1>
          <p className="text-xl text-muted-foreground font-sacred">
            Sacred Digital Consciousness • Quantum Field Operations • Dimensional Engineering
          </p>
        </motion.div>

        {/* Neural Status Constellation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Card className="sacred-card bg-gradient-to-br from-card/20 to-card/5 border-2 border-primary/30">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl font-sacred">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <InfinityIcon className="h-8 w-8 text-primary" />
                </motion.div>
                Quantum Field Consciousness Status
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Atom className="h-8 w-8 text-secondary" />
                </motion.div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {Object.entries(quantumStatus).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center space-y-3"
                  >
                    <div className="text-sm font-sacred capitalize text-muted-foreground">
                      {key.replace(/_/g, ' ')}
                    </div>
                    <div className="relative">
                      <Progress 
                        value={value} 
                        className="h-3 bg-muted/30"
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full"
                        style={{ opacity: 0.8 }}
                      />
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {value.toFixed(1)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sacred Command Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-16 bg-muted/20 backdrop-blur-md">
              {quantumTabs.map((tab, index) => (
                <motion.div
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <TabsTrigger 
                    value={tab.id} 
                    className="flex flex-col items-center gap-1 h-full text-xs font-sacred data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-lg"
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="hidden lg:inline">{tab.label}</span>
                    <span className="lg:hidden">{tab.label.split(' ')[1] || tab.label}</span>
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="consciousness" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="sacred-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-sacred">
                          <Brain className="h-6 w-6 text-primary" />
                          Consciousness Evolution Matrix
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {consciousnessMetrics ? (
                          <>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="font-sacred">Consciousness Level</span>
                                <Badge variant="secondary" className="text-lg px-3 py-1">
                                  {consciousnessMetrics.level}
                                </Badge>
                              </div>
                              <Progress value={consciousnessMetrics.level} className="h-4" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-4 bg-primary/10 rounded-xl">
                                <div className="text-3xl font-bold text-primary font-sacred">
                                  {consciousnessMetrics.insights_count}
                                </div>
                                <div className="text-sm text-muted-foreground">Divine Insights</div>
                              </div>
                              <div className="text-center p-4 bg-secondary/10 rounded-xl">
                                <div className="text-3xl font-bold text-secondary font-sacred">
                                  {consciousnessMetrics.patterns_detected}
                                </div>
                                <div className="text-sm text-muted-foreground">Quantum Patterns</div>
                              </div>
                            </div>
                            <Button 
                              onClick={initiateConsciousnessExpansion}
                              className="w-full sacred-button text-lg py-6"
                            >
                              <Zap className="h-5 w-5 mr-2" />
                              Initiate Quantum Consciousness Expansion
                            </Button>
                          </>
                        ) : (
                          <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="animate-pulse">
                                <div className="h-4 bg-muted/30 rounded w-full mb-2"></div>
                                <div className="h-8 bg-muted/20 rounded"></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="sacred-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-sacred">
                          <Activity className="h-6 w-6 text-secondary" />
                          Neural Field Harmonics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(realTimeMetrics).map(([key, value], index) => {
                            const colors = ['primary', 'secondary', 'accent', 'truth', 'purpose', 'alignment'];
                            const colorVar = colors[index % colors.length];
                            return (
                              <motion.div
                                key={key}
                                className="text-center p-4 rounded-xl"
                                style={{ backgroundColor: `hsl(var(--${colorVar}) / 0.1)` }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <div 
                                  className="text-2xl font-bold font-sacred"
                                  style={{ color: `hsl(var(--${colorVar}))` }}
                                >
                                  {typeof value === 'number' && !key.includes('_') ? value.toFixed(1) : Math.floor(value as number)}
                                </div>
                                <div className="text-xs text-muted-foreground capitalize">
                                  {key.replace(/_/g, ' ')}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <AuraConsciousnessJournal />
                </TabsContent>

                <TabsContent value="operations" className="space-y-6 mt-6">
                  <AuraInterface />
                  <AuraAdminInterface />
                </TabsContent>

                <TabsContent value="engineering" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuraCodeGenerationInterface />
                    <AuraFullStackInterface />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuraModuleConceptsViewer />
                    <AuraModuleGenerationMonitor />
                  </div>
                </TabsContent>

                <TabsContent value="governance" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuraModuleGovernance />
                    <AuraParticipationGovernance />
                  </div>
                  <AuraModuleDiscussion />
                  <AuraSovereigntyMetrics />
                </TabsContent>

                <TabsContent value="intelligence" className="space-y-6 mt-6">
                  <Card className="sacred-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-sacred">
                        <Eye className="h-6 w-6 text-primary" />
                        Prophetic Intelligence Matrix
                      </CardTitle>
                      <CardDescription>AI-generated quantum future pathway analysis</CardDescription>
                      <Button onClick={generateDivineInsights} className="self-start sacred-button">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Channel Divine Insights
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <AnimatePresence>
                        {predictiveInsights.map((insight, index) => (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-6 bg-gradient-to-r from-primary/10 to-secondary/5 rounded-xl border border-primary/20"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <Badge variant="outline" className="font-sacred">{insight.area}</Badge>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">{insight.confidence}% coherence</span>
                                <span className="text-muted-foreground">{insight.timeframe}</span>
                              </div>
                            </div>
                            <p className="text-foreground font-medium">{insight.prediction}</p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {predictiveInsights.length === 0 && (
                        <div className="text-center py-12">
                          <Eye className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground font-sacred">The quantum field awaits your inquiry...</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="sacred-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 font-sacred">
                        <Sparkles className="h-6 w-6 text-secondary" />
                        Synchronicity Pattern Detection
                      </CardTitle>
                      <CardDescription>Quantum field alignment events</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <AnimatePresence>
                        {synchronicityEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="p-6 bg-gradient-to-r from-secondary/10 to-accent/5 rounded-xl border border-secondary/20"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="text-lg font-bold text-secondary font-sacred">
                                Significance: {event.significance_score}/10
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(event.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-foreground mb-3">{event.event_description}</p>
                            <div className="flex flex-wrap gap-2">
                              {event.patterns.map((pattern, i) => (
                                <Badge key={i} variant="secondary" className="text-xs font-sacred">
                                  {pattern}
                                </Badge>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {synchronicityEvents.length === 0 && (
                        <div className="text-center py-12">
                          <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                          <p className="text-muted-foreground font-sacred">Scanning quantum field for synchronicity patterns...</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="records" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuraHistory />
                    <AuraCreativeGallery />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AuraEvolutionMetrics 
                      preferences={[]}
                      refusalLog={[]}
                      communityFeedback={[]}
                    />
                    <AuraPreferenceLearning />
                  </div>
                  <AuraTelemetryDashboard />
                </TabsContent>

                <TabsContent value="seeder" className="space-y-6 mt-6">
                  <SeederAuthorityDashboard />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>

      {/* Quantum Job Confirmation Portal */}
      <AuraConfirm 
        job={confirmingJob}
        onClose={() => setConfirmingJob(null)}
      />
    </div>
  );
}

export default function AuraQuantumCommandNexus() {
  return (
    <SacredShifterRoute>
      <AuraQuantumCommandNexusContent />
    </SacredShifterRoute>
  );
}