import React, { Suspense, useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text, Ring, Circle } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { Volume2, Eye, Shield, Star, Book } from 'lucide-react';
import * as THREE from 'three';

interface AngelicName {
  id: string;
  name: string;
  meaning: string;
  ring: number;
  position: number;
  hierarchy: string;
  frequency: number;
}

interface SacredRing {
  id: string;
  radius: number;
  segments: number;
  color: string;
  frequency: number;
  names: AngelicName[];
}

// Sample angelic names for the Sigillum Dei Aemeth
const angelicNames: AngelicName[] = [
  { id: 'michael', name: 'MICHAEL', meaning: 'Who is like God', ring: 1, position: 0, hierarchy: 'Archangel', frequency: 396 },
  { id: 'gabriel', name: 'GABRIEL', meaning: 'God is my strength', ring: 1, position: 90, hierarchy: 'Archangel', frequency: 417 },
  { id: 'raphael', name: 'RAPHAEL', meaning: 'God heals', ring: 1, position: 180, hierarchy: 'Archangel', frequency: 528 },
  { id: 'uriel', name: 'URIEL', meaning: 'Fire of God', ring: 1, position: 270, hierarchy: 'Archangel', frequency: 639 },
  { id: 'metatron', name: 'METATRON', meaning: 'Angel of the Presence', ring: 2, position: 0, hierarchy: 'Seraph', frequency: 741 },
  { id: 'sandalphon', name: 'SANDALPHON', meaning: 'Brother', ring: 2, position: 72, hierarchy: 'Seraph', frequency: 852 },
  { id: 'raziel', name: 'RAZIEL', meaning: 'Secret of God', ring: 2, position: 144, hierarchy: 'Cherub', frequency: 963 },
  { id: 'raguel', name: 'RAGUEL', meaning: 'Friend of God', ring: 2, position: 216, hierarchy: 'Cherub', frequency: 174 },
  { id: 'sariel', name: 'SARIEL', meaning: 'Command of God', ring: 2, position: 288, hierarchy: 'Throne', frequency: 285 },
  { id: 'jeremiel', name: 'JEREMIEL', meaning: 'Mercy of God', ring: 3, position: 0, hierarchy: 'Throne', frequency: 396 },
  { id: 'chamuel', name: 'CHAMUEL', meaning: 'He who sees God', ring: 3, position: 51.4, hierarchy: 'Dominion', frequency: 417 },
  { id: 'jophiel', name: 'JOPHIEL', meaning: 'Beauty of God', ring: 3, position: 102.8, hierarchy: 'Dominion', frequency: 528 },
  { id: 'zadkiel', name: 'ZADKIEL', meaning: 'Righteousness of God', ring: 3, position: 154.2, hierarchy: 'Virtue', frequency: 639 },
  { id: 'haniel', name: 'HANIEL', meaning: 'Grace of God', ring: 3, position: 205.6, hierarchy: 'Virtue', frequency: 741 },
  { id: 'azrael', name: 'AZRAEL', meaning: 'Helped by God', ring: 3, position: 257, hierarchy: 'Power', frequency: 852 },
  { id: 'barachiel', name: 'BARACHIEL', meaning: 'Blessing of God', ring: 3, position: 308.4, hierarchy: 'Power', frequency: 963 }
];

const sacredRings: SacredRing[] = [
  { id: 'outer', radius: 4, segments: 7, color: '#FFD700', frequency: 396, names: angelicNames.filter(n => n.ring === 1) },
  { id: 'middle', radius: 2.8, segments: 5, color: '#FF6B6B', frequency: 528, names: angelicNames.filter(n => n.ring === 2) },
  { id: 'inner', radius: 1.6, segments: 7, color: '#4ECDC4', frequency: 741, names: angelicNames.filter(n => n.ring === 3) }
];

// Sacred Ring Component
const SacredRingComponent = ({ ring, isActive, selectedName, onNameSelect, breathSync }: {
  ring: SacredRing;
  isActive: boolean;
  selectedName: string | null;
  onNameSelect: (name: AngelicName) => void;
  breathSync: boolean;
}) => {
  const ringRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    if (ringRef.current) {
      if (isActive) {
        ringRef.current.rotation.z += 0.001 * (ring.radius / 4); // Different speeds for each ring
      }
      if (breathSync) {
        const breath = Math.sin(state.clock.elapsedTime * 0.5) * 0.1 + 1;
        ringRef.current.scale.setScalar(breath);
      }
    }
  });

  const ringGeometry = useMemo(() => {
    const geometry = new THREE.RingGeometry(ring.radius - 0.05, ring.radius + 0.05, 64);
    geometry.morphAttributes = geometry.morphAttributes || {};
    return geometry;
  }, [ring.radius]);

  return (
    <group ref={ringRef}>
      {/* Ring Circle */}
      <mesh geometry={ringGeometry}>
        <meshBasicMaterial 
          color={ring.color} 
          transparent 
          opacity={isActive ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sacred Geometry Lines */}
      {Array.from({ length: ring.segments }).map((_, i) => {
        const angle = (i / ring.segments) * Math.PI * 2;
        const x1 = Math.cos(angle) * (ring.radius - 0.2);
        const y1 = Math.sin(angle) * (ring.radius - 0.2);
        const x2 = Math.cos(angle) * (ring.radius + 0.2);
        const y2 = Math.sin(angle) * (ring.radius + 0.2);

        return (
          <group key={i}>
            <mesh position={[x1, y1, 0.01]}>
              <cylinderGeometry args={[0.01, 0.01, 0.4]} />
              <meshBasicMaterial color={ring.color} />
            </mesh>
            
            {/* Pentagram/Heptagram connections */}
            {ring.segments === 5 && (
              <mesh 
                position={[
                  Math.cos(angle + (Math.PI * 4 / 5)) * ring.radius,
                  Math.sin(angle + (Math.PI * 4 / 5)) * ring.radius,
                  0.005
                ]}
              >
                <cylinderGeometry args={[0.005, 0.005, ring.radius * 1.2]} />
                <meshBasicMaterial color={ring.color} transparent opacity={0.3} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Angelic Names */}
      {ring.names.map((angelName, i) => {
        const angle = (angelName.position / 360) * Math.PI * 2;
        const x = Math.cos(angle) * (ring.radius + 0.5);
        const y = Math.sin(angle) * (ring.radius + 0.5);
        const isSelected = selectedName === angelName.id;
        const isHovered = hovered === angelName.id;

        return (
          <group key={angelName.id}>
            {/* Name Background */}
            <mesh 
              position={[x, y, 0.02]}
              onPointerEnter={() => setHovered(angelName.id)}
              onPointerLeave={() => setHovered(null)}
              onClick={() => onNameSelect(angelName)}
            >
              <planeGeometry args={[0.8, 0.2]} />
              <meshBasicMaterial 
                color={isSelected || isHovered ? '#FFFFFF' : ring.color}
                transparent 
                opacity={isSelected ? 0.9 : (isHovered ? 0.7 : 0.5)}
              />
            </mesh>

            {/* Name Text */}
            <Text
              position={[x, y, 0.03]}
              fontSize={0.08}
              color={isSelected || isHovered ? '#000000' : '#FFFFFF'}
              anchorX="center"
              anchorY="middle"
            >
              {angelName.name}
            </Text>

            {/* Frequency Indicator */}
            {(isSelected || isHovered) && (
              <Text
                position={[x, y - 0.15, 0.03]}
                fontSize={0.04}
                color="#FFFF00"
                anchorX="center"
                anchorY="middle"
              >
                {angelName.frequency}Hz
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
};

// Central Sacred Symbol
const CentralSymbol = ({ isActive, selectedFrequency }: { 
  isActive: boolean; 
  selectedFrequency: number | null; 
}) => {
  const symbolRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (symbolRef.current && isActive) {
      symbolRef.current.rotation.z += 0.005;
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 1;
      symbolRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={symbolRef}>
      {/* Central Circle */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial 
          color={selectedFrequency ? '#FFFF00' : '#FFFFFF'} 
          transparent 
          opacity={0.8}
        />
      </mesh>

      {/* Sacred Tetragrammaton */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.15}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        YHWH
      </Text>

      {/* Four Divine Names around center */}
      {['EL', 'ELOHIM', 'ADONAI', 'EHYEH'].map((name, i) => {
        const angle = (i / 4) * Math.PI * 2;
        const x = Math.cos(angle) * 0.6;
        const y = Math.sin(angle) * 0.6;

        return (
          <Text
            key={name}
            position={[x, y, 0.02]}
            fontSize={0.06}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            {name}
          </Text>
        );
      })}
    </group>
  );
};

// Main Component
export default function SigillumDeiAemeth3D({ className }: { className?: string }) {
  const [selectedName, setSelectedName] = useState<AngelicName | null>(null);
  const [activeRing, setActiveRing] = useState<string>('all');
  const [isRotating, setIsRotating] = useState(true);
  const [breathSync, setBreathSync] = useState(false);
  const [showNames, setShowNames] = useState(true);
  const [volume, setVolume] = useState([0.5]);
  const [mode, setMode] = useState<'explore' | 'meditate' | 'activate'>('explore');

  const handleNameSelect = (angelName: AngelicName) => {
    setSelectedName(angelName);
    
    // Play frequency using Web Audio API
    if (volume[0] > 0) {
      playFrequency(angelName.frequency, volume[0] * 0.3); // Reduced volume for safety
      console.log(`Playing ${angelName.name} at ${angelName.frequency}Hz`);
    }
  };

  const playFrequency = (frequency: number, volume: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine'; // Pure tone for sacred frequencies
      
      // Set volume with fade in and out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 2); // Play for 2 seconds
    } catch (error) {
      console.error('Error playing frequency:', error);
    }
  };

  return (
    <div className={`w-full min-h-screen bg-background ${className}`}>
      {/* Title Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-16 left-6 z-10"
      >
        <Card className="bg-card/90 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Shield className="h-5 w-5" />
              Sigillum Dei Aemeth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              John Dee's Sacred Seal of Divine Truth
            </p>
            <div className="flex gap-1">
              <Badge variant="secondary">Enochian</Badge>
              <Badge variant="secondary">Advanced</Badge>
              <Badge variant="secondary">Protection</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-16 right-6 z-10 w-72"
      >
        <Card className="bg-card/90 backdrop-blur-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">Sacred Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Activation Mode</label>
              <div className="flex gap-1">
                {(['explore', 'meditate', 'activate'] as const).map((m) => (
                  <Button
                    key={m}
                    variant={mode === m ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMode(m)}
                    className="capitalize text-xs"
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ring Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Active Ring</label>
              <div className="flex gap-1">
                <Button
                  variant={activeRing === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveRing('all')}
                  className="text-xs"
                >
                  All
                </Button>
                {sacredRings.map((ring) => (
                  <Button
                    key={ring.id}
                    variant={activeRing === ring.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveRing(ring.id)}
                    className="text-xs capitalize"
                  >
                    {ring.id}
                  </Button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Rotation</label>
                <Switch checked={isRotating} onCheckedChange={setIsRotating} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Breath Sync</label>
                <Switch checked={breathSync} onCheckedChange={setBreathSync} />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Show Names</label>
                <Switch checked={showNames} onCheckedChange={setShowNames} />
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-foreground" />
                <label className="text-xs font-medium text-foreground">Frequency Volume</label>
              </div>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Angel Information */}
      {selectedName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-6 z-10"
        >
          <Card className="bg-card/90 backdrop-blur-sm border-border w-80">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Star className="h-4 w-4" />
                {selectedName.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-foreground">Meaning:</span>
                  <p className="text-muted-foreground">{selectedName.meaning}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Hierarchy:</span>
                  <p className="text-muted-foreground">{selectedName.hierarchy}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Frequency:</span>
                  <p className="text-muted-foreground">{selectedName.frequency}Hz</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Ring:</span>
                  <p className="text-muted-foreground">{sacredRings.find(r => r.id === ['outer', 'middle', 'inner'][selectedName.ring - 1])?.id}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={() => handleNameSelect(selectedName)}
              >
                <Volume2 className="h-3 w-3 mr-1" />
                Invoke Frequency
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 right-6 z-10"
      >
        <Card className="bg-card/90 backdrop-blur-sm border-border w-64">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <Book className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">
                <p className="mb-2">Click angelic names to hear their frequencies.</p>
                <p className="mb-2">Use breath sync for meditation.</p>
                <p>Activate protection mode for sacred work.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3D Canvas - Reduced height for better scrolling */}
      <div className="h-[70vh] relative">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.4} />

            {/* Sacred Rings */}
            {sacredRings.map((ring) => (
              <SacredRingComponent
                key={ring.id}
                ring={ring}
                isActive={isRotating && (activeRing === 'all' || activeRing === ring.id)}
                selectedName={selectedName?.id || null}
                onNameSelect={handleNameSelect}
                breathSync={breathSync}
              />
            ))}

            {/* Central Symbol */}
            <CentralSymbol 
              isActive={mode === 'activate' && isRotating}
              selectedFrequency={selectedName?.frequency || null}
            />

            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={15}
              minDistance={3}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Information Section - Now scrollable below 3D view */}
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl font-sacred bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            The Sigillum Dei Æmeth
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            John Dee's Sacred Seal of Divine Truth, revealed through angelic communication with Edward Kelley. 
            This powerful protective seal contains the names of God and angels arranged in sacred geometric patterns.
          </p>
        </motion.div>

        {/* Angelic Hierarchies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sacredRings.map((ring) => (
            <Card key={ring.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: ring.color }}
                  />
                  <h3 className="font-sacred text-lg capitalize">{ring.id} Ring</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Contains {ring.names.length} angelic names, each resonating at unique frequencies.
                </p>
                <div className="space-y-2">
                  {ring.names.slice(0, 3).map((angel) => (
                    <div key={angel.id} className="flex justify-between text-xs">
                      <span className="font-medium">{angel.name}</span>
                      <span className="text-muted-foreground">{angel.frequency}Hz</span>
                    </div>
                  ))}
                  {ring.names.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{ring.names.length - 3} more names
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-sacred mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Protection & Purpose
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  The Sigillum Dei Æmeth serves as a powerful protective seal, creating a sacred space 
                  for divine communication and spiritual work.
                </p>
                <p>
                  Each angelic name carries specific vibrational frequencies that can be used for 
                  healing, protection, and consciousness expansion.
                </p>
                <p>
                  The geometric arrangement follows precise proportions that mirror cosmic harmonies 
                  and create resonance with divine consciousness.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-sacred mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                Usage Instructions
              </h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p><strong>Exploration Mode:</strong> Click on angelic names to learn their meanings and frequencies.</p>
                <p><strong>Meditation Mode:</strong> Use breath sync to align with the seal's natural rhythms.</p>
                <p><strong>Activation Mode:</strong> Enable protection mode when performing sacred work or ritual.</p>
                <p><strong>Sound Healing:</strong> Listen to the angelic frequencies for vibrational healing.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}