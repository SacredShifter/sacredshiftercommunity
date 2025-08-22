import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Pause, Star, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFrequencyTool } from '@/hooks/useFrequencyTool';

interface TetrahedronProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  isSpinning: boolean;
  spinDirection: number;
}

function Tetrahedron({ position, rotation, color, isSpinning, spinDirection }: TetrahedronProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isSpinning) {
      meshRef.current.rotation.y += 0.02 * spinDirection;
      meshRef.current.rotation.x += 0.01 * spinDirection;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <tetrahedronGeometry args={[1.5]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.7}
        wireframe={false}
      />
      <mesh>
        <tetrahedronGeometry args={[1.5]} />
        <meshBasicMaterial
          color={color}
          wireframe
          opacity={0.8}
          transparent
        />
      </mesh>
    </mesh>
  );
}

function MerkabaField() {
  const fieldRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (fieldRef.current) {
      const time = state.clock.elapsedTime;
      fieldRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={fieldRef}>
      {/* Energy field rings */}
      {[1, 2, 3].map((ring) => (
        <mesh key={ring} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2 + ring * 0.5, 0.02, 8, 32]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function EnergyParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const index = i * 3;
        positions[index] += Math.sin(time + i) * 0.001;
        positions[index + 1] += Math.cos(time + i) * 0.001;
        positions[index + 2] += Math.sin(time * 0.5 + i) * 0.001;
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
        color="#ffffff" 
        size={0.02} 
        sizeAttenuation 
        transparent 
        opacity={0.6}
      />
    </points>
  );
}

export default function MerkabaLightBody3D() {
  const [isActivated, setIsActivated] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  
  // Sacred frequency integration for Merkaba resonance
  const { 
    isPlaying, 
    selectedFrequency, 
    frequencies, 
    toggleSacredSound, 
    selectFrequency 
  } = useFrequencyTool();

  // Auto-select appropriate frequencies for Merkaba activation
  useEffect(() => {
    if (isActivated && !isPlaying) {
      // Use Love frequency (528 Hz) for Merkaba activation
      const loveFreq = frequencies.find(f => f.hz === 528);
      if (loveFreq) {
        selectFrequency(loveFreq);
        toggleSacredSound();
      }
    }
  }, [isActivated]);

  const activationPhases = {
    preparation: {
      name: "Preparation Phase",
      description: "Grounding and centering your energy field before activation",
      steps: ["Ground to Earth", "Center in heart", "Clear intentions", "Breathe deeply"],
      duration: "5-10 minutes"
    },
    activation: {
      name: "Merkaba Activation", 
      description: "Spinning the tetrahedrons and activating the light body",
      steps: ["Visualize tetrahedrons", "Begin counter-rotation", "Increase spin speed", "Feel energy field"],
      duration: "10-15 minutes"
    },
    integration: {
      name: "Integration Phase",
      description: "Stabilizing and anchoring the merkaba energy",
      steps: ["Maintain steady spin", "Expand awareness", "Integrate experience", "Gratitude practice"],
      duration: "5-10 minutes"
    }
  };

  const merkabaInfo = {
    meaning: "Mer-Ka-Ba means 'Light-Spirit-Body' in ancient Egyptian. It's your divine light vehicle for interdimensional travel and consciousness expansion.",
    benefits: ["Expanded awareness", "Psychic protection", "Dimensional travel", "DNA activation", "Spiritual evolution"],
    geometry: "Two interlocking tetrahedrons create a star tetrahedron, representing the union of opposing forces and dimensions."
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-blue-950/20 to-purple-950/30 relative overflow-hidden">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />
        
        {/* Upper tetrahedron (masculine/electric) */}
        <Tetrahedron
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          color="#00ffff"
          isSpinning={isActivated}
          spinDirection={1}
        />
        
        {/* Lower tetrahedron (feminine/magnetic) */}
        <Tetrahedron
          position={[0, 0, 0]}
          rotation={[Math.PI, 0, 0]}
          color="#ff00ff"
          isSpinning={isActivated}
          spinDirection={-1}
        />
        
        <MerkabaField />
        <EnergyParticles />
        
        <Html position={[0, 4.5, 0]} center>
          <div 
            className="font-bold pointer-events-none text-center"
            style={{ 
              color: "#ffffff",
              fontSize: '20px',
              textShadow: '0 0 8px rgba(0,0,0,0.8)'
            }}
          >
            Merkaba Light Body
          </div>
        </Html>
        
        <OrbitControls enablePan={false} maxDistance={12} minDistance={4} />
      </Canvas>

      {/* Activation Controls */}
      <div className="absolute top-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-cyan-500" />
              Merkaba Activation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => setIsActivated(!isActivated)}
              className={`w-full ${isActivated ? 'bg-cyan-500 hover:bg-cyan-600' : ''}`}
            >
              {isActivated ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Deactivate Merkaba
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Activate Merkaba
                </>
              )}
            </Button>

            {/* Sacred Frequency Control */}
            <div className="p-3 bg-muted rounded space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <span className="text-sm font-medium">Sacred Resonance</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={toggleSacredSound}
                  variant={isPlaying ? "default" : "outline"}
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <div className="text-xs">
                  <div className="font-medium">{selectedFrequency.name}</div>
                  <div className="text-muted-foreground">{selectedFrequency.hz} Hz</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {frequencies.filter(f => [528, 741, 852].includes(f.hz)).map((freq) => (
                  <Button
                    key={freq.hz}
                    size="sm"
                    variant={selectedFrequency.hz === freq.hz ? "default" : "outline"}
                    onClick={() => selectFrequency(freq)}
                    className="text-xs"
                  >
                    {freq.hz}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Activation Phases:</h4>
              {Object.entries(activationPhases).map(([key, phase]) => (
                <Button
                  key={key}
                  variant={selectedPhase === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPhase(selectedPhase === key ? null : key)}
                  className="w-full text-xs"
                >
                  {phase.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Information */}
      {selectedPhase && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-6 right-6 z-10 max-w-md"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                {activationPhases[selectedPhase as keyof typeof activationPhases].name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {activationPhases[selectedPhase as keyof typeof activationPhases].description}
              </p>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium">Steps:</h4>
                  <Badge variant="outline" className="text-xs">
                    {activationPhases[selectedPhase as keyof typeof activationPhases].duration}
                  </Badge>
                </div>
                <ul className="space-y-1">
                  {activationPhases[selectedPhase as keyof typeof activationPhases].steps.map((step, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="text-primary">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Merkaba Information */}
      <div className="absolute bottom-6 right-6 z-10 max-w-md">
        <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Sacred Geometry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {merkabaInfo.meaning}
            </p>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Geometry:</h4>
              <p className="text-xs text-muted-foreground">
                {merkabaInfo.geometry}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Benefits:</h4>
              <div className="flex flex-wrap gap-1">
                {merkabaInfo.benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary" className="text-xs">
                    {benefit}
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
              Activate to see counter-rotating tetrahedrons • Drag to rotate • Scroll to zoom
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}