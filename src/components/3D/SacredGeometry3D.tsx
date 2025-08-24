import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text, Dodecahedron, Icosahedron, Octahedron, Tetrahedron } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Volume2, Play, Pause, Shapes, MessageSquare } from 'lucide-react';
import { useFrequencyTool } from '@/hooks/useFrequencyTool';
import * as THREE from 'three';

interface SacredGeometry3DProps {
  hideInCeremonies?: boolean;
}

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
  mantra?: string;
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
    color: '#FF6B35',
    position: [-3, 1, 0],
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
    position: [-1, 1, 0],
    mantra: 'Fortress of Truth.',
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
    color: '#00CED1',
    position: [1, 1, 0],
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
    position: [3, 1, 0],
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
    position: [5, 1, 0],
  },
  {
    id: 'circle',
    name: 'Circle',
    description: 'Represents unity, wholeness, and the infinite. The most sacred of all forms.',
    symbolism: 'Unity, source, wholeness, infinite',
    element: 'Source',
    platonicSolid: false,
    faces: 1,
    vertices: 32,
    edges: 32,
    color: '#FFD700',
    position: [0, -1, 0],
    mantra: 'Circle of Source.',
  }
];

interface GeometryShapeProps {
  geometry: GeometryData;
  isSelected: boolean;
  onClick: (geometry: GeometryData) => void;
}

function AnimatedGeometry({ geometry, isSelected, onClick }: GeometryShapeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Smooth, sacred rotation
      meshRef.current.rotation.x += 0.003;
      meshRef.current.rotation.y += 0.005;
      
      if (isSelected) {
        // Golden ratio based pulsing
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        meshRef.current.scale.setScalar(scale);
        meshRef.current.rotation.z += 0.01;
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
    
    if (materialRef.current) {
      if (isSelected) {
        materialRef.current.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        materialRef.current.emissiveIntensity = 0.1;
      }
    }
  });

  const renderGeometry = () => {
    switch (geometry.id) {
      case 'tetrahedron':
        return <TetrahedronGeometry />;
      case 'cube':
        return <CubeGeometry />;
      case 'octahedron':
        return <OctahedronGeometry />;
      case 'icosahedron':
        return <IcosahedronGeometry />;
      case 'dodecahedron':
        return <DodecahedronGeometry />;
      case 'circle':
        return <CircleGeometry />;
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  };

  return (
    <group
      position={geometry.position}
      ref={meshRef}
      onClick={() => onClick(geometry)}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <mesh castShadow receiveShadow>
        {renderGeometry()}
        <meshPhysicalMaterial
          ref={materialRef}
          color={geometry.color}
          emissive={geometry.color}
          emissiveIntensity={isSelected ? 0.4 : 0.15}
          transparent
          opacity={isSelected ? 0.95 : 0.85}
          roughness={0.2}
          metalness={0.6}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          transmission={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Enhanced wireframe overlay for selected */}
      {isSelected && (
        <mesh>
          {renderGeometry()}
          <meshBasicMaterial
            color={geometry.color}
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {/* Element Label with better styling */}
      {geometry.element && (
        <Html position={[0, -2.2, 0]} center>
          <div 
            className="text-center font-bold pointer-events-none px-2 py-1 rounded-md backdrop-blur-sm"
            style={{ 
              color: geometry.color,
              fontSize: '14px',
              textShadow: '0 0 8px rgba(0,0,0,0.9)',
              background: `${geometry.color}20`,
              border: `1px solid ${geometry.color}40`
            }}
          >
            {geometry.element}
          </div>
        </Html>
      )}

      {/* Sacred ratio indicators with golden spiral */}
      {isSelected && (
        <group>
          {/* Golden ratio rings */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 1.85, 64]} />
            <meshStandardMaterial
              color="#FFD700"
              transparent
              opacity={0.6}
              emissive="#FFD700"
              emissiveIntensity={0.2}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.2, 2.25, 64]} />
            <meshStandardMaterial
              color="#FFD700"
              transparent
              opacity={0.3}
              emissive="#FFD700"
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Enhanced Sacred Geometry Components
function TetrahedronGeometry() {
  return <tetrahedronGeometry args={[1, 0]} />;
}

function CubeGeometry() {
  return <boxGeometry args={[1.4, 1.4, 1.4]} />;
}

function OctahedronGeometry() {
  return <octahedronGeometry args={[1, 0]} />;
}

function IcosahedronGeometry() {
  return <icosahedronGeometry args={[1, 0]} />;
}

function DodecahedronGeometry() {
  return <dodecahedronGeometry args={[1, 0]} />;
}

function CircleGeometry() {
  return (
    <group>
      {/* Multiple concentric circles for sacred symbolism */}
      <mesh>
        <ringGeometry args={[0.9, 1, 64]} />
      </mesh>
      <mesh>
        <ringGeometry args={[0.6, 0.65, 64]} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.3, 64]} />
      </mesh>
    </group>
  );
}

function FlowerOfLife() {
  const positions: [number, number, number][] = [
    [0, 0, -4], // Center
    [1.732, 0, -4], [-1.732, 0, -4], // Horizontal (√3 for perfect hexagon)
    [0.866, 1.5, -4], [-0.866, 1.5, -4], // Top
    [0.866, -1.5, -4], [-0.866, -1.5, -4], // Bottom
    [2.598, 1.5, -4], [2.598, -1.5, -4], // Right
    [-2.598, 1.5, -4], [-2.598, -1.5, -4], // Left
    [1.732, 3, -4], [-1.732, 3, -4], // Far top
    [1.732, -3, -4], [-1.732, -3, -4] // Far bottom
  ];

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <ringGeometry args={[0.95, 1, 64]} />
          <meshStandardMaterial
            color="#FFD700"
            transparent
            opacity={i === 0 ? 0.6 : 0.3}
            emissive="#FFD700"
            emissiveIntensity={i === 0 ? 0.2 : 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Sacred center point */}
      <mesh position={[0, 0, -3.9]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function SacredGeometry3D({ hideInCeremonies = false }: SacredGeometry3DProps) {
  const [selectedGeometry, setSelectedGeometry] = useState<GeometryData | null>(null);
  const [showFlowerOfLife, setShowFlowerOfLife] = useState(true);
  const [showCaptions, setShowCaptions] = useState(!hideInCeremonies);
  
  // Sacred frequency integration
  const { 
    isPlaying, 
    selectedFrequency, 
    frequencies, 
    toggleSacredSound, 
    selectFrequency 
  } = useFrequencyTool();

  const handleGeometryClick = (geometry: GeometryData) => {
    setSelectedGeometry(selectedGeometry?.id === geometry.id ? null : geometry);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-background to-card">
      {/* 3D Canvas - Reduced height for better scrolling */}
      <div className="h-[70vh] relative">
        <Canvas
          camera={{ position: [8, 6, 10], fov: 50 }}
          style={{ background: 'radial-gradient(circle, #0a0a0f 0%, #1a1a2e 100%)' }}
          shadows
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            {/* Enhanced Lighting Setup */}
            <ambientLight intensity={0.4} color="#ffffff" />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1.2} 
              color="#ffffff"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[-10, -10, -10]} intensity={0.6} color="#9370DB" />
            <pointLight position={[10, -10, 10]} intensity={0.4} color="#FFD700" />
            <spotLight 
              position={[0, 15, 0]} 
              intensity={0.8} 
              color="#87CEEB"
              angle={Math.PI / 3}
              penumbra={0.2}
              castShadow
            />
            
            {/* Sacred Geometries */}
            {geometryData.map(geometry => (
              <AnimatedGeometry
                key={geometry.id}
                geometry={geometry}
                isSelected={selectedGeometry?.id === geometry.id}
                onClick={handleGeometryClick}
              />
            ))}
            
            {/* Enhanced Flower of Life Background */}
            {showFlowerOfLife && <FlowerOfLife />}
            
            {/* Camera Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={6}
              maxDistance={20}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              autoRotate={false}
              autoRotateSpeed={0.5}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Enhanced UI Overlays with Sacred Frequencies */}
      <div className="absolute top-16 left-4 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shapes className="h-5 w-5 text-primary" />
                Sacred Geometry Explorer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Explore the five Platonic solids and their elemental correspondences in 3D space.
              </p>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFlowerOfLife(!showFlowerOfLife)}
                  >
                    {showFlowerOfLife ? 'Hide' : 'Show'} Flower
                  </Button>
                  <Button
                    variant={showCaptions ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => setShowCaptions(!showCaptions)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2"/>
                    {showCaptions ? 'Hide' : 'Show'} Mantra
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  • Click shapes to explore
                  • Drag to rotate view
                  • Scroll to zoom
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sacred Frequency Integration */}
          <Card className="bg-background/80 backdrop-blur-sm border-secondary/20 max-w-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-secondary" />
                Sacred Frequencies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={toggleSacredSound}
                  variant={isPlaying ? "default" : "outline"}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="text-xs">
                  <div className="font-medium">{selectedFrequency.name}</div>
                  <div className="text-muted-foreground">{selectedFrequency.hz} Hz</div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground">
                {selectedFrequency.purpose}
              </div>
              
              <div className="grid grid-cols-3 gap-1">
                {frequencies.slice(0, 6).map((freq) => (
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

                {selectedGeometry.mantra && showCaptions && (
                  <div>
                    <h4 className="font-semibold mb-2">Mantra</h4>
                    <p className="text-sm font-sacred" style={{ color: selectedGeometry.color }}>
                      “{selectedGeometry.mantra}”
                    </p>
                  </div>
                )}

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
              <div className="flex space-x-2 flex-wrap justify-center">
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