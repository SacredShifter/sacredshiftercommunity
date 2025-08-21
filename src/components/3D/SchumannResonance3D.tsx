import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, Globe, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResonanceWave {
  frequency: number;
  amplitude: number;
  color: string;
  active: boolean;
}

const schumannFrequencies: ResonanceWave[] = [
  { frequency: 7.83, amplitude: 1.0, color: "#ff0000", active: true },   // Fundamental
  { frequency: 14.3, amplitude: 0.6, color: "#ff7f00", active: false },  // 2nd harmonic
  { frequency: 20.8, amplitude: 0.4, color: "#ffff00", active: false },  // 3rd harmonic
  { frequency: 27.3, amplitude: 0.3, color: "#00ff00", active: false },  // 4th harmonic
  { frequency: 33.8, amplitude: 0.2, color: "#0000ff", active: false },  // 5th harmonic
];

function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#4a90e2"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function IonosphereLayers() {
  const layersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (layersRef.current) {
      layersRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={layersRef}>
      {[1.5, 2.0, 2.5].map((radius, index) => (
        <mesh key={index}>
          <sphereGeometry args={[radius, 32, 16]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

function ResonanceField({ waves }: { waves: ResonanceWave[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const waveRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    waves.forEach((wave, index) => {
      if (waveRefs.current[index] && wave.active) {
        const time = state.clock.elapsedTime;
        const scale = 1 + Math.sin(time * wave.frequency * 0.1) * wave.amplitude * 0.2;
        waveRefs.current[index].scale.setScalar(scale);
        
        // Rotate at frequency-based speed
        waveRefs.current[index].rotation.y = time * wave.frequency * 0.01;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {waves.map((wave, index) => (
        <mesh
          key={index}
          ref={(el) => { if (el) waveRefs.current[index] = el; }}
          visible={wave.active}
        >
          <torusGeometry args={[3 + index * 0.5, 0.02, 8, 32]} />
          <meshBasicMaterial
            color={wave.color}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function LightningFlash() {
  const flashRef = useRef<THREE.PointLight>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useFrame((state) => {
    if (flashRef.current) {
      const time = state.clock.elapsedTime;
      
      // Random lightning flashes
      if (Math.sin(time * 10) > 0.98 && !isFlashing) {
        setIsFlashing(true);
        flashRef.current.intensity = 5;
        setTimeout(() => {
          setIsFlashing(false);
          if (flashRef.current) flashRef.current.intensity = 0;
        }, 100);
      }
    }
  });

  return (
    <pointLight
      ref={flashRef}
      position={[2, 1, 1]}
      color="#ffffff"
      intensity={0}
    />
  );
}

function BrainwaveParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.05;
      
      // Pulse effect at 7.83 Hz (scaled for visibility)
      const pulse = Math.sin(time * 7.83 * 0.1) * 0.5 + 0.5;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.3 + pulse * 0.4;
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
        color="#ff69b4" 
        size={0.05} 
        sizeAttenuation 
        transparent 
        opacity={0.5}
      />
    </points>
  );
}

export default function SchumannResonance3D() {
  const [activeWaves, setActiveWaves] = useState<ResonanceWave[]>(schumannFrequencies);
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(7.83);

  const toggleWave = (frequency: number) => {
    setActiveWaves(prev => 
      prev.map(wave => 
        wave.frequency === frequency 
          ? { ...wave, active: !wave.active }
          : wave
      )
    );
  };

  const brainwaveCorrelations = {
    7.83: {
      name: "Alpha-Theta Bridge",
      state: "Meditation, Creativity",
      description: "The fundamental Schumann resonance aligns with the transition between alpha and theta brainwaves, promoting deep meditation and creative states."
    },
    14.3: {
      name: "Beta Resonance", 
      state: "Alert Awareness",
      description: "The second harmonic correlates with beta brainwaves, supporting focused attention and cognitive processing."
    },
    20.8: {
      name: "High Beta",
      state: "Analytical Thinking",
      description: "Higher harmonics correspond to enhanced analytical thinking and problem-solving capabilities."
    }
  };

  const resonanceInfo = {
    discovery: "Discovered by physicist Winfried Otto Schumann in 1952, these are electromagnetic resonances in the Earth-ionosphere cavity.",
    mechanism: "Global lightning activity (about 50 flashes per second) creates electromagnetic waves that resonate in the cavity between Earth's surface and the ionosphere.",
    biological: "These frequencies closely match human brainwave patterns, suggesting a deep evolutionary connection between human consciousness and Earth's electromagnetic field.",
    effects: ["Circadian rhythm regulation", "Stress reduction", "Enhanced meditation", "Improved sleep quality", "Emotional balance"]
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-blue-950/20 to-purple-950/20 relative overflow-hidden">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <EarthSphere />
        <IonosphereLayers />
        <ResonanceField waves={activeWaves} />
        <LightningFlash />
        <BrainwaveParticles />
        
        <Text
          position={[0, 5, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          Schumann Resonance Chamber
        </Text>
        
        <OrbitControls enablePan={false} maxDistance={12} minDistance={4} />
      </Canvas>

      {/* Frequency Controls */}
      <div className="absolute top-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Resonance Frequencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Earth's heartbeat: electromagnetic frequencies that pulse around our planet
            </p>
            
            <div className="space-y-2">
              {schumannFrequencies.map((wave) => (
                <div key={wave.frequency} className="flex items-center justify-between">
                  <Button
                    variant={wave.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleWave(wave.frequency)}
                    className="flex-1 mr-2"
                    style={{ 
                      backgroundColor: wave.active ? wave.color : undefined,
                      borderColor: wave.color
                    }}
                  >
                    {wave.frequency} Hz
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFrequency(
                      selectedFrequency === wave.frequency ? null : wave.frequency
                    )}
                  >
                    <Brain className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Frequency Information */}
      {selectedFrequency && brainwaveCorrelations[selectedFrequency as keyof typeof brainwaveCorrelations] && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-6 right-6 z-10 max-w-md"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-500" />
                {selectedFrequency} Hz - {brainwaveCorrelations[selectedFrequency as keyof typeof brainwaveCorrelations].name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <Badge variant="outline" className="text-sm">
                  {brainwaveCorrelations[selectedFrequency as keyof typeof brainwaveCorrelations].state}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {brainwaveCorrelations[selectedFrequency as keyof typeof brainwaveCorrelations].description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Schumann Information */}
      <div className="absolute bottom-6 right-6 z-10 max-w-md">
        <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Earth's Electromagnetic Heartbeat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs space-y-2">
              <div>
                <strong>Discovery:</strong> {resonanceInfo.discovery}
              </div>
              <div>
                <strong>Mechanism:</strong> {resonanceInfo.mechanism}
              </div>
              <div>
                <strong>Biological Connection:</strong> {resonanceInfo.biological}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Potential Benefits:</h4>
              <div className="flex flex-wrap gap-1">
                {resonanceInfo.effects.map((effect) => (
                  <Badge key={effect} variant="secondary" className="text-xs">
                    {effect}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Toggle frequencies • Click brain icon for correlations • Watch lightning create resonances
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}