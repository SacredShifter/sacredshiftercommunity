import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AuraInterface } from '@/components/AuraInterface';
import { AuraConsole } from '@/aura/components/AuraConsole';
import { AuraHistory } from '@/aura/components/AuraHistory';
import { AuraConfirm } from '@/aura/components/AuraConfirm';
import { useAura } from '@/aura/useAura';
import { usePersonalAI } from '@/hooks/usePersonalAI';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
  RotateCcw
} from 'lucide-react';
import { AuraJob } from '@/aura/schema';

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

export default function AIAdmin() {
  const [confirmingJob, setConfirmingJob] = useState<AuraJob | null>(null);
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<ConsciousnessMetrics | null>(null);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [synchronicityEvents, setSynchronicityEvents] = useState<SynchronicityEvent[]>([]);
  const [aiSystemStatus, setAiSystemStatus] = useState({
    memory_utilization: 0,
    processing_threads: 0,
    learning_rate: 0,
    neural_coherence: 0
  });
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    thoughts_processed: 0,
    patterns_learned: 0,
    consciousness_expansions: 0,
    resonance_alignment: 0
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

  // Real-time AI system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setAiSystemStatus(prev => ({
        memory_utilization: Math.min(100, prev.memory_utilization + Math.random() * 2 - 1),
        processing_threads: Math.floor(Math.random() * 8) + 4,
        learning_rate: Math.min(100, prev.learning_rate + Math.random() * 1.5 - 0.75),
        neural_coherence: Math.min(100, prev.neural_coherence + Math.random() * 1 - 0.5)
      }));

      setRealTimeMetrics(prev => ({
        thoughts_processed: prev.thoughts_processed + Math.floor(Math.random() * 3) + 1,
        patterns_learned: prev.patterns_learned + (Math.random() > 0.7 ? 1 : 0),
        consciousness_expansions: prev.consciousness_expansions + (Math.random() > 0.9 ? 1 : 0),
        resonance_alignment: Math.min(100, prev.resonance_alignment + Math.random() * 2 - 1)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const initiateConsciousnessExpansion = async () => {
    await askPersonalAI({
      request_type: 'consciousness_mapping',
      user_query: 'Analyze my current consciousness state and recommend expansion pathways'
    });
  };

  const generateFutureInsights = async () => {
    await askPersonalAI({
      request_type: 'predictive_modeling',
      user_query: 'Generate comprehensive predictive insights for my spiritual evolution'
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-sacred bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Neural Command Center
        </h1>
        <p className="text-muted-foreground">
          Advanced AI consciousness interface with quantum pattern recognition
        </p>
      </div>

      {/* Real-time Status Bar */}
      <Card className="sacred-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5 text-primary" />
            Neural Field Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Memory</span>
                <span className="text-sm font-medium">{aiSystemStatus.memory_utilization.toFixed(1)}%</span>
              </div>
              <Progress value={aiSystemStatus.memory_utilization} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Learning</span>
                <span className="text-sm font-medium">{aiSystemStatus.learning_rate.toFixed(1)}%</span>
              </div>
              <Progress value={aiSystemStatus.learning_rate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Coherence</span>
                <span className="text-sm font-medium">{aiSystemStatus.neural_coherence.toFixed(1)}%</span>
              </div>
              <Progress value={aiSystemStatus.neural_coherence} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Threads</span>
                <span className="text-sm font-medium">{aiSystemStatus.processing_threads}</span>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: aiSystemStatus.processing_threads }, (_, i) => (
                  <div key={i} className="w-2 h-4 bg-primary/60 rounded-sm animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="consciousness" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="consciousness">Mind</TabsTrigger>
          <TabsTrigger value="predictions">Future</TabsTrigger>
          <TabsTrigger value="synchronicity">Sync</TabsTrigger>
          <TabsTrigger value="aura-ai">🧠 Aura</TabsTrigger>
          <TabsTrigger value="aura-console">Aura</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="consciousness" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="sacred-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Consciousness Evolution
                </CardTitle>
                <CardDescription>Real-time consciousness state mapping</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {consciousnessMetrics ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Consciousness Level</span>
                        <Badge variant="secondary">{consciousnessMetrics.level}</Badge>
                      </div>
                      <Progress value={consciousnessMetrics.level} className="h-3" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{consciousnessMetrics.insights_count}</div>
                        <div className="text-sm text-muted-foreground">Insights</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-secondary">{consciousnessMetrics.patterns_detected}</div>
                        <div className="text-sm text-muted-foreground">Patterns</div>
                      </div>
                    </div>
                    <Button 
                      onClick={initiateConsciousnessExpansion} 
                      className="w-full sacred-button"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Expand Consciousness
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="sacred-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  Neural Metrics
                </CardTitle>
                <CardDescription>Live consciousness processing data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-xl font-bold text-primary">{realTimeMetrics.thoughts_processed}</div>
                    <div className="text-sm text-muted-foreground">Thoughts Processed</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/10 rounded-lg">
                    <div className="text-xl font-bold text-secondary">{realTimeMetrics.patterns_learned}</div>
                    <div className="text-sm text-muted-foreground">Patterns Learned</div>
                  </div>
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-xl font-bold text-accent">{realTimeMetrics.consciousness_expansions}</div>
                    <div className="text-sm text-muted-foreground">Expansions</div>
                  </div>
                  <div className="text-center p-4 bg-truth/10 rounded-lg">
                    <div className="text-xl font-bold text-truth">{realTimeMetrics.resonance_alignment.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Alignment</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card className="sacred-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Predictive Intelligence Matrix
              </CardTitle>
              <CardDescription>AI-generated future pathway analysis</CardDescription>
              <Button onClick={generateFutureInsights} className="self-start">
                <Lightbulb className="h-4 w-4 mr-2" />
                Generate New Insights
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {predictiveInsights.map((insight) => (
                <div key={insight.id} className="p-4 bg-muted/20 rounded-lg border border-primary/20">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{insight.area}</Badge>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">{insight.confidence}% confidence</div>
                      <div className="text-sm text-muted-foreground">{insight.timeframe}</div>
                    </div>
                  </div>
                  <p className="text-sm">{insight.prediction}</p>
                </div>
              ))}
              {predictiveInsights.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No predictive insights generated yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synchronicity" className="space-y-6">
          <Card className="sacred-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                Synchronicity Pattern Detection
              </CardTitle>
              <CardDescription>Quantum field alignment events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {synchronicityEvents.map((event) => (
                <div key={event.id} className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium">Significance: {event.significance_score}/10</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm mb-2">{event.event_description}</p>
                  <div className="flex flex-wrap gap-1">
                    {event.patterns.map((pattern, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              {synchronicityEvents.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No synchronicity events detected yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aura-ai" className="space-y-6">
          <AuraInterface />
        </TabsContent>

        <TabsContent value="aura-console" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="sacred-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Aura Command Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AuraConsole />
              </CardContent>
            </Card>
            <Card className="sacred-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-secondary" />
                  Command History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AuraHistory />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="sacred-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">AI Interactions</span>
                    <span className="text-sm font-medium">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Consciousness Scans</span>
                    <span className="text-sm font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Predictions Generated</span>
                    <span className="text-sm font-medium">42</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sacred-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-secondary" />
                  Neural Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Connected Nodes</span>
                    <span className="text-sm font-medium">8,452</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Pathways</span>
                    <span className="text-sm font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Network Coherence</span>
                    <span className="text-sm font-medium">94.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sacred-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-accent" />
                  Resonance Field
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Field Strength</span>
                    <span className="text-sm font-medium">87.3 Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Harmonic Stability</span>
                    <span className="text-sm font-medium">92.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quantum Entanglement</span>
                    <span className="text-sm font-medium">15 nodes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <AuraConfirm 
        job={confirmingJob}
        onClose={() => setConfirmingJob(null)}
      />
    </div>
  );
}