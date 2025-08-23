import React, { useState, useRef } from 'react';
import { RoundedBox, useCursor } from '@react-three/drei';
import { useCosmogramStore } from '../store';
import { onChapterJump } from '../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { outlineMaterial } from './materials';

export const Cube: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  const setActiveNode = useCosmogramStore((state) => state.setActiveNode);
  const meshRef = useRef<THREE.Mesh>(null!);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveNode('cube');
    onChapterJump('cube');
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
  };

  useFrame(() => {
    if (meshRef.current) {
      const scale = clicked ? 0.95 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group>
      <RoundedBox
        ref={meshRef}
        args={[1.5, 1.5, 1.5]}
        radius={0.1}
        smoothness={4}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={hovered ? '#f0f0f0' : '#ffffff'}
          emissive={hovered ? '#ffffff' : '#000000'}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </RoundedBox>
      {hovered && (
        <RoundedBox
          args={[1.6, 1.6, 1.6]}
          radius={0.1}
          smoothness={4}
          material={outlineMaterial}
        />
      )}
    </group>
  );
};
