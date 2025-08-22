import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Heart, Zap, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface GateProps {
  scene: 'hall' | 'crossing' | 'expansion' | 'integration';
  fearLevel: number;
  isComfortable: boolean;
}

function LiberationGate({ scene, fearLevel, isComfortable }: GateProps) {
  const gateRef = useRef<THREE.Group>(null);
  const fearFogRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (gateRef.current) {
      gateRef.current.rotation.y += 0.002;
    }
    
    if (fearFogRef.current && scene === 'hall') {
      const fogIntensity = fearLevel / 10;
      const material = fearFogRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = fogIntensity * 0.3;
      fearFogRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime) * fogIntensity * 0.2);
    }
  });

  const gateColor = scene === 'crossing' ? '#fbbf24' : '#10b981';
  const gateOpacity = scene === 'hall' ? 0.3 : 0.8;

  return (
    <group ref={gateRef}>
      {/* Gate Portal */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[3, 0.3, 16, 32]} />
        <meshStandardMaterial
          color={gateColor}
          transparent
          opacity={gateOpacity}
          emissive={gateColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner Light */}
      {scene !== 'hall' && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.1}
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}

      {/* Fear Fog */}
      {scene === 'hall' && (
        <mesh ref={fearFogRef} position={[0, 0, 0]}>
          <sphereGeometry args={[5, 16, 16]} />
          <meshStandardMaterial
            color="#666666"
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Threshold Markers */}
      {[0, 1, 2, 3].map((index) => (
        <mesh
          key={index}
          position={[
            Math.cos(index * Math.PI * 0.5) * 4,
            0,
            Math.sin(index * Math.PI * 0.5) * 4
          ]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color={scene === 'crossing' ? '#fbbf24' : '#10b981'}
            emissive={scene === 'crossing' ? '#fbbf24' : '#10b981'}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Scene Label */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.8}
        color={gateColor}
        anchorX="center"
        anchorY="middle"
      >
        {scene.toUpperCase()}
      </Text>
    </group>
  );
}

export default function GateOfLiberation3D() {
  const [currentScene, setCurrentScene] = useState<'hall' | 'crossing' | 'expansion' | 'integration'>('hall');
  const [fearLevel, setFearLevel] = useState(7);
  const [breathCycles, setBreathCycles] = useState(0);
  const [isComfortable, setIsComfortable] = useState(true);
  const [crossingComplete, setCrossingComplete] = useState(false);

  const handleSceneProgression = () => {
    const scenes = ['hall', 'crossing', 'expansion', 'integration'] as const;
    const currentIndex = scenes.indexOf(currentScene);
    if (currentIndex < scenes.length - 1) {
      setCurrentScene(scenes[currentIndex + 1]);
      if (currentScene === 'crossing') {
        setCrossingComplete(true);
      }
    }
  };

  const handleBreathCycle = () => {
    setBreathCycles(prev => prev + 1);
    setFearLevel(prev => Math.max(prev - 1, 1));
  };

  const getSceneDescription = () => {
    switch (currentScene) {
      case 'hall':
        return 'Face your fears without fixing them. Breathe and witness.';
      case 'crossing':
        return 'Step through the threshold when ready. Trust the process.';
      case 'expansion':
        return 'Feel the space beyond fear. Breathe into the new freedom.';
      case 'integration':
        return 'Bring this fearlessness back to daily life.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              Gate of Liberation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Scene:</span>
                <Badge variant="outline">{currentScene}</Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Fear Level:</span>
                <Badge variant="outline">{fearLevel}/10</Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Breath Cycles:</span>
                <Badge variant="outline">{breathCycles}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleBreathCycle}
                className="w-full"
                variant="outline"
              >
                <Heart className="h-4 w-4 mr-2" />
                Breath Cycle
              </Button>
              
              <Button
                onClick={handleSceneProgression}
                className="w-full"
                disabled={currentScene === 'hall' && (fearLevel > 5 || breathCycles < 3)}
              >
                {currentScene === 'crossing' ? 'Step Through' : 'Next Scene'}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isComfortable}
                  onChange={(e) => setIsComfortable(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Comfort Mode</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions Panel */}
      <div className="absolute top-4 right-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Current Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-primary font-medium">{getSceneDescription()}</p>
            
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                <strong>Hall of Fear:</strong> Witness fear without fixing
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>The Crossing:</strong> Step through the threshold
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>Expansion:</strong> Breathe in new freedom
              </div>
              <div className="text-xs text-muted-foreground">
                <strong>Integration:</strong> Bring fearlessness to life
              </div>
            </div>

            {currentScene === 'hall' && (
              <div className="mt-4 p-3 bg-yellow-900/20 rounded-lg">
                <p className="text-xs text-yellow-200">
                  Reduce fear to 5 or below and complete 3 breath cycles to proceed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [8, 5, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
        
        <LiberationGate 
          scene={currentScene}
          fearLevel={fearLevel}
          isComfortable={isComfortable}
        />
        
        <OrbitControls enablePan={false} maxDistance={15} minDistance={5} />
      </Canvas>

      {/* Bottom Wisdom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/20 max-w-2xl"
        >
          <p className="text-center text-primary font-medium">
            Death is the ultimate doorway. Cross it in practice, and life becomes fearless.
          </p>
        </motion.div>
      </div>
    </div>
  );
}