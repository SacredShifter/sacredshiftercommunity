import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Wind, Leaf, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

interface BreathingEarth {
  isBreathing: boolean;
  breathRate: number;
}

function Earth({ isBreathing, breathRate }: BreathingEarth) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isBreathing) {
      const time = state.clock.elapsedTime;
      const breathCycle = Math.sin(time * breathRate) * 0.05;
      const scale = 1 + breathCycle;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
      if (isBreathing) {
        const atmosphereScale = 1 + Math.sin(state.clock.elapsedTime * breathRate * 0.8) * 0.03;
        atmosphereRef.current.scale.setScalar(atmosphereScale);
      }
    }
  });

  return (
    <group>
      {/* Earth Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#4a90e2"
          map={null} // Would use Earth texture here
        />
      </mesh>
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial
          color="#87ceeb"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function ForestLayer({ isBreathing }: { isBreathing: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const treeCount = 50;

  const trees = React.useMemo(() => {
    const trees = [];
    for (let i = 0; i < treeCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const radius = 1.6;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      trees.push({ position: [x, y, z], scale: 0.8 + Math.random() * 0.4 });
    }
    return trees;
  }, []);

  useFrame((state) => {
    if (groupRef.current && isBreathing) {
      const breathEffect = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      groupRef.current.scale.setScalar(1 + breathEffect);
    }
  });

  return (
    <group ref={groupRef}>
      {trees.map((tree, index) => (
        <mesh key={index} position={tree.position as [number, number, number]} scale={tree.scale}>
          <cylinderGeometry args={[0.01, 0.01, 0.1]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
      ))}
    </group>
  );
}

function OxygenParticles({ isActive }: { isActive: boolean }) {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2 + Math.random() * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current && isActive) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        // Simulate oxygen rising from forests
        positions[index + 1] += Math.sin(time + i) * 0.002;
        
        // Reset particles that go too high
        if (positions[index + 1] > 6) {
          positions[index + 1] = -4;
        }
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
      <pointsMaterial 
        color="#00ff00" 
        size={0.03} 
        sizeAttenuation 
        transparent 
        opacity={0.8}
      />
    </points>
  );
}

export default function GaiaBreathing3D() {
  const [isBreathing, setIsBreathing] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [breathRate, setBreathRate] = useState(0.3);

  const earthSystems = {
    forests: {
      name: "Forest Breathing",
      description: "Forests are Earth's lungs, producing oxygen and absorbing carbon dioxide through photosynthesis.",
      facts: ["Produce 20% of Earth's oxygen", "Amazon produces 6% alone", "Trees communicate via root networks", "Store massive amounts of carbon"],
      process: "Trees absorb CO2 during the day, release O2, and reverse at night"
    },
    oceans: {
      name: "Ocean Breathing", 
      description: "Oceans produce 70% of Earth's oxygen through phytoplankton and absorb CO2.",
      facts: ["Phytoplankton produce most oxygen", "Regulate global temperature", "Massive carbon sink", "Support all life"],
      process: "Marine plants photosynthesize, currents distribute nutrients and gases"
    },
    atmosphere: {
      name: "Atmospheric Circulation",
      description: "Global air circulation patterns distribute heat, moisture, and gases around the planet.",
      facts: ["Creates weather patterns", "Distributes heat from equator", "Jet streams guide weather", "Protects from radiation"],
      process: "Convection currents move warm air up, cold air down, creating circulation"
    },
    magnetosphere: {
      name: "Magnetic Breathing",
      description: "Earth's magnetic field breathes with solar wind, protecting life from cosmic radiation.",
      facts: ["Protects atmosphere", "Creates aurora", "Deflects solar particles", "Generated by core movement"],
      process: "Magnetic field lines compress and expand with solar wind pressure"
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-green-950/20 to-blue-950/20 relative overflow-hidden">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
        
        <Earth isBreathing={isBreathing} breathRate={breathRate} />
        <ForestLayer isBreathing={isBreathing} />
        <OxygenParticles isActive={isBreathing} />
        
        <Text
          position={[0, 4, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Gaia's Living Breath
        </Text>
        
        <OrbitControls enablePan={false} maxDistance={10} minDistance={3} />
      </Canvas>

      {/* Controls Panel */}
      <div className="absolute top-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Gaia Breathing System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsBreathing(!isBreathing)}
                variant={isBreathing ? "default" : "outline"}
              >
                {isBreathing ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Breathing
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Breathing
                  </>
                )}
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium">Breath Rate:</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={breathRate}
                onChange={(e) => setBreathRate(parseFloat(e.target.value))}
                className="w-full mt-1"
              />
              <span className="text-xs text-muted-foreground">{breathRate.toFixed(1)}x</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Earth Systems:</h4>
              {Object.entries(earthSystems).map(([key, system]) => (
                <Button
                  key={key}
                  variant={selectedSystem === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSystem(selectedSystem === key ? null : key)}
                  className="w-full text-xs"
                >
                  {system.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      {selectedSystem && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-6 right-6 z-10 max-w-md"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-500" />
                {earthSystems[selectedSystem as keyof typeof earthSystems].name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {earthSystems[selectedSystem as keyof typeof earthSystems].description}
              </p>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Process:</h4>
                <p className="text-xs text-muted-foreground">
                  {earthSystems[selectedSystem as keyof typeof earthSystems].process}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Key Facts:</h4>
                <div className="space-y-1">
                  {earthSystems[selectedSystem as keyof typeof earthSystems].facts.map((fact, index) => (
                    <div key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="text-green-500">•</span>
                      {fact}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Gaia Hypothesis */}
      <div className="absolute bottom-6 right-6 z-10 max-w-md">
        <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-cyan-500" />
              The Living Earth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The Gaia Hypothesis proposes that Earth functions as a self-regulating living system, 
              where biological and physical components interact to maintain conditions suitable for life.
            </p>
            
            <div className="text-xs space-y-1">
              <div><strong>Self-Regulation:</strong> Earth maintains stable temperature and chemistry</div>
              <div><strong>Feedback Loops:</strong> Systems respond to changes to restore balance</div>
              <div><strong>Homeostasis:</strong> Dynamic equilibrium despite external changes</div>
              <div><strong>Interconnection:</strong> All systems are intimately connected</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Watch Earth breathe • Select systems to learn • Adjust breath rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}