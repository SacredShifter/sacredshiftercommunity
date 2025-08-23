import React, { useState, useRef } from 'react';
import { useCursor } from '@react-three/drei';
import { useCosmogramStore } from '../store';
import { onChapterJump } from '../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { outlineMaterial } from './materials';

export const Justice: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const setActiveNode = useCosmogramStore((state) => state.setActiveNode);
  const meshRef = useRef<THREE.Mesh>(null!);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveNode('justice');
    onChapterJump('justice');
  };

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = Math.pow(Math.sin(time * 2), 16);
      const scale = 1 + pulse * 0.2;
      meshRef.current.scale.set(1, scale, 1);
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color={hovered ? '#f0f0f0' : '#ffffff'} />
      </mesh>
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.1, 32]} />
          <primitive object={outlineMaterial} />
        </mesh>
      )}
    </group>
  );
};
