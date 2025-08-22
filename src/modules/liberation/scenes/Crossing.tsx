import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useLiberationState } from '../context/LiberationContext';
import { ParticleSystem } from './SharedAssets';
import * as THREE from 'three';
import gsap from 'gsap';

export const Crossing: React.FC = () => {
  const { send } = useLiberationState();
  const thresholdRef = useRef<THREE.Mesh>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // GSAP timeline for threshold animation
    if (thresholdRef.current) {
      timelineRef.current = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
      timelineRef.current
        .to(thresholdRef.current.material, { opacity: 0.8, duration: 2 })
        .to(thresholdRef.current.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 3 })
        .call(() => send({ type: 'NEXT' }));
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [send]);

  useFrame((state) => {
    if (thresholdRef.current) {
      const time = state.clock.elapsedTime;
      thresholdRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group>
      {/* Gentle lighting */}
      <ambientLight intensity={0.4} color="#FFD700" />
      <pointLight position={[0, 0, 10]} intensity={0.6} color="#FFA500" />
      
      {/* Threshold plane */}
      <mesh ref={thresholdRef} position={[0, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Golden ratio lattice */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} position={[0, 0, 0.1]} rotation={[0, 0, (i * Math.PI) / 8]}>
          <ringGeometry args={[1 + i * 1.618, 1.1 + i * 1.618, 32]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.4 - i * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Instruction text */}
      <Text
        position={[0, -6, 0]}
        fontSize={0.6}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.woff"
        maxWidth={12}
        textAlign="center"
      >
        Step through the threshold.
        What you are cannot end.
      </Text>
      
      {/* Particle transition system */}
      <ParticleSystem count={800} spread={15} color="#FFD700" />
    </group>
  );
};