import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useUnhookingState } from '../context/UnhookingContext';
import * as THREE from 'three';

export const Intro: React.FC = () => {
  const { send } = useUnhookingState();
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (orbRef.current) {
      const time = state.clock.elapsedTime;
      orbRef.current.rotation.y = time * 0.3;
      orbRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.1);
    }
  });

  const handleStart = () => {
    send({ type: 'START' });
  };

  return (
    <group>
      {/* Intro lighting */}
      <ambientLight intensity={0.2} color="#FF6B6B" />
      <pointLight position={[3, 3, 3]} intensity={0.4} color="#FF4500" />
      
      {/* Central orb */}
      <mesh ref={orbRef} position={[0, 0, 0]} onClick={handleStart}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#FF6B6B"
          emissive="#8B0000"
          emissiveIntensity={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.7}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={14}
        textAlign="center"
      >
        Unhooking from Fear Broadcasts
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={16}
        textAlign="center"
      >
        Learn to detect and dismiss collective fear loops.
        Click to begin unhooking from inherited fears.
      </Text>
    </group>
  );
};