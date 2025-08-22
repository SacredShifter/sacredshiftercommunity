import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Shield, Zap, Heart, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface SovereigntyFieldProps {
  strength: number;
  frequency: number;
  coherence: number;
}

function SovereigntyField({ strength, frequency, coherence }: SovereigntyFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005 * frequency;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * frequency) * 0.1 * strength);
    }
    
    if (ringsRef.current) {
      ringsRef.current.rotation.x += 0.003 * coherence;
      ringsRef.current.rotation.z += 0.002 * coherence;
    }
  });

  return (
    <group>
      {/* Core Sovereignty Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.7}
          emissive="#059669"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Boundary Rings */}
      <group ref={ringsRef}>
        {[2, 3, 4].map((radius, index) => (
          <mesh
            key={index}
            rotation={[Math.PI / 2, 0, index * Math.PI / 3]}
          >
            <ringGeometry args={[radius - 0.1, radius + 0.1, 32]} />
            <meshStandardMaterial
              color="#34d399"
              transparent
              opacity={0.3 + coherence * 0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Choice Points */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
        <mesh
          key={index}
          position={[
            Math.cos(index * Math.PI / 4) * 6,
            Math.sin(index * Math.PI / 6) * 3,
            Math.sin(index * Math.PI / 4) * 6
          ]}
        >
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Energy Connections */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
        <mesh
          key={`connection-${index}`}
          position={[
            Math.cos(index * Math.PI / 4) * 3,
            0,
            Math.sin(index * Math.PI / 4) * 3
          ]}
          rotation={[0, index * Math.PI / 4, 0]}
        >
          <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
          <meshStandardMaterial
            color="#34d399"
            emissive="#10b981"
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Sovereignty Text */}
      <Text
        position={[0, 7, 0]}
        fontSize={0.8}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        SOVEREIGNTY FIELD
      </Text>
      
      <Text
        position={[0, -7, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Strength: {(strength * 100).toFixed(0)}% | Frequency: {frequency.toFixed(1)} Hz | Coherence: {(coherence * 100).toFixed(0)}%
      </Text>
    </group>
  );
}

export default function SovereigntyField3D() {
  const [fieldStrength, setFieldStrength] = useState([0.7]);
  const [fieldFrequency, setFieldFrequency] = useState([0.5]);
  const [fieldCoherence, setFieldCoherence] = useState([0.6]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'learning' | 'practice' | 'integration'>('learning');
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [practiceTimer, setPracticeTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setPracticeTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const sovereigntyLessons = [
    {
      id: 'boundaries',
      title: 'Understanding Boundaries',
      content: 'Sovereignty begins with knowing where you end and others begin. Boundaries are not walls - they are conscious choices about what energy you allow in your field.',
      practice: 'Feel your personal space extending 3 feet around you. Notice what feels comfortable vs. intrusive.'
    },
    {
      id: 'choice',
      title: 'The Power of Choice', 
      content: 'Every moment offers choice points. Sovereignty is the conscious participation in your own becoming through aware decision-making.',
      practice: 'Before each decision today, pause and ask: "What choice honors my authentic self?"'
    },
    {
      id: 'embodiment',
      title: 'Embodied Sovereignty',
      content: 'True power lives in the body, not in concepts. Stand with spine aligned, breathe fully, and speak your truth with warmth and clarity.',
      practice: 'Stand. Feel your spine. Inhale life. On exhale, practice saying "no" with love and "yes" with full commitment.'
    }
  ];

  const getCurrentLesson = () => {
    return sovereigntyLessons.find(lesson => !completedLessons.includes(lesson.id)) || sovereigntyLessons[0];
  };

  const completeLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons(prev => [...prev, lessonId]);
    }
  };

  const startPractice = () => {
    setCurrentPhase('practice');
    setIsActive(true);
    setIsTimerRunning(true);
    setPracticeTimer(0);
  };

  const stopPractice = () => {
    setIsTimerRunning(false);
    setCurrentPhase('integration');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      {/* 3D Canvas - Full Screen */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} className="h-full w-full">
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={1.0} color="#6366f1" />
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#10b981" />
        
        {isActive && (
          <SovereigntyField
            strength={fieldStrength[0]}
            frequency={fieldFrequency[0]}
            coherence={fieldCoherence[0]}
          />
        )}
        
        <OrbitControls 
          enablePan={false} 
          maxDistance={15} 
          minDistance={5}
          target={[0, 0, 0]}
          autoRotate={isActive}
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Learning Panel - Small Overlay */}
      {currentPhase === 'learning' && (
        <div className="absolute top-4 left-4 z-20 w-72">
          <Card className="bg-black/60 backdrop-blur-md border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary text-sm">
                <Shield className="h-4 w-4" />
                Learning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(() => {
                const currentLesson = getCurrentLesson();
                return (
                  <>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">{currentLesson.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-3">{currentLesson.content}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => completeLesson(currentLesson.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                      >
                        Complete
                      </Button>
                      <Button
                        onClick={startPractice}
                        variant="default"
                        size="sm" 
                        className="flex-1 text-xs"
                      >
                        Practice
                      </Button>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls Panel - Practice Mode */}
      {currentPhase === 'practice' && (
        <div className="absolute top-4 left-4 z-20 w-64">
          <Card className="bg-black/60 backdrop-blur-md border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary text-sm">
                <Shield className="h-4 w-4" />
                Field Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-lg font-mono">{formatTime(practiceTimer)}</div>
                <Button
                  onClick={stopPractice}
                  variant="outline"
                  size="sm"
                  className="mt-1 text-xs"
                >
                  Complete Practice
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      Strength
                    </span>
                    <Badge variant="outline" className="text-xs">{(fieldStrength[0] * 100).toFixed(0)}%</Badge>
                  </div>
                  <Slider
                    value={fieldStrength}
                    onValueChange={setFieldStrength}
                    max={1}
                    min={0.1}
                    step={0.1}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      Frequency
                    </span>
                    <Badge variant="outline" className="text-xs">{(fieldFrequency[0] * 10).toFixed(1)} Hz</Badge>
                  </div>
                  <Slider
                    value={fieldFrequency}
                    onValueChange={setFieldFrequency}
                    max={2}
                    min={0.1}
                    step={0.1}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      Coherence
                    </span>
                    <Badge variant="outline" className="text-xs">{(fieldCoherence[0] * 100).toFixed(0)}%</Badge>
                  </div>
                  <Slider
                    value={fieldCoherence}
                    onValueChange={setFieldCoherence}
                    max={1}
                    min={0.1}
                    step={0.1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integration Panel */}
      {currentPhase === 'integration' && (
        <div className="absolute top-4 left-4 z-20 w-72">
          <Card className="bg-black/60 backdrop-blur-md border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary text-sm">
                <Heart className="h-4 w-4" />
                Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs mb-2">Practice completed! Reflect on your experience.</p>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentPhase('learning')}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  Continue Learning
                </Button>
                <Button
                  onClick={startPractice}
                  variant="default"
                  size="sm"
                  className="flex-1 text-xs"
                >
                  Practice Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Insight Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/50 backdrop-blur-md rounded-lg px-4 py-2 border border-primary/20"
        >
          {currentPhase === 'learning' && (
            <div className="text-center">
              <p className="text-primary font-medium text-sm mb-1">
                "Sovereignty is not about control - it's about conscious choice."
              </p>
              <p className="text-xs text-muted-foreground">
                Learn the principles, then practice with the 3D field generator
              </p>
            </div>
          )}
          
          {currentPhase === 'practice' && (
            <div className="text-center">
              <p className="text-primary font-medium text-sm mb-1">
                "Feel your boundaries. Choose consciously."
              </p>
              <p className="text-xs text-muted-foreground">
                Golden spheres are choice points. Adjust sliders to strengthen your field.
              </p>
            </div>
          )}
          
          {currentPhase === 'integration' && (
            <div className="text-center">
              <p className="text-primary font-medium text-sm mb-1">
                "Integration means taking sovereignty into daily life."
              </p>
              <p className="text-xs text-muted-foreground">
                What boundary will you practice today?
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}