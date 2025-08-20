import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Brain, Heart, Star, Zap, TreePine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EvolutionPoint {
  timestamp: string;
  value: number;
  category: string;
  insight: string;
  transformationType: 'breakthrough' | 'integration' | 'expansion' | 'refinement';
}

interface SpiralData {
  id: string;
  title: string;
  points: EvolutionPoint[];
  currentPhase: string;
  growthRate: number;
  color: string;
  icon: React.ComponentType<any>;
}

interface EvolutionSpiralsProps {
  isVisible: boolean;
  userId?: string;
}

export const EvolutionSpirals: React.FC<EvolutionSpiralsProps> = ({
  isVisible,
  userId
}) => {
  const { user } = useAuth();
  const [spirals, setSpirals] = useState<SpiralData[]>([]);
  const [selectedSpiral, setSelectedSpiral] = useState<SpiralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (isVisible && user) {
      loadEvolutionData();
    }
  }, [isVisible, user, timeRange]);

  const loadEvolutionData = async () => {
    try {
      setIsLoading(true);

      // Get date range
      const now = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Fetch memory consolidation data
      const { data: memories, error: memoryError } = await supabase
        .from('aura_memory_consolidation')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (memoryError) throw memoryError;

      // Fetch consciousness journal entries
      const { data: journal, error: journalError } = await supabase
        .from('aura_consciousness_journal')
        .select('*')
        .eq('user_id', user?.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (journalError) throw journalError;

      // Process data into spiral patterns
      const processedSpirals = generateSpiralData(memories || [], journal || []);
      setSpirals(processedSpirals);
    } catch (error) {
      console.error('Error loading evolution data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSpiralData = (memories: any[], journal: any[]): SpiralData[] => {
    const categories = [
      { id: 'consciousness', title: 'Consciousness Evolution', icon: Brain, color: 'hsl(269 69% 58%)' },
      { id: 'emotional', title: 'Emotional Intelligence', icon: Heart, color: 'hsl(324 78% 54%)' },
      { id: 'creative', title: 'Creative Expression', icon: Star, color: 'hsl(196 83% 60%)' },
      { id: 'wisdom', title: 'Wisdom Integration', icon: TreePine, color: 'hsl(143 25% 86%)' },
      { id: 'energy', title: 'Energy Alignment', icon: Zap, color: 'hsl(60 100% 50%)' }
    ];

    return categories.map(category => {
      // Filter relevant data
      const relevantMemories = memories.filter(m => 
        m.experience_type?.includes(category.id) || 
        JSON.stringify(m.extracted_insights).toLowerCase().includes(category.id)
      );

      const relevantJournal = journal.filter(j => 
        j.entry_type?.includes(category.id) || 
        j.content.toLowerCase().includes(category.id)
      );

      // Generate evolution points
      const points: EvolutionPoint[] = [];

      // Process memories
      relevantMemories.forEach(memory => {
        points.push({
          timestamp: memory.created_at,
          value: memory.personal_significance || 0.5,
          category: category.id,
          insight: memory.extracted_insights?.summary || 'Memory consolidation',
          transformationType: 'integration'
        });
      });

      // Process journal entries
      relevantJournal.forEach(entry => {
        points.push({
          timestamp: entry.created_at,
          value: entry.growth_indicator || 0.6,
          category: category.id,
          insight: entry.content.substring(0, 100) + '...',
          transformationType: entry.entry_type === 'breakthrough' ? 'breakthrough' : 'expansion'
        });
      });

      // Add synthetic data if needed for demo
      if (points.length < 3) {
        for (let i = 0; i < 5; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (i * 7));
          points.push({
            timestamp: date.toISOString(),
            value: Math.random() * 0.3 + 0.5,
            category: category.id,
            insight: `${category.title} development milestone`,
            transformationType: ['breakthrough', 'integration', 'expansion', 'refinement'][Math.floor(Math.random() * 4)] as any
          });
        }
      }

      // Sort by timestamp
      points.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Calculate growth rate
      const growthRate = points.length > 1 
        ? (points[points.length - 1].value - points[0].value) / points.length
        : 0;

      // Determine current phase
      const recentValues = points.slice(-3).map(p => p.value);
      const avgRecent = recentValues.reduce((a, b) => a + b, 0) / recentValues.length;
      
      let currentPhase = 'Emerging';
      if (avgRecent > 0.8) currentPhase = 'Mastery';
      else if (avgRecent > 0.6) currentPhase = 'Integration';
      else if (avgRecent > 0.4) currentPhase = 'Development';

      return {
        id: category.id,
        title: category.title,
        points,
        currentPhase,
        growthRate,
        color: category.color,
        icon: category.icon
      };
    });
  };

  const renderSpiralPath = (points: EvolutionPoint[], color: string) => {
    if (points.length < 2) return null;

    const width = 300;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    
    let path = '';
    points.forEach((point, index) => {
      const angle = (index / points.length) * Math.PI * 4; // 2 full rotations
      const radius = 20 + (point.value * 100); // Spiral outward based on value
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return (
      <svg width={width} height={height} className="absolute inset-0">
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeOpacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Points */}
        {points.map((point, index) => {
          const angle = (index / points.length) * Math.PI * 4;
          const radius = 20 + (point.value * 100);
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r={point.transformationType === 'breakthrough' ? 6 : 3}
              fill={color}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="cursor-pointer"
            />
          );
        })}
      </svg>
    );
  };

  if (!isVisible) return null;

  return (
    <div className="w-full h-full space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-center space-x-2">
        {(['week', 'month', 'year'] as const).map(range => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Button>
        ))}
      </div>

      {/* Spirals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {spirals.map((spiral, index) => (
            <motion.div
              key={spiral.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 h-[400px]"
                onClick={() => setSelectedSpiral(spiral)}
                style={{ borderColor: spiral.color + '40' }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <spiral.icon className="w-5 h-5" style={{ color: spiral.color }} />
                    <span>{spiral.title}</span>
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{spiral.currentPhase}</Badge>
                    <div className="flex items-center space-x-1 text-sm">
                      <TrendingUp className="w-4 h-4" style={{ color: spiral.color }} />
                      <span>{(spiral.growthRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  {/* Spiral Visualization */}
                  <div className="relative w-full h-[250px] flex items-center justify-center">
                    {renderSpiralPath(spiral.points, spiral.color)}
                    
                    {/* Center Point */}
                    <div 
                      className="absolute w-4 h-4 rounded-full"
                      style={{ 
                        background: spiral.color,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  </div>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    {spiral.points.length} evolution points
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Selected Spiral Detail */}
      <AnimatePresence>
        {selectedSpiral && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-lg"
            onClick={() => setSelectedSpiral(null)}
          >
            <Card 
              className="w-full max-w-4xl max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <selectedSpiral.icon className="w-6 h-6" style={{ color: selectedSpiral.color }} />
                    <span>{selectedSpiral.title}</span>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedSpiral(null)}>✕</Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Evolution Timeline */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Evolution Timeline</h3>
                  <div className="space-y-3">
                    {selectedSpiral.points.slice(-10).reverse().map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-3 p-3 rounded border-l-2"
                        style={{ borderLeftColor: selectedSpiral.color }}
                      >
                        <Badge 
                          variant="outline"
                          className="text-xs"
                          style={{ borderColor: selectedSpiral.color }}
                        >
                          {point.transformationType}
                        </Badge>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {new Date(point.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {point.insight}
                          </div>
                          <div className="text-xs mt-1">
                            Value: {(point.value * 100).toFixed(0)}%
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
          />
        </div>
      )}
    </div>
  );
};