import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gauge, Timer, Heart, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface SpeedComparisonProps {
  mode: 'trust' | 'data';
  isActive: boolean;
  onAbsorptionChange: (rate: number) => void;
}

function SpeedComparison({ mode, isActive, onAbsorptionChange }: SpeedComparisonProps) {
  const brainRef = useRef<THREE.Mesh>(null);
  const [absorptionRate, setAbsorptionRate] = useState(0);

  useFrame((state) => {
    if (!isActive) return;

    if (brainRef.current) {
      const pulseFactor = mode === 'trust' ? 0.1 : 0.3;
      brainRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * pulseFactor);
    }

    // Simulate absorption rate based on mode
    const targetRate = mode === 'trust' ? 85 : 35;
    setAbsorptionRate(prev => {
      const newRate = prev + (targetRate - prev) * 0.02;
      onAbsorptionChange(newRate);
      return newRate;
    });
  });

  const brainColor = mode === 'trust' ? '#10b981' : '#ef4444';

  return (
    <group>
      {/* Central brain/consciousness */}
      <mesh ref={brainRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color={brainColor}
          transparent
          opacity={0.7}
          emissive={brainColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Information particles */}
      {isActive && [0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
        const particleCount = mode === 'trust' ? 8 : 16;
        if (index >= particleCount) return null;
        
        return (
          <mesh
            key={index}
            position={[
              Math.cos(index * Math.PI / 4) * (6 + Math.sin(Date.now() * 0.001 * (index + 1)) * 2),
              Math.sin(index * Math.PI / 6) * 3,
              Math.sin(index * Math.PI / 4) * (6 + Math.cos(Date.now() * 0.001 * (index + 1)) * 2)
            ]}
          >
            <sphereGeometry args={[mode === 'trust' ? 0.15 : 0.08, 8, 8]} />
            <meshStandardMaterial
              color={mode === 'trust' ? '#34d399' : '#f87171'}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {/* Absorption field visualization */}
      <mesh>
        <sphereGeometry args={[4, 16, 16]} />
        <meshStandardMaterial
          color={brainColor}
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>

      {/* Mode label */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.8}
        color={brainColor}
        anchorX="center"
        anchorY="middle"
      >
        {mode === 'trust' ? 'TRUST SPEED LEARNING' : 'DATA SPEED LEARNING'}
      </Text>

      {/* Absorption rate display */}
      <Text
        position={[0, -6, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Absorption: {absorptionRate.toFixed(1)}%
      </Text>
    </group>
  );
}

export default function SpeedOfTrust3D() {
  const [currentMode, setCurrentMode] = useState<'trust' | 'data'>('trust');
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [absorptionRate, setAbsorptionRate] = useState(0);
  const [metrics, setMetrics] = useState({
    comprehension: 0,
    retention: 0,
    stress: 0,
    flow: 0
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        // Update metrics based on mode
        setMetrics(prev => ({
          comprehension: Math.min(100, prev.comprehension + (currentMode === 'trust' ? 3 : 1)),
          retention: Math.min(100, prev.retention + (currentMode === 'trust' ? 2.5 : 0.8)),
          stress: currentMode === 'trust' ? Math.max(0, prev.stress - 1) : Math.min(100, prev.stress + 2),
          flow: currentMode === 'trust' ? Math.min(100, prev.flow + 2) : Math.max(0, prev.flow - 1.5)
        }));
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRunning, currentMode]);

  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setSessionTime(0);
      setMetrics({ comprehension: 0, retention: 0, stress: 0, flow: 0 });
      setAbsorptionRate(0);
    }
  };

  const getModeDescription = () => {
    if (currentMode === 'trust') {
      return {
        title: 'Trust Speed Learning',
        description: 'Information flows at the pace of understanding and integration',
        characteristics: [
          'Paced delivery honors cognitive readiness',
          'Natural integration prevents overwhelm',
          'Builds on existing knowledge foundation',
          'Maintains emotional safety throughout'
        ]
      };
    } else {
      return {
        title: 'Data Speed Learning',  
        description: 'Information pushed regardless of receiver readiness',
        characteristics: [
          'High volume creates cognitive overload',
          'Triggers defensive resistance patterns',
          'Fragmentary comprehension',
          'Stress response inhibits retention'
        ]
      };
    }
  };

  const modeInfo = getModeDescription();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Gauge className="h-5 w-5" />
              Speed of Trust Dynamics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant={currentMode === 'trust' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentMode('trust')}
                  className="flex-1"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Trust
                </Button>
                <Button
                  variant={currentMode === 'data' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentMode('data')}
                  className="flex-1"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Data
                </Button>
              </div>
              
              <Button
                onClick={handleToggleRunning}
                className="w-full"
                variant={isRunning ? 'destructive' : 'default'}
              >
                <Timer className="h-4 w-4 mr-2" />
                {isRunning ? 'Stop Simulation' : 'Start Simulation'}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="text-xs">
                <div className="flex justify-between mb-1">
                  <span>Session Time</span>
                  <Badge variant="outline">{(sessionTime / 10).toFixed(1)}s</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Absorption Rate</span>
                    <span>{absorptionRate.toFixed(0)}%</span>
                  </div>
                  <Progress value={absorptionRate} />
                </div>

                {/* Real-time metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Comprehension</span>
                      <span>{metrics.comprehension.toFixed(0)}%</span>
                    </div>
                    <Progress value={metrics.comprehension} className="h-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Retention</span>
                      <span>{metrics.retention.toFixed(0)}%</span>
                    </div>
                    <Progress value={metrics.retention} className="h-1" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Stress Level</span>
                      <span>{metrics.stress.toFixed(0)}%</span>
                    </div>
                    <Progress value={metrics.stress} className="h-1" />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Flow State</span>
                      <span>{metrics.flow.toFixed(0)}%</span>
                    </div>
                    <Progress value={metrics.flow} className="h-1" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mode Information */}
      <div className="absolute top-4 right-4 z-10 w-80 space-y-4">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm">{modeInfo.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{modeInfo.description}</p>
            
            <div>
              <p className="font-medium mb-2">Key Characteristics:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                {modeInfo.characteristics.map((char, index) => (
                  <li key={index}>• {char}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Learning Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center p-2 bg-primary/10 rounded">
                <div className="font-medium">Trust Speed</div>
                <div className="text-emerald-400">95% Efficiency</div>
              </div>
              <div className="text-center p-2 bg-primary/10 rounded">
                <div className="font-medium">Data Speed</div>
                <div className="text-red-400">35% Efficiency</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [10, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={0.5} 
          color={currentMode === 'trust' ? '#10b981' : '#ef4444'} 
        />
        
        <SpeedComparison 
          mode={currentMode} 
          isActive={isRunning} 
          onAbsorptionChange={setAbsorptionRate}
        />
        
        <OrbitControls enablePan={false} maxDistance={20} minDistance={8} />
      </Canvas>

      {/* Bottom Insight */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/20 max-w-3xl"
        >
          <p className="text-center text-primary font-medium">
            {currentMode === 'trust' 
              ? "Trust speed honors the natural learning rhythm. Information becomes wisdom when received with readiness."
              : "Data speed overwhelms the system. Faster input doesn't equal faster learning—it creates resistance and reduces retention."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}