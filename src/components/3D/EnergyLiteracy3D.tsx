import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Battery, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface EnergyFieldProps {
  energyLevel: number;
  drainSources: string[];
  restorationActive: boolean;
  phase: 'scan' | 'identify' | 'correct' | 'recheck';
}

function EnergyField({ energyLevel, drainSources, restorationActive, phase }: EnergyFieldProps) {
  const fieldRef = useRef<THREE.Group>(null);
  const drainRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (fieldRef.current) {
      const intensity = energyLevel / 10;
      fieldRef.current.rotation.y += 0.005 * intensity;
      fieldRef.current.scale.setScalar(0.5 + intensity * 0.8);
    }
    
    if (drainRef.current && drainSources.length > 0) {
      drainRef.current.rotation.x += 0.02;
      drainRef.current.rotation.z -= 0.01;
    }
  });

  const fieldColor = energyLevel > 7 ? '#10b981' : energyLevel > 4 ? '#fbbf24' : '#ef4444';
  const fieldOpacity = Math.max(energyLevel / 10 * 0.6, 0.2);

  return (
    <group>
      {/* Core Energy Field */}
      <group ref={fieldRef}>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color={fieldColor}
            transparent
            opacity={fieldOpacity}
            emissive={fieldColor}
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Energy Layers */}
        {[3, 4, 5].map((radius, index) => (
          <mesh key={index}>
            <sphereGeometry args={[radius, 16, 16]} />
            <meshStandardMaterial
              color={fieldColor}
              transparent
              opacity={0.1 * (energyLevel / 10)}
              wireframe
            />
          </mesh>
        ))}
      </group>

      {/* Drain Indicators */}
      <group ref={drainRef}>
        {drainSources.map((_, index) => (
          <mesh
            key={index}
            position={[
              Math.cos(index * Math.PI * 0.4) * 6,
              Math.sin(index * Math.PI * 0.3) * 3,
              Math.sin(index * Math.PI * 0.4) * 6
            ]}
          >
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Restoration Flow */}
      {restorationActive && (
        <group>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <mesh
              key={index}
              position={[
                Math.cos(index * Math.PI / 3) * 7,
                Math.sin(index * Math.PI / 6) * 2,
                Math.sin(index * Math.PI / 3) * 7
              ]}
            >
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Phase Indicator */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.8}
        color={fieldColor}
        anchorX="center"
        anchorY="middle"
      >
        {phase.toUpperCase()}
      </Text>
    </group>
  );
}

export default function EnergyLiteracy3D() {
  const [currentPhase, setCurrentPhase] = useState<'scan' | 'identify' | 'correct' | 'recheck'>('scan');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [drainSources, setDrainSources] = useState<string[]>([]);
  const [restorationMethods, setRestorationMethods] = useState<string[]>([]);
  const [bodyAwareness, setBodyAwareness] = useState(3);

  const commonDrains = [
    'Social Media Scrolling',
    'Overthinking',
    'Poor Boundaries',
    'Shallow Breathing',
    'Negative Self-Talk',
    'Perfectionism'
  ];

  const commonRestorations = [
    'Deep Breathing',
    'Nature Connection',
    'Gentle Movement',
    'Boundary Setting',
    'Rest',
    'Nourishing Food'
  ];

  const handlePhaseProgression = () => {
    const phases = ['scan', 'identify', 'correct', 'recheck'] as const;
    const currentIndex = phases.indexOf(currentPhase);
    
    if (currentIndex < phases.length - 1) {
      setCurrentPhase(phases[currentIndex + 1]);
    } else {
      // Complete cycle, reset to scan
      setCurrentPhase('scan');
    }
  };

  const handleScanBody = () => {
    setBodyAwareness(prev => Math.min(prev + 1, 10));
    if (currentPhase === 'scan') {
      handlePhaseProgression();
    }
  };

  const handleIdentifyDrain = (drain: string) => {
    if (!drainSources.includes(drain)) {
      setDrainSources(prev => [...prev, drain]);
      setEnergyLevel(prev => Math.max(prev - 1, 1));
    }
  };

  const handleApplyCorrection = (method: string) => {
    if (!restorationMethods.includes(method)) {
      setRestorationMethods(prev => [...prev, method]);
      setEnergyLevel(prev => Math.min(prev + 2, 10));
    }
  };

  const getPhaseInstructions = () => {
    switch (currentPhase) {
      case 'scan':
        return 'Scan your body. Notice where energy feels depleted or heavy.';
      case 'identify':
        return 'Name the drain. What is taking your energy right now?';
      case 'correct':
        return 'Apply one correction. Choose a restoration method.';
      case 'recheck':
        return 'Check again. Has your energy improved? Repeat if needed.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Battery className="h-5 w-5" />
              Energy Literacy Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Energy Level</span>
                <Badge variant="outline">{energyLevel}/10</Badge>
              </div>
              <Progress value={energyLevel * 10} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Phase:</span>
                <Badge variant="outline">{currentPhase}</Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Body Awareness:</span>
                <Badge variant="outline">{bodyAwareness}/10</Badge>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Drains Identified:</span>
                <Badge variant="outline">{drainSources.length}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleScanBody}
                className="w-full"
                variant="outline"
              >
                <Zap className="h-4 w-4 mr-2" />
                Scan Body
              </Button>
              
              <Button
                onClick={handlePhaseProgression}
                className="w-full"
              >
                {currentPhase === 'recheck' ? 'Complete Cycle' : 'Next Phase'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Panel */}
      <div className="absolute top-4 right-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm">{getPhaseInstructions()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentPhase === 'identify' && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Common Energy Drains:</p>
                <div className="grid grid-cols-1 gap-1">
                  {commonDrains.map((drain) => (
                    <Button
                      key={drain}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleIdentifyDrain(drain)}
                      className="justify-start text-xs h-8"
                      disabled={drainSources.includes(drain)}
                    >
                      {drainSources.includes(drain) ? (
                        <CheckCircle className="h-3 w-3 mr-2" />
                      ) : (
                        <AlertTriangle className="h-3 w-3 mr-2" />
                      )}
                      {drain}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {currentPhase === 'correct' && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Restoration Methods:</p>
                <div className="grid grid-cols-1 gap-1">
                  {commonRestorations.map((method) => (
                    <Button
                      key={method}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleApplyCorrection(method)}
                      className="justify-start text-xs h-8"
                      disabled={restorationMethods.includes(method)}
                    >
                      {restorationMethods.includes(method) ? (
                        <CheckCircle className="h-3 w-3 mr-2" />
                      ) : (
                        <Zap className="h-3 w-3 mr-2" />
                      )}
                      {method}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-muted-foreground">
              <p><strong>Remember:</strong> Small changes compound. One correction at a time.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [10, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        
        <EnergyField
          energyLevel={energyLevel}
          drainSources={drainSources}
          restorationActive={restorationMethods.length > 0}
          phase={currentPhase}
        />
        
        <OrbitControls enablePan={false} maxDistance={15} minDistance={5} />
      </Canvas>

      {/* Bottom Insight */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/20 max-w-2xl"
        >
          <p className="text-center text-primary font-medium">
            Energy literacy is sovereignty in action. Know where you leak, seal what you can control.
          </p>
        </motion.div>
      </div>
    </div>
  );
}