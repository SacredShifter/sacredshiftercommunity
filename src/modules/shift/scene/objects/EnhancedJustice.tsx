import React, { useState, useRef } from 'react';
import { useCursor } from '@react-three/drei';
import { useShiftStore } from '../../state/useShiftStore';
import { onChapterJump } from '../../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const EnhancedJustice: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const { setActiveNode } = useShiftStore();
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
      // Footstep pulse every 1000ms
      const pulse = Math.pow(Math.sin(time * 2), 16);
      const scale = 1 + pulse * 0.2;
      meshRef.current.scale.set(1, scale, 1);
    }
  });

  return (
    <group position={[0, -3, 0]}>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial 
          color={hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
          emissive={hovered ? 'hsl(var(--primary))' : 'hsl(0 0% 0%)'}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 0.1, 32]} />
          <meshBasicMaterial
            color="hsl(var(--primary))"
            side={THREE.BackSide}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};