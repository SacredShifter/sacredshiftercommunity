import React, { useState, useRef } from 'react';
import { useCursor } from '@react-three/drei';
import { useCosmogramStore } from '../store';
import { onChapterJump } from '../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const Eros: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const setActiveNode = useCosmogramStore((state) => state.setActiveNode);
  const meshRef = useRef<THREE.Mesh>(null!);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveNode('eros');
    onChapterJump('eros');
  };

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const pulse = (Math.sin(time * Math.PI) + 1) / 2;
      const scale = 0.4 + pulse * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
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
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={hovered ? 1 : 0.5}
        />
      </mesh>
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshBasicMaterial color="#ff0000" side={THREE.BackSide} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
};
