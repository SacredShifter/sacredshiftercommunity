import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Sun, Moon, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface LoveFieldProps {
  heartOpenness: number;
  spineClarity: number;
  currentPractice: 'morning' | 'midday' | 'evening';
  boundariesSet: number;
}

function SovereignLoveField({ heartOpenness, spineClarity, currentPractice, boundariesSet }: LoveFieldProps) {
  const heartRef = useRef<THREE.Mesh>(null);
  const spineRef = useRef<THREE.Group>(null);
  const boundaryRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (heartRef.current) {
      const heartIntensity = heartOpenness / 10;
      heartRef.current.scale.setScalar(0.8 + heartIntensity * 0.4);
      heartRef.current.rotation.y += 0.003;
    }
    
    if (spineRef.current) {
      const spineStrength = spineClarity / 10;
      spineRef.current.scale.y = 0.5 + spineStrength * 0.8;
    }
    
    if (boundaryRef.current) {
      boundaryRef.current.rotation.y += 0.005;
    }
  });

  const heartColor = heartOpenness > 7 ? '#ec4899' : '#f97316';
  const spineColor = spineClarity > 7 ? '#10b981' : '#3b82f6';
  const practiceColor = {
    morning: '#fbbf24',
    midday: '#ef4444', 
    evening: '#8b5cf6'
  };

  return (
    <group>
      {/* Heart Center */}
      <mesh ref={heartRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color={heartColor}
          transparent
          opacity={0.7}
          emissive={heartColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Spine Column */}
      <group ref={spineRef}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 6, 8]} />
          <meshStandardMaterial
            color={spineColor}
            emissive={spineColor}
            emissiveIntensity={0.4}
          />
        </mesh>
        
        {/* Spine segments */}
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <mesh key={index} position={[0, -2.5 + index, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial
              color={spineColor}
              emissive={spineColor}
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Boundary Shields */}
      <group ref={boundaryRef}>
        {Array.from({ length: boundariesSet }, (_, index) => (
          <mesh
            key={index}
            position={[
              Math.cos(index * Math.PI * 0.4) * 4,
              Math.sin(index * Math.PI * 0.2) * 2,
              Math.sin(index * Math.PI * 0.4) * 4
            ]}
            rotation={[0, index * Math.PI * 0.4, 0]}
          >
            <planeGeometry args={[1, 1.5]} />
            <meshStandardMaterial
              color="#10b981"
              transparent
              opacity={0.6}
              emissive="#10b981"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}
      </group>

      {/* Practice Time Indicator */}
      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={practiceColor[currentPractice]}
          emissive={practiceColor[currentPractice]}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Love Flow */}
      {heartOpenness > 5 && spineClarity > 5 && (
        <group>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
            <mesh
              key={index}
              position={[
                Math.cos(index * Math.PI * 0.25) * 6,
                Math.sin(index * Math.PI * 0.15) * 3,
                Math.sin(index * Math.PI * 0.25) * 6
              ]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial
                color="#ec4899"
                emissive="#ec4899"
                emissiveIntensity={0.8}
                transparent
                opacity={0.8}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* Practice Label */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.6}
        color={practiceColor[currentPractice]}
        anchorX="center"
        anchorY="middle"
      >
        {currentPractice.toUpperCase()} PRACTICE
      </Text>
    </group>
  );
}

export default function SovereignLove3D() {
  const [currentPractice, setCurrentPractice] = useState<'morning' | 'midday' | 'evening'>('morning');
  const [heartOpenness, setHeartOpenness] = useState(5);
  const [spineClarity, setSpineClarity] = useState(5);
  const [boundariesSet, setBoundariesSet] = useState(0);
  const [dailyBoundary, setDailyBoundary] = useState('');

  const mantras = [
    'I love you and I will not leave myself',
    'My no protects my yes',
    'Care never requires self harm',
    'Compassion with a spine',
    'Clarity is kindness'
  ];

  const handleMorningRitual = () => {
    setCurrentPractice('morning');
    setHeartOpenness(prev => Math.min(prev + 1, 10));
  };

  const handleMiddayCheck = () => {
    setCurrentPractice('midday');
    setSpineClarity(prev => Math.min(prev + 1, 10));
  };

  const handleEveningRelease = () => {
    setCurrentPractice('evening');
    setHeartOpenness(prev => Math.min(prev + 1, 10));
    setSpineClarity(prev => Math.min(prev + 1, 10));
  };

  const handleSetBoundary = () => {
    if (dailyBoundary.trim()) {
      setBoundariesSet(prev => prev + 1);
      setDailyBoundary('');
    }
  };

  const getPracticeInstruction = () => {
    switch (currentPractice) {
      case 'morning':
        return 'Hand on heart. Set one boundary for today.';
      case 'midday':
        return 'One breath before any hard yes.';
      case 'evening':
        return 'Release places you overgave. Return energy to your body.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-black relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Heart className="h-5 w-5" />
              Sovereign Love Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Heart:</span>
                <Badge variant="outline">{heartOpenness}/10</Badge>
              </div>
              <div className="flex justify-between">
                <span>Spine:</span>
                <Badge variant="outline">{spineClarity}/10</Badge>
              </div>
              <div className="flex justify-between">
                <span>Boundaries:</span>
                <Badge variant="outline">{boundariesSet}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Practice:</span>
                <Badge variant="outline">{currentPractice}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleMorningRitual}
                size="sm"
                className="w-full flex items-center gap-2"
                variant={currentPractice === 'morning' ? 'default' : 'outline'}
              >
                <Sun className="h-4 w-4" />
                Morning Ritual
              </Button>
              
              <Button
                onClick={handleMiddayCheck}
                size="sm"
                className="w-full flex items-center gap-2"
                variant={currentPractice === 'midday' ? 'default' : 'outline'}
              >
                <Clock className="h-4 w-4" />
                Midday Check
              </Button>
              
              <Button
                onClick={handleEveningRelease}
                size="sm"
                className="w-full flex items-center gap-2"
                variant={currentPractice === 'evening' ? 'default' : 'outline'}
              >
                <Moon className="h-4 w-4" />
                Evening Release
              </Button>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={dailyBoundary}
                onChange={(e) => setDailyBoundary(e.target.value)}
                placeholder="Set a boundary for today..."
                className="w-full px-3 py-2 text-sm bg-black/20 border border-white/20 rounded-md text-white placeholder-white/50"
              />
              <Button
                onClick={handleSetBoundary}
                size="sm"
                className="w-full"
                disabled={!dailyBoundary.trim()}
              >
                <Shield className="h-4 w-4 mr-2" />
                Set Boundary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Instructions */}
      <div className="absolute top-4 right-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm">Current Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-primary font-medium text-sm">{getPracticeInstruction()}</p>
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Boundary Mantras:</p>
              {mantras.map((mantra, index) => (
                <div key={index} className="text-xs text-muted-foreground p-2 bg-black/20 rounded">
                  {mantra}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-rose-900/20 rounded-lg">
              <p className="text-xs text-rose-200">
                <strong>Remember:</strong> Do not shrink to be loved. Do not harden to be safe. Love as yourself. Stay whole.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [8, 5, 8], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />
        
        <SovereignLoveField
          heartOpenness={heartOpenness}
          spineClarity={spineClarity}
          currentPractice={currentPractice}
          boundariesSet={boundariesSet}
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
            Sovereign love: an open heart with a clear spine. Tenderness without self-destruction.
          </p>
        </motion.div>
      </div>
    </div>
  );
}