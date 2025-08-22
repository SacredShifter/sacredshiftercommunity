import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
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
        <Sphere args={[1, 32, 32]}>
          <meshStandardMaterial
            color="#10b981"
            transparent
            opacity={0.7}
            emissive="#059669"
            emissiveIntensity={0.2}
          />
        </Sphere>
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
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <mesh
          key={index}
          position={[
            Math.cos(index * Math.PI / 3) * 5,
            Math.sin(index * Math.PI / 4) * 2,
            Math.sin(index * Math.PI / 3) * 5
          ]}
        >
          <Sphere args={[0.2, 16, 16]}>
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={0.1}
            />
          </Sphere>
        </mesh>
      ))}

      {/* Sovereignty Text */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        SOVEREIGNTY FIELD ACTIVE
      </Text>
    </group>
  );
}

export default function SovereigntyField3D() {
  const [fieldStrength, setFieldStrength] = useState([0.7]);
  const [fieldFrequency, setFieldFrequency] = useState([0.5]);
  const [fieldCoherence, setFieldCoherence] = useState([0.6]);
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" />
              Sovereignty Field Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                onClick={() => setIsActive(!isActive)}
                variant={isActive ? "default" : "outline"}
                className="w-full"
              >
                {isActive ? "Field Active" : "Activate Field"}
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Field Strength
                  </span>
                  <Badge variant="outline">{(fieldStrength[0] * 100).toFixed(0)}%</Badge>
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    Frequency
                  </span>
                  <Badge variant="outline">{(fieldFrequency[0] * 10).toFixed(1)} Hz</Badge>
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Brain className="h-4 w-4" />
                    Coherence
                  </span>
                  <Badge variant="outline">{(fieldCoherence[0] * 100).toFixed(0)}%</Badge>
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

            <div className="text-xs text-muted-foreground space-y-2">
              <p>• <strong>Field Strength:</strong> Your boundary definition clarity</p>
              <p>• <strong>Frequency:</strong> Choice-making speed and precision</p>
              <p>• <strong>Coherence:</strong> Alignment between values and actions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm">Practice Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">1. Activate Your Field</p>
              <p className="text-muted-foreground">Click to establish your sovereignty boundaries</p>
            </div>
            <div>
              <p className="font-medium mb-1">2. Adjust Parameters</p>
              <p className="text-muted-foreground">Find your natural frequency and strength</p>
            </div>
            <div>
              <p className="font-medium mb-1">3. Observe Choice Points</p>
              <p className="text-muted-foreground">Golden spheres show decision opportunities</p>
            </div>
            <div>
              <p className="font-medium mb-1">4. Maintain Coherence</p>
              <p className="text-muted-foreground">Keep rings stable through aligned choices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [8, 5, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
        
        {isActive && (
          <SovereigntyField
            strength={fieldStrength[0]}
            frequency={fieldFrequency[0]}
            coherence={fieldCoherence[0]}
          />
        )}
        
        <OrbitControls enablePan={false} maxDistance={15} minDistance={5} />
      </Canvas>

      {/* Bottom Panel */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/20"
        >
          <p className="text-center text-primary font-medium">
            Your sovereignty begins with choice. Every moment, you decide what energy to allow in.
          </p>
        </motion.div>
      </div>
    </div>
  );
}