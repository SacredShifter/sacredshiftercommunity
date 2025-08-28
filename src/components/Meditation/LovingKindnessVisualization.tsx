import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';

interface LovingKindnessVisualizationProps {
  isActive: boolean;
  stage: 'self' | 'loved-ones' | 'neutral' | 'difficult' | 'all-beings';
  progress: number;
}

function HeartOrb({ isActive, stage, progress }: LovingKindnessVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const heartsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current || !heartsRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    
    // Gentle pulsing
    const pulse = 1 + Math.sin(time * 2) * 0.1;
    groupRef.current.scale.setScalar(pulse);
    
    // Heart particles floating
    heartsRef.current.children.forEach((heart, index) => {
      const offset = index * 0.5;
      heart.position.y = Math.sin(time + offset) * 0.3;
      heart.rotation.z = Math.sin(time * 0.5 + offset) * 0.2;
    });
  });
  
  // Stage-based colors
  const stageColor = {
    'self': '#ff6b9d',
    'loved-ones': '#ffa500',
    'neutral': '#4facfe',
    'difficult': '#9c88ff',
    'all-beings': '#50fa7b'
  }[stage];
  
  return (
    <group ref={groupRef}>
      {/* Central love orb */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color={stageColor} transparent opacity={0.8} />
      </Sphere>
      
      {/* Radiating love energy */}
      <group ref={heartsRef}>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 2;
          return (
            <Sphere
              key={i}
              args={[0.1, 8, 8]}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                0
              ]}
            >
              <meshBasicMaterial color={stageColor} transparent opacity={0.6} />
            </Sphere>
          );
        })}
      </group>
      
      {/* Glow effect */}
      <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color={stageColor} transparent opacity={0.2} />
      </Sphere>
    </group>
  );
}

function StageText({ stage }: { stage: string }) {
  const stageLabels = {
    'self': 'Loving Yourself',
    'loved-ones': 'Loving Family & Friends',
    'neutral': 'Loving Neutral People',
    'difficult': 'Loving Difficult People',
    'all-beings': 'Loving All Beings'
  };
  
  return (
    <Text
      position={[0, -2.5, 0]}
      fontSize={0.25}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {stageLabels[stage as keyof typeof stageLabels]}
    </Text>
  );
}

export default function LovingKindnessVisualization(props: LovingKindnessVisualizationProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-pink-500/10 to-orange-500/10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} color="#ff6b9d" />
        
        <HeartOrb {...props} />
        <StageText stage={props.stage} />
      </Canvas>
    </div>
  );
}