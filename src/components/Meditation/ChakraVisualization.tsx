import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Torus, Text } from '@react-three/drei';
import * as THREE from 'three';

interface ChakraVisualizationProps {
  isActive: boolean;
  currentChakra: number; // 0-6 for the 7 chakras
  progress: number;
}

const chakraData = [
  { name: 'Root', color: '#ff0000', position: [0, -3, 0] },
  { name: 'Sacral', color: '#ff8c00', position: [0, -2, 0] },
  { name: 'Solar Plexus', color: '#ffd700', position: [0, -1, 0] },
  { name: 'Heart', color: '#00ff00', position: [0, 0, 0] },
  { name: 'Throat', color: '#00bfff', position: [0, 1, 0] },
  { name: 'Third Eye', color: '#8a2be2', position: [0, 2, 0] },
  { name: 'Crown', color: '#9370db', position: [0, 3, 0] }
];

function ChakraOrbs({ isActive, currentChakra, progress }: ChakraVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    
    groupRef.current.children.forEach((chakra, index) => {
      const isActive = index === currentChakra;
      const targetScale = isActive ? 1.5 + Math.sin(time * 3) * 0.2 : 0.8;
      const targetOpacity = isActive ? 1 : 0.4;
      
      chakra.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Update material opacity
      const sphere = chakra.children[0] as THREE.Mesh;
      if (sphere && sphere.material) {
        (sphere.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
          (sphere.material as THREE.MeshBasicMaterial).opacity,
          targetOpacity,
          0.1
        );
      }
      
      // Rotation for active chakra
      if (isActive) {
        chakra.rotation.y = time * 2;
      }
    });
  });
  
  return (
    <group ref={groupRef}>
      {chakraData.map((chakra, index) => (
        <group key={index} position={chakra.position as [number, number, number]}>
          <Sphere args={[0.3, 16, 16]}>
            <meshBasicMaterial color={chakra.color} transparent opacity={0.8} />
          </Sphere>
          
          {/* Energy rings */}
          <Torus args={[0.5, 0.05, 8, 16]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color={chakra.color} transparent opacity={0.5} />
          </Torus>
          
          {/* Glow effect */}
          <Sphere args={[0.4, 16, 16]}>
            <meshBasicMaterial color={chakra.color} transparent opacity={0.2} />
          </Sphere>
        </group>
      ))}
    </group>
  );
}

function EnergyFlow({ isActive, currentChakra }: ChakraVisualizationProps) {
  const flowRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!flowRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    
    flowRef.current.children.forEach((particle, index) => {
      const offset = index * 0.2;
      particle.position.y = -3 + ((time * 2 + offset) % 6);
      particle.position.x = Math.sin(time + offset) * 0.1;
      
      // Fade particles as they move
      const progress = ((time * 2 + offset) % 6) / 6;
      const opacity = Math.sin(progress * Math.PI) * 0.6;
      (particle as any).material.opacity = opacity;
    });
  });
  
  return (
    <group ref={flowRef}>
      {[...Array(10)].map((_, i) => (
        <Sphere key={i} args={[0.05, 8, 8]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </Sphere>
      ))}
    </group>
  );
}

function ChakraText({ currentChakra }: { currentChakra: number }) {
  const chakra = chakraData[currentChakra];
  
  return (
    <Text
      position={[0, -4, 0]}
      fontSize={0.3}
      color={chakra.color}
      anchorX="center"
      anchorY="middle"
    >
      {chakra.name} Chakra
    </Text>
  );
}

export default function ChakraVisualization(props: ChakraVisualizationProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} />
        
        <ChakraOrbs {...props} />
        <EnergyFlow {...props} />
        <ChakraText currentChakra={props.currentChakra} />
      </Canvas>
    </div>
  );
}