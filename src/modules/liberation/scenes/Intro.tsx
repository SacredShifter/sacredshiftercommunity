import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import { useLiberationState } from '../context/LiberationContext';
import * as THREE from 'three';

export const Intro: React.FC = () => {
  const { send } = useLiberationState();
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      orbRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Central orb */}
      <Sphere ref={orbRef} args={[2, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#8A2BE2"
          transparent
          opacity={0.7}
          emissive="#4B0082"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Surrounding energy rings */}
      {[1, 2, 3].map((ring) => (
        <mesh key={ring} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[2.5 + ring * 0.5, 3 + ring * 0.5, 32]} />
          <meshBasicMaterial
            color="#8A2BE2"
            transparent
            opacity={0.3 - ring * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Welcome text */}
      <Text
        position={[0, -4, 0]}
        fontSize={0.8}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.woff"
      >
        Gate of Liberation
      </Text>
      
      <Text
        position={[0, -5.5, 0]}
        fontSize={0.4}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Regular.woff"
        maxWidth={15}
        textAlign="center"
      >
        Journey beyond the fear of death to discover the fullness of life.
        This experience uses gentle 3D visuals, optional sound, and breath guidance.
      </Text>
      
      {/* Particle field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(
              Array.from({ length: 500 }, () => [
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
              ]).flat()
            )}
            count={500}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#8A2BE2"
          size={0.05}
          transparent
          opacity={0.4}
          sizeAttenuation
        />
      </points>
    </group>
  );
};