import React, { useState, useRef } from 'react';
import { useCursor } from '@react-three/drei';
import { useShiftStore } from '../../state/useShiftStore';
import { onChapterJump } from '../../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const EnhancedCircle: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const { setActiveNode, activeNode } = useShiftStore();
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
      
      if (isFocused) {
        const time = state.clock.getElapsedTime();
        const bloom = (Math.sin(time * 2) + 1) / 2;
        meshRef.current.scale.setScalar(1 + bloom * 0.1);
      }
    }
  });

  return (
    <group position={[4, 2, 0]}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <torusGeometry args={[1, 0.2, 16, 100]} />
        <meshStandardMaterial
          color={hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
          emissive={isFocused ? 'hsl(var(--accent))' : 'hsl(0 0% 0%)'}
          emissiveIntensity={isFocused ? 0.5 : 0}
        />
      </mesh>
      {hovered && (
        <mesh>
          <torusGeometry args={[1.05, 0.25, 16, 100]} />
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