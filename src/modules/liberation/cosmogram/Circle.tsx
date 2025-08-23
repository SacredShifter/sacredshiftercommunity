import React, { useState, useRef } from 'react';
import { useCursor } from '@react-three/drei';
import { useCosmogramStore } from '../store';
import { onChapterJump } from '../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { outlineMaterial } from './materials';

export const Circle: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const setActiveNode = useCosmogramStore((state) => state.setActiveNode);
  const activeNode = useCosmogramStore((state) => state.activeNode);
  const meshRef = useRef<THREE.Mesh>(null!);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveNode('circle');
    onChapterJump('circle');
  };

  const isFocused = activeNode === 'circle';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x += 0.001;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <torusGeometry args={[1, 0.2, 16, 100]} />
        <meshStandardMaterial
          color={hovered ? '#f0f0f0' : '#ffffff'}
          emissive={isFocused ? '#ffffff' : '#000000'}
          emissiveIntensity={isFocused ? 0.5 : 0}
        />
      </mesh>
      {hovered && (
        <mesh>
          <torusGeometry args={[1.05, 0.25, 16, 100]} />
          <primitive object={outlineMaterial} />
        </mesh>
      )}
    </group>
  );
};
