import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Text, useTexture, Effects } from '@react-three/drei';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { safePosition, safeArgs } from './SafeGeometry';
import { chakraData, ChakraData } from '@/data/chakraData';

interface ChakraSphereProps {
  chakra: ChakraData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function ChakraSphere({ chakra, isSelected, onSelect }: ChakraSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={safePosition(chakra.position)}>
      {/* Main Chakra Sphere */}
      <mesh
        ref={meshRef}
        onClick={() => onSelect(chakra.id)}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <sphereGeometry args={[isSelected ? 0.25 : 0.2, 32, 32]} />
        <meshStandardMaterial
          color={chakra.color}
          emissive={chakra.color}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Outer Energy Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.4, 32]} />
        <meshStandardMaterial
          color={chakra.color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sanskrit Label */}
      <Html position={[0.6, 0, 0]} center>
        <div 
          className="font-semibold pointer-events-none text-left"
          style={{ 
            color: chakra.color,
            fontSize: '10px',
            textShadow: '0 0 4px rgba(0,0,0,0.8)'
          }}
        >
          {chakra.sanskrit}
        </div>
      </Html>

      {/* Frequency Label */}
      <Html position={[-0.6, 0, 0]} center>
        <div 
          className="font-semibold pointer-events-none text-right"
          style={{ 
            color: "#ffffff",
            fontSize: '8px',
            textShadow: '0 0 4px rgba(0,0,0,0.8)'
          }}
        >
          {chakra.frequency}
        </div>
      </Html>
    </group>
  );
}

function SpinalColumn() {
  return (
    <mesh position={[0, 1.5, -0.1]}>
      <cylinderGeometry args={[0.05, 0.05, 4.5]} />
      <meshStandardMaterial color="#E8E8E8" transparent opacity={0.6} />
    </mesh>
  );
}

function EnergyFlow() {
  // This could be enhanced with particle systems or animated shaders
  return (
    <group>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[0, i * 0.2 - 1, 0]}>
          <sphereGeometry args={[0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ChakraLearning3D() {
  const [selectedChakra, setSelectedChakra] = useState<ChakraData | null>(null);
  const [showInfo, setShowInfo] = useState(true);

  const handleChakraClick = (chakra: ChakraData) => {
    setSelectedChakra(selectedChakra?.id === chakra.id ? null : chakra);
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-background to-card relative">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [3, 2, 5], fov: 60 }}
        style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 100%)' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#6366f1" />
          
          {/* Scene Elements */}
          <SpinalColumn />
          <EnergyFlow />
          
          {/* Chakras */}
          {chakraData.map(chakra => (
            <ChakraSphere
              key={chakra.id}
              chakra={chakra}
              isSelected={selectedChakra?.id === chakra.id}
              onSelect={(id) => {
                const chakra = chakraData.find(c => c.id === id);
                if (chakra) handleChakraClick(chakra);
              }}
            />
          ))}
          
          {/* Camera Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={8}
            minPolarAngle={0}
            maxPolarAngle={Math.PI}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute top-4 left-4 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <Button
            variant="outline"
            onClick={() => setShowInfo(!showInfo)}
            className="bg-background/80 backdrop-blur-sm"
          >
            {showInfo ? 'Hide Info' : 'Show Info'}
          </Button>
          
          {showInfo && (
            <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
              <CardContent className="p-4">
                <h3 className="font-sacred text-lg mb-2">Chakra System Explorer</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Click on any chakra sphere to explore its properties and learn about its role in your energy system.
                </p>
                <div className="text-xs text-muted-foreground">
                  • Rotate: Click and drag
                  • Zoom: Scroll wheel
                  • Select: Click chakra
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Chakra Information Panel */}
      {selectedChakra && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-4 right-4 z-10 max-w-md"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-2 border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-sacred text-xl" style={{ color: selectedChakra.color }}>
                    {selectedChakra.name}
                  </h3>
                  <p className="text-muted-foreground">{selectedChakra.sanskrit}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedChakra(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {selectedChakra.frequency} • {selectedChakra.element}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {selectedChakra.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Core Qualities</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedChakra.qualities.map(quality => (
                      <Badge key={quality} variant="secondary" className="text-xs">
                        {quality}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Affirmation</h4>
                  <p className="text-sm italic" style={{ color: selectedChakra.color }}>
                    "{selectedChakra.affirmation}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h5 className="font-medium mb-1">Crystals</h5>
                    <ul className="text-muted-foreground">
                      {selectedChakra.crystals.map(crystal => (
                        <li key={crystal}>• {crystal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-1">Essential Oils</h5>
                    <ul className="text-muted-foreground">
                      {selectedChakra.oils.map(oil => (
                        <li key={oil}>• {oil}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Chakra Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
          <CardContent className="p-3">
            <div className="flex space-x-2">
              {chakraData.map(chakra => (
                <Button
                  key={chakra.id}
                  variant={selectedChakra?.id === chakra.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChakraClick(chakra)}
                  className="w-8 h-8 p-0 border-2"
                  style={{
                    borderColor: chakra.color,
                    backgroundColor: selectedChakra?.id === chakra.id ? chakra.color : 'transparent'
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: chakra.color }}
                  />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}