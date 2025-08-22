import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Play, Pause, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface MandalaPetalProps {
  radius: number;
  angle: number;
  color: string;
  animated: boolean;
}

function MandalaPetal({ radius, angle, color, animated }: MandalaPetalProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && animated) {
      const time = state.clock.elapsedTime;
      const wave = Math.sin(time * 2 + angle) * 0.1;
      meshRef.current.scale.setScalar(1 + wave);
      meshRef.current.rotation.z = angle + (animated ? time * 0.5 : 0);
    }
  });

  const position = useMemo(() => {
    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ] as [number, number, number];
  }, [angle, radius]);

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 8, 6]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function MandalaLayer({ layer, animated, colorScheme }: { layer: number; animated: boolean; colorScheme: string[] }) {
  const petalCount = 6 + layer * 6;
  const radius = 1 + layer * 0.8;
  
  const petals = useMemo(() => {
    const result = [];
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      const colorIndex = i % colorScheme.length;
      result.push({
        angle,
        color: colorScheme[colorIndex]
      });
    }
    return result;
  }, [petalCount, colorScheme]);

  return (
    <>
      {petals.map((petal, index) => (
        <MandalaPetal
          key={`${layer}-${index}`}
          radius={radius}
          angle={petal.angle}
          color={petal.color}
          animated={animated}
        />
      ))}
    </>
  );
}

function GeometricMandala({ animated, colorScheme, pattern }: { animated: boolean; colorScheme: string[]; pattern: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && animated) {
      groupRef.current.rotation.z += 0.01;
    }
  });

  const layers = pattern === 'lotus' ? 4 : pattern === 'flower' ? 3 : 5;

  return (
    <group ref={groupRef}>
      {/* Center sphere */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial 
          color={colorScheme[0]} 
          emissive={colorScheme[0]}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Mandala layers */}
      {Array.from({ length: layers }, (_, i) => (
        <MandalaLayer
          key={i}
          layer={i}
          animated={animated}
          colorScheme={colorScheme}
        />
      ))}
    </group>
  );
}

export default function LivingMandala3D() {
  const [isAnimated, setIsAnimated] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState('lotus');
  const [selectedColorScheme, setSelectedColorScheme] = useState('chakra');

  const patterns = {
    lotus: { name: "Lotus Mandala", description: "Sacred lotus pattern representing enlightenment and purity" },
    flower: { name: "Flower of Life", description: "Ancient symbol of creation and the fundamental forms of time and space" },
    sri: { name: "Sri Yantra", description: "Geometric representation of the cosmos and divine consciousness" }
  };

  const colorSchemes = {
    chakra: ["#ff0000", "#ff7f00", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "#9400d3"],
    sunset: ["#ff6b6b", "#feca57", "#ff9ff3", "#48cae4", "#023047"],
    nature: ["#2d5016", "#61892f", "#86c232", "#6b6e70", "#474b4f"],
    cosmic: ["#000080", "#4b0082", "#800080", "#ff1493", "#00ffff"]
  };

  const mandalaInfo = {
    meaning: "Mandalas represent wholeness, the cosmos, and the journey toward enlightenment. They serve as tools for meditation and spiritual growth.",
    benefits: ["Focus enhancement", "Stress reduction", "Creative inspiration", "Spiritual connection", "Mental clarity"],
    traditions: ["Tibetan Buddhism", "Hindu Tantra", "Native American", "Celtic Spirituality", "Sacred Geometry"]
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-background via-purple-950/20 to-blue-950/20 relative overflow-hidden">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#purple" />
        
        <GeometricMandala
          animated={isAnimated}
          colorScheme={colorSchemes[selectedColorScheme as keyof typeof colorSchemes]}
          pattern={selectedPattern}
        />
        
        <Html position={[0, 4, 0]} center>
          <div 
            className="font-bold pointer-events-none text-center"
            style={{ 
              color: "#ffffff",
              fontSize: '20px',
              textShadow: '0 0 8px rgba(0,0,0,0.8)'
            }}
          >
            Living Mandala Generator
          </div>
        </Html>
        
        <OrbitControls enablePan={false} maxDistance={10} minDistance={3} />
      </Canvas>

      {/* Controls Panel */}
      <div className="absolute top-6 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-500" />
              Mandala Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAnimated(!isAnimated)}
                className="flex items-center gap-2"
              >
                {isAnimated ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isAnimated ? 'Pause' : 'Animate'}
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium">Pattern:</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(patterns).map(([key, pattern]) => (
                  <Button
                    key={key}
                    variant={selectedPattern === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPattern(key)}
                  >
                    {pattern.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Color Scheme:</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.keys(colorSchemes).map((scheme) => (
                  <Button
                    key={scheme}
                    variant={selectedColorScheme === scheme ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColorScheme(scheme)}
                    className="capitalize"
                  >
                    {scheme}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Panel */}
      <div className="absolute bottom-6 right-6 z-10 max-w-md">
        <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCw className="h-5 w-5 text-blue-500" />
              {patterns[selectedPattern as keyof typeof patterns].name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {patterns[selectedPattern as keyof typeof patterns].description}
            </p>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Sacred Meaning:</h4>
              <p className="text-xs text-muted-foreground">
                {mandalaInfo.meaning}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Benefits:</h4>
              <div className="flex flex-wrap gap-1">
                {mandalaInfo.benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Traditions:</h4>
              <div className="flex flex-wrap gap-1">
                {mandalaInfo.traditions.map((tradition) => (
                  <Badge key={tradition} variant="outline" className="text-xs">
                    {tradition}
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
              Meditate on the patterns • Drag to rotate • Scroll to zoom • Customize above
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}