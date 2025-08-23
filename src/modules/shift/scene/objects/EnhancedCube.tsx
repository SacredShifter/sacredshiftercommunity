import React, { useState, useRef } from 'react';
import { RoundedBox, useCursor } from '@react-three/drei';
import { useShiftStore } from '../../state/useShiftStore';
import { onChapterJump } from '../../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const EnhancedCube: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { setActiveNode, activeNode } = useShiftStore();
  const meshRef = useRef<THREE.Mesh>(null!);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveNode('cube');
    onChapterJump('cube');
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
  };

  const isFocused = activeNode === 'cube';

  useFrame(() => {
    if (meshRef.current) {
      const scale = clicked ? 0.95 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  return (
    <group position={[-4, 2, 0]}>
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
          color={hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
          emissive={isFocused ? 'hsl(var(--primary))' : 'hsl(0 0% 0%)'}
          emissiveIntensity={isFocused ? 0.3 : (hovered ? 0.1 : 0)}
        />
      </RoundedBox>
      {hovered && (
        <RoundedBox
          args={[1.6, 1.6, 1.6]}
          radius={0.1}
          smoothness={4}
        >
          <meshBasicMaterial
            color="hsl(var(--primary))"
            side={THREE.BackSide}
            transparent
            opacity={0.3}
          />
        </RoundedBox>
      )}
    </group>
  );
};