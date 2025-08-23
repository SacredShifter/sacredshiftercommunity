import React, { useState, useRef, useMemo } from 'react';
import { useCursor } from '@react-three/drei';
import { useCosmogramStore } from '../store';
import { onChapterJump } from '../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const PARTICLE_COUNT = 50;

export const Butterfly: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const setActiveNode = useCosmogramStore((state) => state.setActiveNode);
  const leftWingRef = useRef<THREE.Mesh>(null!);
  const rightWingRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveNode('butterfly');
    onChapterJump('butterfly');
  };

  const particles = useMemo(() => {
    const p = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      p[i3] = (Math.random() - 0.5) * 0.1;
      p[i3 + 1] = (Math.random() - 0.5) * 0.1;
      p[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return p;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (leftWingRef.current && rightWingRef.current) {
      const flutter = Math.sin(time * 10) * 0.5;
      leftWingRef.current.rotation.y = flutter;
      rightWingRef.current.rotation.y = -flutter;
    }
    if (groupRef.current) {
        groupRef.current.position.x = Math.sin(time * 0.5) * 0.5;
        groupRef.current.position.y = Math.cos(time * 0.5) * 0.5;
    }
    if (particlesRef.current) {
        const pos = particlesRef.current.geometry.attributes.position;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            pos.array[i3 + 1] -= 0.01;
            if (pos.array[i3 + 1] < -1) {
                pos.array[i3 + 1] = 1;
            }
        }
        pos.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <group
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <mesh ref={leftWingRef} position={[-0.75, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color={hovered ? '#f0f0f0' : '#ffffff'} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={rightWingRef} position={[0.75, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color={hovered ? '#f0f0f0' : '#ffffff'} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={particles} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.5} />
      </points>
    </group>
  );
};
