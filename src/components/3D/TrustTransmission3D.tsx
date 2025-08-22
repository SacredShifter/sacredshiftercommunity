import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Radio, Heart, Zap, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface TrustWaveProps {
  isTransmitting: boolean;
  speed: 'data' | 'trust';
}

function TrustWave({ isTransmitting, speed }: TrustWaveProps) {
  const waveRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!isTransmitting) return;

    if (waveRef.current) {
      const time = state.clock.elapsedTime;
      const speedMultiplier = speed === 'trust' ? 0.5 : 2.0;
      
      waveRef.current.rotation.y += 0.01 * speedMultiplier;
      waveRef.current.scale.setScalar(1 + Math.sin(time * speedMultiplier) * 0.3);
    }
  });

  const waveColor = speed === 'trust' ? '#10b981' : '#ef4444';

  return (
    <group>
      {/* Central transmission sphere */}
      <mesh ref={waveRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color={waveColor}
          transparent
          opacity={0.6}
          emissive={waveColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Simple particle indicators */}
      {isTransmitting && [0, 1, 2, 3, 4].map((index) => {
        const x = Math.cos(index * Math.PI * 0.4) * (4 + index);
        const y = Math.sin(index * Math.PI * 0.3) * 2;
        const z = Math.sin(index * Math.PI * 0.4) * (4 + index);
        return (
          <mesh key={index} position={[x, y, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              color={speed === 'trust' ? '#34d399' : '#f87171'}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}

      {/* Transmission rings */}
      {isTransmitting && [4, 6, 8].map((radius, index) => (
        <mesh
          key={index}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[radius - 0.1, radius + 0.1, 32]} />
          <meshStandardMaterial
            color={waveColor}
            transparent
            opacity={0.3 - index * 0.1}
            emissive={waveColor}
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}

      {/* Speed indicator text */}
      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color={waveColor}
        anchorX="center"
        anchorY="middle"
      >
        {speed === 'trust' ? 'TRUST SPEED' : 'DATA SPEED'}
      </Text>
    </group>
  );
}

export default function TrustTransmission3D() {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionMode, setTransmissionMode] = useState<'data' | 'trust'>('trust');
  const [transmissionProgress, setTransmissionProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTransmitting) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        setTransmissionProgress(prev => {
          const increment = transmissionMode === 'trust' ? 2 : 1;
          return Math.min(prev + increment, 100);
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isTransmitting, transmissionMode]);

  const handleStartTransmission = () => {
    setIsTransmitting(!isTransmitting);
    if (!isTransmitting) {
      setTransmissionProgress(0);
      setSessionTime(0);
    }
  };

  const getTransmissionStats = () => {
    if (transmissionMode === 'trust') {
      return {
        efficiency: '95%',
        integrity: '100%',
        resonance: 'High',
        description: 'Information flows at the speed of understanding and acceptance'
      };
    } else {
      return {
        efficiency: '45%',
        integrity: '60%', 
        resonance: 'Fragmented',
        description: 'Information overwhelm creates resistance and partial comprehension'
      };
    }
  };

  const stats = getTransmissionStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-black relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Radio className="h-5 w-5" />
              Trust Transmission Chamber
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant={transmissionMode === 'trust' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTransmissionMode('trust')}
                  className="flex-1"
                >
                  Trust Speed
                </Button>
                <Button
                  variant={transmissionMode === 'data' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTransmissionMode('data')}
                  className="flex-1"
                >
                  Data Speed
                </Button>
              </div>
              
              <Button
                onClick={handleStartTransmission}
                className="w-full"
                variant={isTransmitting ? 'destructive' : 'default'}
              >
                {isTransmitting ? 'Stop Transmission' : 'Start Transmission'}
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Transmission Progress</span>
                  <span>{transmissionProgress.toFixed(0)}%</span>
                </div>
                <Progress value={transmissionProgress} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Efficiency:</span>
                    <Badge variant="outline" className="text-xs">{stats.efficiency}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Integrity:</span>
                    <Badge variant="outline" className="text-xs">{stats.integrity}</Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Resonance:</span>
                    <Badge variant="outline" className="text-xs">{stats.resonance}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <Badge variant="outline" className="text-xs">{(sessionTime / 10).toFixed(1)}s</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Panel */}
      <div className="absolute top-4 right-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm">Current Mode: {transmissionMode === 'trust' ? 'Trust Speed' : 'Data Speed'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{stats.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-emerald-400" />
                <span className="font-medium">Trust Speed Characteristics:</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>• Information arrives when consciousness is ready</li>
                <li>• Integration happens at natural pace</li>
                <li>• No overwhelm or cognitive resistance</li>
                <li>• Builds on existing understanding</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-red-400" />
                <span className="font-medium">Data Speed Characteristics:</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>• Information forced regardless of readiness</li>
                <li>• Creates cognitive overload</li>
                <li>• Triggers defensive resistance</li>
                <li>• Fragmented comprehension</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [10, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={0.5} 
          color={transmissionMode === 'trust' ? '#10b981' : '#ef4444'} 
        />
        
        <TrustWave isTransmitting={isTransmitting} speed={transmissionMode} />
        
        <OrbitControls enablePan={false} maxDistance={20} minDistance={8} />
      </Canvas>

      {/* Bottom Insight */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/20 max-w-2xl"
        >
          <p className="text-center text-primary font-medium">
            {transmissionMode === 'trust' 
              ? "Trust transmission honors the receiver's readiness. Learning becomes integration, not information accumulation."
              : "Data speed creates resistance. The faster you push, the more the system pushes back."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}