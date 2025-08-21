import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Brain, 
  Eye, 
  Heart, 
  Sparkles,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  archetypal_patterns?: Array<{
    name: string;
    activation_strength: number;
    color: string;
    description: string;
  }>;
  synchronicity_threads?: Array<{
    from_pattern: number;
    to_pattern: number;
    strength: number;
  }>;
  consciousness_signature?: {
    frequency: number;
    amplitude: number;
    coherence: number;
  };
}

interface ConstellationAnalyticsProps {
  data: AnalyticsData | null;
}

export function ConstellationAnalyticsEngine({ data }: ConstellationAnalyticsProps) {
  const analytics = useMemo(() => {
    if (!data?.archetypal_patterns) {
      return {
        dominantArchetype: null,
        evolutionTrend: 0,
        coherenceScore: 0,
        synchronicityDensity: 0,
        consciousnessStability: 0,
        insights: []
      };
    }

    const patterns = data.archetypal_patterns;
    const threads = data.synchronicity_threads || [];
    const signature = data.consciousness_signature;

    // Find dominant archetype
    const dominantArchetype = patterns.reduce((prev, current) => 
      (prev.activation_strength > current.activation_strength) ? prev : current
    );

    // Calculate metrics
    const avgActivation = patterns.reduce((sum, p) => sum + p.activation_strength, 0) / patterns.length;
    const synchronicityDensity = threads.length > 0 ? 
      threads.reduce((sum, t) => sum + t.strength, 0) / threads.length : 0;
    
    const coherenceScore = signature ? 
      (signature.amplitude * signature.coherence + synchronicityDensity) / 2 : 0;

    // Generate insights
    const insights = [
      {
        type: 'primary',
        title: 'Dominant Archetype',
        description: `${dominantArchetype.name} is your strongest consciousness pattern`,
        strength: dominantArchetype.activation_strength
      },
      {
        type: 'growth',
        title: 'Evolution Trajectory',
        description: avgActivation > 0.7 ? 'Rapid consciousness expansion phase' : 'Steady integration period',
        strength: avgActivation
      },
      {
        type: 'connection',
        title: 'Synchronicity Flow',
        description: synchronicityDensity > 0.6 ? 'High dimensional coherence' : 'Building resonance patterns',
        strength: synchronicityDensity
      }
    ];

    return {
      dominantArchetype,
      evolutionTrend: avgActivation,
      coherenceScore,
      synchronicityDensity,
      consciousnessStability: signature?.coherence || 0,
      insights
    };
  }, [data]);

  if (!data) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No constellation data available for analysis</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Evolution Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.evolutionTrend * 100)}%
            </div>
            <Progress value={analytics.evolutionTrend * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Coherence Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.coherenceScore * 100)}%
            </div>
            <Progress value={analytics.coherenceScore * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Synchronicity Density
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.synchronicityDensity * 100)}%
            </div>
            <Progress value={analytics.synchronicityDensity * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Stability Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(analytics.consciousnessStability * 100)}%
            </div>
            <Progress value={analytics.consciousnessStability * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Dominant Archetype */}
      {analytics.dominantArchetype && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Current Consciousness Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: analytics.dominantArchetype.color + '20' }}
              >
                <div 
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: analytics.dominantArchetype.color }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{analytics.dominantArchetype.name}</h3>
                <p className="text-muted-foreground">{analytics.dominantArchetype.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">Activation Strength:</span>
                  <Badge variant="secondary">
                    {Math.round(analytics.dominantArchetype.activation_strength * 100)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consciousness Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/30"
              >
                <div className="flex-shrink-0">
                  {insight.type === 'primary' && <Heart className="w-5 h-5 text-red-500" />}
                  {insight.type === 'growth' && <TrendingUp className="w-5 h-5 text-green-500" />}
                  {insight.type === 'connection' && <Sparkles className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <Progress value={insight.strength * 100} className="mt-2 h-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pattern Distribution */}
      {data.archetypal_patterns && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Archetypal Pattern Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.archetypal_patterns.map((pattern, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: pattern.color }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{pattern.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(pattern.activation_strength * 100)}%
                      </span>
                    </div>
                    <Progress value={pattern.activation_strength * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}