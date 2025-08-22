import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Torus } from '@react-three/drei';
import { useLiberationState } from '../context/LiberationContext';
import { useBreathCoach } from '../hooks/useBreathCoach';
import * as THREE from 'three';

export const Integration: React.FC = () => {
  const { send } = useLiberationState();
  const torusRef = useRef<THREE.Mesh>(null);
  const { currentPhase, isActive } = useBreathCoach();
  
  useFrame((state) => {
    if (torusRef.current && isActive) {
      const time = state.clock.elapsedTime;
      
      // Breathing animation
      let scale = 1;
      switch (currentPhase) {
        case 'inhale':
          scale = 1 + Math.sin(time * 2) * 0.3;
          break;
        case 'hold1':
          scale = 1.3;
          break;
        case 'exhale':
          scale = 1 - Math.sin(time * 2) * 0.3;
          break;
        case 'hold2':
          scale = 0.7;
          break;
      }
      
      torusRef.current.scale.setScalar(scale);
      torusRef.current.rotation.x = time * 0.1;
      torusRef.current.rotation.y = time * 0.15;
    }
  });

  return (
    <group>
      {/* Gentle lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 10, 10]} intensity={0.3} />
      
      {/* Breathing torus */}
      <Torus ref={torusRef} args={[2, 0.5, 16, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#20B2AA"
          transparent
          opacity={0.8}
          emissive="#008B8B"
          emissiveIntensity={0.3}
        />
      </Torus>
      
      {/* Body outline suggestion */}
      <mesh position={[0, -1, -2]}>
        <capsuleGeometry args={[1, 4, 4, 8]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
      
      {/* Breathing instruction rings */}
      {[1, 2, 3].map((ring) => (
        <mesh
          key={ring}
          position={[0, 0, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[2.5 + ring * 0.8, 3 + ring * 0.8, 32]} />
          <meshBasicMaterial
            color="#20B2AA"
            transparent
            opacity={0.2 - ring * 0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Instructions */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.6}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.woff"
        maxWidth={12}
        textAlign="center"
      >
        Exhale is the little death.
        Inhale is renewal.
        The rhythm is one.
      </Text>
      
      <Text
        position={[0, -6, 0]}
        fontSize={0.4}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
        maxWidth={15}
        textAlign="center"
      >
        Breathe with the torus. Let each exhale release what no longer serves.
        Let each inhale welcome your eternal nature.
      </Text>
      
      {/* Subtle particle flow representing breath */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(
              Array.from({ length: 100 }, (_, i) => [
                Math.sin(i * 0.1) * 3,
                (i - 50) * 0.2,
                Math.cos(i * 0.1) * 3,
              ]).flat()
            )}
            count={100}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#20B2AA"
          size={0.1}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
};