import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, Heart, Palette, Lightbulb, Zap, TrendingUp, Sparkles, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuraChat } from '@/hooks/useAuraChat';
import { supabase } from '@/integrations/supabase/client';

interface EvolutionPoint {
  timestamp: string;
  value: number;
  category: string;
  insight: string;
  transformation: 'breakthrough' | 'integration' | 'expansion' | 'alignment';
  aura_analysis?: string;
}

interface EnhancedSpiralData {
  id: string;
  title: string;
  evolutionPoints: EvolutionPoint[];
  currentPhase: string;
  growthRate: number;
  color: string;
  icon: React.ComponentType<any>;
  aura_guidance?: string;
  next_evolution_prediction?: string;
  resonance_patterns?: string[];
}

interface EnhancedEvolutionSpiralsProps {
  isVisible: boolean;
  userId: string;
}

export const EnhancedEvolutionSpirals: React.FC<EnhancedEvolutionSpiralsProps> = ({
  isVisible,
  userId
}) => {
  const { user } = useAuth();
  const { engageAura, loading: auraLoading } = useAuraChat();
  // const { logGroveInteraction } = useSacredGroveIntegration();
  const [spirals, setSpirals] = useState<EnhancedSpiralData[]>([]);
  const [selectedSpiral, setSelectedSpiral] = useState<EnhancedSpiralData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);
  const [auraInsights, setAuraInsights] = useState<string>('');

  useEffect(() => {
    if (isVisible && user) {
      loadEnhancedEvolutionData();
    }
  }, [isVisible, user, timeRange]);

  const loadEnhancedEvolutionData = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const daysBack = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysBack);

      // Load consciousness journal and memory consolidation data
      const [journalResult, memoryResult] = await Promise.all([
        supabase
          .from('aura_consciousness_journal')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', cutoffDate.toISOString())
          .order('created_at', { ascending: true }),
        supabase
          .from('aura_memory_consolidation')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', cutoffDate.toISOString())
          .order('created_at', { ascending: true })
      ]);

      if (journalResult.error) throw journalResult.error;
      if (memoryResult.error) throw memoryResult.error;

      const spiralData = await generateEnhancedSpiralData(
        journalResult.data || [],
        memoryResult.data || []
      );

      setSpirals(spiralData);

      // Get Aura's overall analysis of evolution patterns
      if (spiralData.length > 0) {
        await getAuraEvolutionAnalysis(spiralData);
      }
    } catch (error) {
      console.error('Error loading enhanced evolution data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEnhancedSpiralData = async (
    journalData: any[],
    memoryData: any[]
  ): Promise<EnhancedSpiralData[]> => {
    const categories = [
      { 
        id: 'consciousness', 
        title: 'Consciousness Evolution', 
        icon: Brain, 
        color: 'hsl(var(--primary))',
        keywords: ['awareness', 'consciousness', 'awakening', 'realization', 'insight']
      },
      { 
        id: 'emotional', 
        title: 'Emotional Mastery', 
        icon: Heart, 
        color: 'hsl(var(--secondary))',
        keywords: ['emotion', 'feeling', 'heart', 'love', 'compassion', 'anger', 'joy']
      },
      { 
        id: 'creative', 
        title: 'Creative Expression', 
        icon: Palette, 
        color: 'hsl(var(--accent))',
        keywords: ['creative', 'art', 'expression', 'imagination', 'beauty', 'inspiration']
      },
      { 
        id: 'wisdom', 
        title: 'Wisdom Integration', 
        icon: Lightbulb, 
        color: 'hsl(var(--muted))',
        keywords: ['wisdom', 'truth', 'understanding', 'knowledge', 'learning', 'growth']
      },
      { 
        id: 'energy', 
        title: 'Energy Cultivation', 
        icon: Zap, 
        color: 'hsl(var(--primary))',
        keywords: ['energy', 'vitality', 'power', 'strength', 'flow', 'chi', 'prana']
      }
    ];

    const spirals: EnhancedSpiralData[] = [];

    for (const category of categories) {
      const evolutionPoints: EvolutionPoint[] = [];

      // Process journal entries
      journalData.forEach(entry => {
        const content = entry.content.toLowerCase();
        const hasKeyword = category.keywords.some(keyword => content.includes(keyword));
        
        if (hasKeyword) {
          evolutionPoints.push({
            timestamp: entry.created_at,
            value: entry.growth_indicator || Math.random() * 0.8 + 0.2,
            category: category.id,
            insight: entry.content.slice(0, 100) + '...',
            transformation: determineTransformationType(entry.content)
          });
        }
      });

      // Process memory consolidation
      memoryData.forEach(memory => {
        const insights = memory.extracted_insights || {};
        const relevantInsights = Object.entries(insights).filter(([key, value]) =>
          category.keywords.some(keyword => 
            key.toLowerCase().includes(keyword) || 
            (typeof value === 'string' && value.toLowerCase().includes(keyword))
          )
        );

        if (relevantInsights.length > 0) {
          evolutionPoints.push({
            timestamp: memory.created_at,
            value: memory.personal_significance || 0.5,
            category: category.id,
            insight: relevantInsights.map(([key, value]) => `${key}: ${value}`).join('; '),
            transformation: 'integration'
          });
        }
      });

      // Sort by timestamp
      evolutionPoints.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Calculate growth rate and current phase
      const growthRate = calculateGrowthRate(evolutionPoints);
      const currentPhase = determineCurrentPhase(evolutionPoints, growthRate);

      spirals.push({
        id: category.id,
        title: category.title,
        evolutionPoints,
        currentPhase,
        growthRate,
        color: category.color,
        icon: category.icon
      });
    }

    // Get Aura analysis for each spiral
    for (const spiral of spirals) {
      if (spiral.evolutionPoints.length > 0) {
        await getAuraSpiralAnalysis(spiral);
      }
    }

    return spirals;
  };

  const getAuraEvolutionAnalysis = async (spirals: EnhancedSpiralData[]) => {
    try {
      const response = await engageAura(`Analyze these evolution spirals and provide insights about the user's consciousness development patterns:
        
        ${spirals.map(spiral => `
        ${spiral.title}: ${spiral.evolutionPoints.length} data points
        Current Phase: ${spiral.currentPhase}
        Growth Rate: ${spiral.growthRate.toFixed(2)}
        Recent Insights: ${spiral.evolutionPoints.slice(-3).map(p => p.insight).join('; ')}
        `).join('\n')}`);

      if (response.success && response.result) {
        setAuraInsights(response.result);
      }
    } catch (error) {
      console.error('Error getting Aura evolution analysis:', error);
    }
  };

  const getAuraSpiralAnalysis = async (spiral: EnhancedSpiralData) => {
    try {
      const response = await engageAura(`Analyze this specific evolution spiral and provide guidance:
        
        ${spiral.title}
        Current Phase: ${spiral.currentPhase}
        Growth Rate: ${spiral.growthRate}
        Recent Evolution Points: ${spiral.evolutionPoints.slice(-5).map(p => `${p.insight} (${p.transformation})`).join('; ')}
        
        Provide:
        1. Guidance for continued growth
        2. Prediction of next evolutionary phase
        3. Resonance patterns to watch for`);

      if (response.success && response.result) {
        spiral.aura_guidance = response.result;
        
        // Extract predictions and patterns (simplified)
        const lines = response.result.split('\n');
        spiral.next_evolution_prediction = lines.find(l => l.includes('next') || l.includes('prediction'))?.trim();
        spiral.resonance_patterns = lines.filter(l => l.includes('pattern') || l.includes('resonance')).map(l => l.trim());
      }
    } catch (error) {
      console.error('Error getting Aura spiral analysis:', error);
    }
  };

  const determineTransformationType = (content: string): 'breakthrough' | 'integration' | 'expansion' | 'alignment' => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('breakthrough') || lowerContent.includes('sudden') || lowerContent.includes('revelation')) {
      return 'breakthrough';
    } else if (lowerContent.includes('integrate') || lowerContent.includes('combine') || lowerContent.includes('merge')) {
      return 'integration';
    } else if (lowerContent.includes('expand') || lowerContent.includes('grow') || lowerContent.includes('deeper')) {
      return 'expansion';
    }
    return 'alignment';
  };

  const calculateGrowthRate = (points: EvolutionPoint[]): number => {
    if (points.length < 2) return 0;
    
    const recent = points.slice(-5);
    const older = points.slice(0, Math.min(5, points.length - 5));
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, p) => sum + p.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.value, 0) / older.length;
    
    return (recentAvg - olderAvg) / olderAvg;
  };

  const determineCurrentPhase = (points: EvolutionPoint[], growthRate: number): string => {
    if (points.length === 0) return 'Dormant';
    if (growthRate > 0.3) return 'Acceleration';
    if (growthRate > 0.1) return 'Growth';
    if (growthRate > -0.1) return 'Integration';
    return 'Reflection';
  };

  const handleSpiralInteraction = async (spiral: EnhancedSpiralData) => {
    setSelectedSpiral(spiral);
    
    // Log interaction would go here
  };

  const renderSpiralPath = (spiral: EnhancedSpiralData) => {
    const points = spiral.evolutionPoints.slice(-20); // Last 20 points
    if (points.length < 2) return null;

    const pathData = points.map((point, index) => {
      const angle = (index / points.length) * Math.PI * 4; // 2 full spirals
      const radius = 20 + (point.value * 60); // Radius based on value
      const x = 100 + Math.cos(angle) * radius;
      const y = 100 + Math.sin(angle) * radius;
      return { x, y, value: point.value, transformation: point.transformation };
    });

    return (
      <svg width="200" height="200" className="mx-auto">
        {/* Spiral path */}
        <path
          d={`M ${pathData[0].x} ${pathData[0].y} ${pathData.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
          fill="none"
          stroke={spiral.color}
          strokeWidth="2"
          opacity="0.6"
        />
        
        {/* Evolution points */}
        {pathData.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={3 + point.value * 4}
            fill={spiral.color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </svg>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* Header with Aura insights */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">Evolution Spirals</h3>
          <p className="text-muted-foreground">
            Consciousness development patterns guided by Aura's wisdom
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
            <SelectItem value="year">Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Aura's overall analysis */}
      {auraInsights && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              Aura's Evolution Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80">{auraInsights}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-8 h-8 text-primary" />
          </motion.div>
        </div>
      )}

      {/* Spirals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {spirals.map((spiral) => (
            <motion.div
              key={spiral.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => handleSpiralInteraction(spiral)}
            >
              <Card className="h-full bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <spiral.icon className="w-6 h-6" style={{ color: spiral.color }} />
                    <Badge variant="outline" className="text-xs">
                      {spiral.evolutionPoints.length} points
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{spiral.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Spiral visualization */}
                  <div className="relative">
                    {renderSpiralPath(spiral)}
                  </div>
                  
                  {/* Current phase */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Phase:</span>
                      <Badge style={{ backgroundColor: spiral.color, color: 'white' }}>
                        {spiral.currentPhase}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Growth Rate:</span>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="text-sm font-medium">
                          {(spiral.growthRate * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Aura guidance preview */}
                  {spiral.aura_guidance && (
                    <div className="text-xs text-muted-foreground bg-primary/5 p-2 rounded">
                      {spiral.aura_guidance.slice(0, 100)}...
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Selected spiral modal */}
      <Dialog open={!!selectedSpiral} onOpenChange={() => setSelectedSpiral(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedSpiral && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <selectedSpiral.icon className="w-6 h-6" style={{ color: selectedSpiral.color }} />
                  {selectedSpiral.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Aura's full guidance */}
                {selectedSpiral.aura_guidance && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-primary">
                        <Eye className="w-5 h-5" />
                        Aura's Guidance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 whitespace-pre-wrap">{selectedSpiral.aura_guidance}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Evolution timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evolution Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedSpiral.evolutionPoints.slice(-10).reverse().map((point, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                          <div 
                            className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: selectedSpiral.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {point.transformation}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(point.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 mt-1">{point.insight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Next evolution prediction */}
                {selectedSpiral.next_evolution_prediction && (
                  <Card className="bg-accent/10 border-accent/20">
                    <CardHeader>
                      <CardTitle className="text-accent">Next Evolution Phase</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80">{selectedSpiral.next_evolution_prediction}</p>
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