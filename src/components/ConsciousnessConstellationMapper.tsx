import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useConsciousnessConstellation } from '@/hooks/useConsciousnessConstellation';
import { ConstellationAnalyticsEngine } from './ConstellationAnalyticsEngine';
import { Brain, Zap, Eye, Heart, Sparkles, Activity, Star, Circle } from 'lucide-react';

interface ConsciousnessWeatherData {
  clarity: number;
  emotional_depth: number;
  spiritual_resonance: number;
  intuitive_flow: number;
  shadow_integration: number;
  forecast: string;
}

// Simple 2D constellation visualization for now
function ConstellationVisualization({ data }: { data: any }) {
  if (!data || !data.archetypal_patterns) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        <div className="text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No constellation data available</p>
        </div>
      </div>
    );
  }

  const patterns = data.archetypal_patterns;
  const threads = data.synchronicity_threads || [];

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-br from-primary/5 via-purple/5 to-indigo/5 rounded-lg overflow-hidden">
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 400 400">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Flower of Life pattern */}
          <g transform="translate(200,200)">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <circle
                key={i}
                cx={Math.cos(i * Math.PI / 3) * 30}
                cy={Math.sin(i * Math.PI / 3) * 30}
                r="30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
            <circle cx="0" cy="0" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Constellation nodes */}
      <div className="absolute inset-0 p-8">
        {patterns.map((pattern: any, index: number) => {
          const angle = (index / patterns.length) * 2 * Math.PI;
          const radius = 120 + (pattern.activation_strength || 0.5) * 80;
          const x = 50 + Math.cos(angle) * radius / 400 * 80;
          const y = 50 + Math.sin(angle) * radius / 400 * 80;
          
          return (
            <motion.div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="relative group cursor-pointer">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
                  style={{ 
                    backgroundColor: pattern.color || '#8A2BE2',
                    boxShadow: `0 0 20px ${pattern.color || '#8A2BE2'}40`
                  }}
                >
                  <Star className="w-4 h-4 text-white" />
                </div>
                
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="font-medium">{pattern.name}</div>
                  <div className="text-muted-foreground">
                    {Math.round((pattern.activation_strength || 0) * 100)}%
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Synchronicity threads */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {threads.map((thread: any, index: number) => {
            const fromPattern = patterns[thread.from_pattern];
            const toPattern = patterns[thread.to_pattern];
            if (!fromPattern || !toPattern) return null;

            const fromAngle = (thread.from_pattern / patterns.length) * 2 * Math.PI;
            const toAngle = (thread.to_pattern / patterns.length) * 2 * Math.PI;
            const fromRadius = 120 + (fromPattern.activation_strength || 0.5) * 80;
            const toRadius = 120 + (toPattern.activation_strength || 0.5) * 80;
            
            const x1 = 50 + Math.cos(fromAngle) * fromRadius / 400 * 80;
            const y1 = 50 + Math.sin(fromAngle) * fromRadius / 400 * 80;
            const x2 = 50 + Math.cos(toAngle) * toRadius / 400 * 80;
            const y2 = 50 + Math.sin(toAngle) * toRadius / 400 * 80;

            return (
              <motion.line
                key={index}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={`hsl(${280 + (thread.strength || 0.5) * 40}, 70%, ${50 + (thread.strength || 0.5) * 30}%)`}
                strokeWidth={1 + (thread.strength || 0.5) * 2}
                opacity={0.3 + (thread.strength || 0.5) * 0.4}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: index * 0.1 + 1 }}
              />
            );
          })}
        </svg>
      </div>

      {/* Consciousness signature display */}
      {data.consciousness_signature && (
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-1">Consciousness Signature</div>
          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Freq:</span>
              <span className="ml-1 font-mono">
                {Math.round(data.consciousness_signature.frequency)}Hz
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Coherence:</span>
              <span className="ml-1 font-mono">
                {Math.round(data.consciousness_signature.coherence * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsciousnessWeather({ weather }: { weather: ConsciousnessWeatherData | null }) {
  if (!weather) return null;

  const weatherMetrics = [
    { label: 'Clarity', value: weather.clarity, icon: Eye, color: 'cyan' },
    { label: 'Emotional Depth', value: weather.emotional_depth, icon: Heart, color: 'rose' },
    { label: 'Spiritual Resonance', value: weather.spiritual_resonance, icon: Sparkles, color: 'purple' },
    { label: 'Intuitive Flow', value: weather.intuitive_flow, icon: Zap, color: 'blue' },
    { label: 'Shadow Integration', value: weather.shadow_integration, icon: Activity, color: 'gray' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {weatherMetrics.map((metric) => (
          <Card key={metric.label} className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{metric.label}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${metric.value * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round(metric.value * 100)}%
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="p-4">
        <h4 className="font-medium mb-2">Consciousness Forecast</h4>
        <p className="text-sm text-muted-foreground">{weather.forecast}</p>
      </Card>
    </div>
  );
}

export function ConsciousnessConstellationMapper() {
  const [activeView, setActiveView] = useState('constellation');
  const { 
    constellation, 
    weather, 
    patterns,
    isLoading, 
    generateConstellation,
    updatePattern 
  } = useConsciousnessConstellation();

  useEffect(() => {
    generateConstellation();
  }, [generateConstellation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Consciousness Constellation Mapper
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AI-powered consciousness cartography revealing your archetypal patterns, 
          synchronicity streams, and consciousness evolution in sacred geometric forms.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="outline">AI-Generated</Badge>
          <Badge variant="outline">Real-time Analysis</Badge>
          <Badge variant="outline">Sacred Geometry</Badge>
        </div>
      </motion.div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="constellation">2D Constellation</TabsTrigger>
          <TabsTrigger value="weather">Consciousness Weather</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="constellation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Living Consciousness Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConstellationVisualization data={constellation} />
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <Button onClick={() => generateConstellation()} className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Regenerate Constellation
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Consciousness Weather Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConsciousnessWeather weather={weather} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {patterns.map((pattern, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: pattern.color || '#8A2BE2' }}
                  />
                  <h4 className="font-medium">{pattern.name}</h4>
                  <Badge variant="secondary">
                    {Math.round((pattern.activation_strength || 0) * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {pattern.description}
                </p>
                <div className="text-xs text-muted-foreground">
                  Last activated: {pattern.last_activation || 'Never'}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ConstellationAnalyticsEngine data={constellation} />
        </TabsContent>
      </Tabs>
    </div>
  );
}