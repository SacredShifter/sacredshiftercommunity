import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConsciousnessConstellation } from '@/hooks/useConsciousnessConstellation';
import { ConstellationAnalyticsEngine } from './ConstellationAnalyticsEngine';
import { Brain, Zap, Eye, Heart, Sparkles, Activity } from 'lucide-react';

interface ConstellationNodeProps {
  position: [number, number, number];
  color: string;
  size: number;
  pattern: string;
  intensity: number;
}

interface ConsciousnessWeatherData {
  clarity: number;
  emotional_depth: number;
  spiritual_resonance: number;
  intuitive_flow: number;
  shadow_integration: number;
  forecast: string;
}

function ConstellationNode({ position, color, size, pattern, intensity }: ConstellationNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * intensity;
      meshRef.current.rotation.y += 0.01 * intensity;
      
      // Pulsing effect based on pattern
      const pulseFactor = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2 * intensity;
      meshRef.current.scale.setScalar(size * pulseFactor);
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[size, 16, 16]}>
      <meshPhongMaterial color={color} transparent opacity={0.8} />
    </Sphere>
  );
}

function SynchronicityConnection({ start, end, intensity }: { 
  start: [number, number, number]; 
  end: [number, number, number]; 
  intensity: number;
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  
  return (
    <Line
      points={points}
      color={`hsl(${280 + intensity * 40}, 70%, ${50 + intensity * 30}%)`}
      lineWidth={1 + intensity * 2}
      transparent
      opacity={0.3 + intensity * 0.4}
    />
  );
}

function ConstellationVisualization({ data }: { data: any }) {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);

  if (!data || !data.archetypal_patterns) {
    return null;
  }

  const nodes = data.archetypal_patterns.map((pattern: any, index: number) => {
    const direction = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    const position = direction.multiplyScalar(5 + Math.random() * 3);
    
    return {
      position: [position.x, position.y, position.z] as [number, number, number],
      color: pattern.color || '#8A2BE2',
      size: 0.3 + (pattern.activation_strength || 0.5) * 0.5,
      pattern: pattern.name,
      intensity: pattern.activation_strength || 0.5
    };
  });

  const connections = data.synchronicity_threads?.map((thread: any, index: number) => ({
    start: nodes[thread.from_pattern]?.position || [0, 0, 0],
    end: nodes[thread.to_pattern]?.position || [0, 0, 0],
    intensity: thread.strength || 0.5
  })) || [];

  return (
    <group>
      {nodes.map((node, index) => (
        <ConstellationNode
          key={index}
          position={node.position}
          color={node.color}
          size={node.size}
          pattern={node.pattern}
          intensity={node.intensity}
        />
      ))}
      
      {connections.map((connection, index) => (
        <SynchronicityConnection
          key={index}
          start={connection.start}
          end={connection.end}
          intensity={connection.intensity}
        />
      ))}
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8A2BE2" />
    </group>
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
          <TabsTrigger value="constellation">3D Constellation</TabsTrigger>
          <TabsTrigger value="weather">Consciousness Weather</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="constellation" className="space-y-4">
          <Card className="h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Your Living Consciousness Map
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ConstellationVisualization data={constellation} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>
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