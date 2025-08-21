import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface TorusFieldProps {
  radius: number;
  tubeRadius: number;
  color: string;
  position: [number, number, number];
  rotationSpeed: number;
  pulseIntensity: number;
}

function TorusField({ radius, tubeRadius, color, position, rotationSpeed, pulseIntensity }: TorusFieldProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.7;
    }
    
    if (materialRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * pulseIntensity;
      materialRef.current.emissiveIntensity = 0.3 + pulse;
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.TorusGeometry(radius, tubeRadius, 16, 100);
    geom.morphAttributes = geom.morphAttributes || {};
    return geom;
  }, [radius, tubeRadius]);

  return (
    <mesh ref={meshRef} geometry={geometry} position={position}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function EnergyFlowParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      
      positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.005;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const time = state.clock.elapsedTime;
        positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.002;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#00ffff" size={0.05} sizeAttenuation />
    </points>
  );
}

function HeartField() {
  const heartRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (heartRef.current) {
      heartRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      heartRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={heartRef} position={[0, 0, 0]}>
      <TorusField
        radius={1.5}
        tubeRadius={0.3}
        color="#ff69b4"
        position={[0, 0, 0]}
        rotationSpeed={0.01}
        pulseIntensity={0.2}
      />
      <TorusField
        radius={2.5}
        tubeRadius={0.2}
        color="#ff1493"
        position={[0, 0, 0]}
        rotationSpeed={-0.008}
        pulseIntensity={0.15}
      />
      <TorusField
        radius={3.5}
        tubeRadius={0.1}
        color="#ff69b4"
        position={[0, 0, 0]}
        rotationSpeed={0.006}
        pulseIntensity={0.1}
      />
    </group>
  );
}

export default function TorusFieldDynamics3D() {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [coherenceLevel, setCoherenceLevel] = useState(75);

  const fieldData = {
    heart: {
      name: "Heart Field",
      frequency: "0.1 Hz",
      range: "8-12 feet",
      description: "The heart's electromagnetic field is the strongest in the human body, extending several feet beyond the physical form.",
      benefits: ["Emotional regulation", "Intuitive guidance", "Interpersonal connection", "Stress reduction"]
    },
    brain: {
      name: "Brain Field", 
      frequency: "8-40 Hz",
      range: "3-4 feet",
      description: "The brain generates measurable electromagnetic fields through neural oscillations and brainwave patterns.",
      benefits: ["Mental clarity", "Focus enhancement", "Memory consolidation", "Creative insights"]
    },
    unified: {
      name: "Unified Field",
      frequency: "7.83 Hz",
      range: "Planetary",
      description: "When heart and brain coherence align, we tap into the unified field of consciousness.",
      benefits: ["Higher perception", "Synchronicity", "Collective awareness", "Quantum coherence"]
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff69b4" />
        
        <HeartField />
        <EnergyFlowParticles />
        
        <Text
          position={[0, 4, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Torus Field Dynamics
        </Text>
        
        <OrbitControls enablePan={false} maxDistance={12} minDistance={4} />
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute top-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Torus Field Explorer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Experience the electromagnetic fields generated by the heart and brain in coherent states.
            </p>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm">Coherence: {coherenceLevel}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Selection */}
      <div className="absolute top-6 right-6 z-10 space-y-3">
        {Object.entries(fieldData).map(([key, data]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={selectedField === key ? "default" : "outline"}
              onClick={() => setSelectedField(selectedField === key ? null : key)}
              className="bg-background/80 backdrop-blur-sm border-primary/20"
            >
              {data.name}
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Information Panel */}
      {selectedField && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute bottom-6 right-6 z-10 max-w-md"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                {fieldData[selectedField as keyof typeof fieldData].name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Frequency:</span>
                  <div className="font-mono">{fieldData[selectedField as keyof typeof fieldData].frequency}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Range:</span>
                  <div className="font-mono">{fieldData[selectedField as keyof typeof fieldData].range}</div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {fieldData[selectedField as keyof typeof fieldData].description}
              </p>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                <div className="flex flex-wrap gap-1">
                  {fieldData[selectedField as keyof typeof fieldData].benefits.map((benefit) => (
                    <Badge key={benefit} variant="secondary" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Click field buttons to learn more • Drag to rotate • Scroll to zoom
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}