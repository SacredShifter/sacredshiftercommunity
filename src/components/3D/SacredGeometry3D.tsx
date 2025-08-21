import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text, Dodecahedron, Icosahedron, Octahedron, Tetrahedron } from '@react-three/drei';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface GeometryData {
  id: string;
  name: string;
  description: string;
  symbolism: string;
  element?: string;
  platonicSolid?: boolean;
  faces: number;
  vertices: number;
  edges: number;
  color: string;
  position: [number, number, number];
  component: React.ComponentType<any>;
}

const geometryData: GeometryData[] = [
  {
    id: 'tetrahedron',
    name: 'Tetrahedron',
    description: 'The simplest Platonic solid representing the element of Fire and divine creativity.',
    symbolism: 'Fire, passion, transformation, divine spark',
    element: 'Fire',
    platonicSolid: true,
    faces: 4,
    vertices: 4,
    edges: 6,
    color: '#FF4500',
    position: [-3, 2, 0],
    component: React.forwardRef<THREE.Mesh, any>((props, ref) => 
      <Tetrahedron ref={ref} {...props}>
        <meshStandardMaterial
          color="#FF4500"
          emissive="#FF4500"
          emissiveIntensity={props.isSelected ? 0.2 : 0.05}
          transparent
          opacity={0.8}
          wireframe={props.isSelected}
        />
      </Tetrahedron>
    )
  },
  {
    id: 'cube',
    name: 'Hexahedron (Cube)',
    description: 'Represents the element of Earth, stability, and material manifestation.',
    symbolism: 'Earth, stability, foundation, material world',
    element: 'Earth',
    platonicSolid: true,
    faces: 6,
    vertices: 8,
    edges: 12,
    color: '#8B4513',
    position: [-1, 2, 0],
    component: React.forwardRef<THREE.Mesh, any>((props, ref) => 
      <mesh ref={ref} {...props}>
        <boxGeometry />
        <meshStandardMaterial
          color="#8B4513"
          emissive="#8B4513"
          emissiveIntensity={props.isSelected ? 0.2 : 0.05}
          transparent
          opacity={0.8}
          wireframe={props.isSelected}
        />
      </mesh>
    )
  },
  {
    id: 'octahedron',
    name: 'Octahedron',
    description: 'Sacred geometry of Air element, representing balance and harmony.',
    symbolism: 'Air, breath, balance, communication',
    element: 'Air',
    platonicSolid: true,
    faces: 8,
    vertices: 6,
    edges: 12,
    color: '#87CEEB',
    position: [1, 2, 0],
    component: React.forwardRef<THREE.Mesh, any>((props, ref) => 
      <Octahedron ref={ref} {...props}>
        <meshStandardMaterial
          color="#87CEEB"
          emissive="#87CEEB"
          emissiveIntensity={props.isSelected ? 0.2 : 0.05}
          transparent
          opacity={0.8}
          wireframe={props.isSelected}
        />
      </Octahedron>
    )
  },
  {
    id: 'icosahedron',
    name: 'Icosahedron',
    description: 'The Water element form, representing flow and emotional consciousness.',
    symbolism: 'Water, flow, emotion, intuition',
    element: 'Water',
    platonicSolid: true,
    faces: 20,
    vertices: 12,
    edges: 30,
    color: '#4169E1',
    position: [3, 2, 0],
    component: React.forwardRef<THREE.Mesh, any>((props, ref) => 
      <Icosahedron ref={ref} {...props}>
        <meshStandardMaterial
          color="#4169E1"
          emissive="#4169E1"
          emissiveIntensity={props.isSelected ? 0.2 : 0.05}
          transparent
          opacity={0.8}
          wireframe={props.isSelected}
        />
      </Icosahedron>
    )
  },
  {
    id: 'dodecahedron',
    name: 'Dodecahedron',
    description: 'The Ether/Spirit element, representing the cosmos and divine consciousness.',
    symbolism: 'Ether, cosmos, divine consciousness, wholeness',
    element: 'Ether/Spirit',
    platonicSolid: true,
    faces: 12,
    vertices: 20,
    edges: 30,
    color: '#9370DB',
    position: [0, 0, 0],
    component: React.forwardRef<THREE.Mesh, any>((props, ref) => 
      <Dodecahedron ref={ref} {...props}>
        <meshStandardMaterial
          color="#9370DB"
          emissive="#9370DB"
          emissiveIntensity={props.isSelected ? 0.2 : 0.05}
          transparent
          opacity={0.8}
          wireframe={props.isSelected}
        />
      </Dodecahedron>
    )
  }
];

interface GeometryShapeProps {
  geometry: GeometryData;
  isSelected: boolean;
  onClick: (geometry: GeometryData) => void;
}

function AnimatedGeometry({ geometry, isSelected, onClick }: GeometryShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      
      if (isSelected) {
        meshRef.current.rotation.z += 0.02;
      }
    }
  });

  const GeometryComponent = geometry.component;
  
  return (
    <group position={geometry.position}>
      <GeometryComponent
        ref={meshRef}
        args={[isSelected ? 1.2 : 1]}
        onClick={() => onClick(geometry)}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
        isSelected={isSelected}
      />

      {/* Element Label - Removed font reference */}
      {geometry.element && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.3}
          color={geometry.color}
          anchorX="center"
          anchorY="middle"
        >
          {geometry.element}
        </Text>
      )}

      {/* Sacred ratio indicators */}
      {isSelected && (
        <group>
          {/* Golden ratio ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2, 32]} />
            <meshStandardMaterial
              color="#FFD700"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

function FlowerOfLife() {
  const positions: [number, number, number][] = [
    [0, 0, -2], // Center
    [1.5, 0, -2], [-1.5, 0, -2], // Horizontal
    [0.75, 1.3, -2], [-0.75, 1.3, -2], // Top
    [0.75, -1.3, -2], [-0.75, -1.3, -2] // Bottom
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshStandardMaterial
            color="#FFD700"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SacredGeometry3D() {
  const [selectedGeometry, setSelectedGeometry] = useState<GeometryData | null>(null);
  const [showFlowerOfLife, setShowFlowerOfLife] = useState(true);

  const handleGeometryClick = (geometry: GeometryData) => {
    setSelectedGeometry(selectedGeometry?.id === geometry.id ? null : geometry);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-background to-card">
      {/* 3D Canvas - Reduced height for better scrolling */}
      <div className="h-[70vh] relative">
        <Canvas
          camera={{ position: [6, 4, 8], fov: 60 }}
          style={{ background: 'radial-gradient(circle, #0f0f23 0%, #1a1a2e 100%)' }}
        >
          <Suspense fallback={null}>
            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} color="#9370DB" />
            <spotLight position={[0, 5, 0]} intensity={0.5} color="#FFD700" />
            
            {/* Sacred Geometries */}
            {geometryData.map(geometry => (
              <AnimatedGeometry
                key={geometry.id}
                geometry={geometry}
                isSelected={selectedGeometry?.id === geometry.id}
                onClick={handleGeometryClick}
              />
            ))}
            
            {/* Flower of Life Background */}
            {showFlowerOfLife && <FlowerOfLife />}
            
            {/* Camera Controls */}
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={4}
              maxDistance={15}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      <div className="absolute top-16 left-4 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
            <CardContent className="p-4">
              <h3 className="font-sacred text-lg mb-2">Sacred Geometry Explorer</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Explore the five Platonic solids and their elemental correspondences in 3D space.
              </p>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFlowerOfLife(!showFlowerOfLife)}
                  className="w-full"
                >
                  {showFlowerOfLife ? 'Hide' : 'Show'} Flower of Life
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  • Click shapes to explore
                  • Drag to rotate view
                  • Scroll to zoom
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Geometry Information Panel */}
      {selectedGeometry && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-16 right-4 z-10 max-w-md"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-2 border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-sacred text-xl" style={{ color: selectedGeometry.color }}>
                    {selectedGeometry.name}
                  </h3>
                  {selectedGeometry.element && (
                    <p className="text-muted-foreground">Element: {selectedGeometry.element}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGeometry(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    {selectedGeometry.platonicSolid && (
                      <Badge variant="outline">Platonic Solid</Badge>
                    )}
                    <Badge variant="secondary">{selectedGeometry.element}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedGeometry.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Symbolism</h4>
                  <p className="text-sm" style={{ color: selectedGeometry.color }}>
                    {selectedGeometry.symbolism}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-muted">
                    <div className="font-semibold">{selectedGeometry.faces}</div>
                    <div className="text-muted-foreground">Faces</div>
                  </div>
                  <div className="p-2 rounded bg-muted">
                    <div className="font-semibold">{selectedGeometry.vertices}</div>
                    <div className="text-muted-foreground">Vertices</div>
                  </div>
                  <div className="p-2 rounded bg-muted">
                    <div className="font-semibold">{selectedGeometry.edges}</div>
                    <div className="text-muted-foreground">Edges</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Information Section - Now scrollable below 3D view */}
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl font-sacred bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Understanding Sacred Geometry
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Sacred geometry reveals the mathematical patterns underlying all of creation. 
            The five Platonic solids represent the classical elements and fundamental building blocks of reality.
          </p>
        </motion.div>

        {/* Platonic Solids Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {geometryData.map((geometry) => (
            <Card key={geometry.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 text-center">
                <div 
                  className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${geometry.color}20`, border: `2px solid ${geometry.color}` }}
                >
                  <div 
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: geometry.color }}
                  />
                </div>
                <h3 className="font-semibold text-sm mb-1">{geometry.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">{geometry.element}</p>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  <div>
                    <div className="font-medium">{geometry.faces}</div>
                    <div className="text-muted-foreground">Faces</div>
                  </div>
                  <div>
                    <div className="font-medium">{geometry.vertices}</div>
                    <div className="text-muted-foreground">Vertices</div>
                  </div>
                  <div>
                    <div className="font-medium">{geometry.edges}</div>
                    <div className="text-muted-foreground">Edges</div>
                  </div>
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
              <h3 className="text-xl font-sacred mb-4">The Five Elements</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FF4500' }}></div>
                  <span><strong>Fire (Tetrahedron):</strong> Transformation, passion, divine spark</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8B4513' }}></div>
                  <span><strong>Earth (Cube):</strong> Stability, foundation, material manifestation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#87CEEB' }}></div>
                  <span><strong>Air (Octahedron):</strong> Balance, communication, breath of life</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#4169E1' }}></div>
                  <span><strong>Water (Icosahedron):</strong> Flow, emotion, intuitive wisdom</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9370DB' }}></div>
                  <span><strong>Ether (Dodecahedron):</strong> Cosmos, divine consciousness, wholeness</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-sacred mb-4">Sacred Ratios</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  These geometric forms contain the golden ratio (φ ≈ 1.618) and other sacred proportions 
                  that appear throughout nature, from flower petals to galaxy spirals.
                </p>
                <p>
                  The Flower of Life pattern in the background connects all five solids, 
                  demonstrating the unity underlying apparent diversity in creation.
                </p>
                <p>
                  Each form represents both an element and a level of consciousness, 
                  offering a map for spiritual and energetic development.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation Bar - Now positioned relative to content */}
      <div className="pb-6">
        <div className="flex justify-center">
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20">
            <CardContent className="p-3">
              <div className="flex space-x-2">
                {geometryData.map(geometry => (
                  <Button
                    key={geometry.id}
                    variant={selectedGeometry?.id === geometry.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleGeometryClick(geometry)}
                    className="w-10 h-10 p-0 border-2"
                    style={{
                      borderColor: geometry.color,
                      backgroundColor: selectedGeometry?.id === geometry.id ? geometry.color : 'transparent'
                    }}
                    title={geometry.name}
                  >
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: geometry.color }}
                    />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}