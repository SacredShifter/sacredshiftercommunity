import React, { useState, useMemo } from 'react';
import { useCursor } from '@react-three/drei';
import { useShiftStore } from '../../state/useShiftStore';
import { onChapterJump } from '../../events';
import * as THREE from 'three';

export const EnhancedWitness: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const { setActiveNode, activeNode } = useShiftStore();

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveNode('witness');
    onChapterJump('witness');
  };

  const isFocused = activeNode === 'witness';

  const headPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * 0.5, 2.5 + Math.sin(angle) * 0.5, 0));
    }
    return points;
  }, []);

  const bodyPoints = useMemo(() => [
    new THREE.Vector3(0, 2, 0), new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-1, 1.5, 0), new THREE.Vector3(1, 1.5, 0),
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, -1.5, 0),
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, -1.5, 0),
  ], []);

  const headGeometry = new THREE.BufferGeometry().setFromPoints(headPoints);
  const bodyGeometry = new THREE.BufferGeometry().setFromPoints(bodyPoints);

  return (
    <group
      position={[-4, -2, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
      onClick={handleClick}
    >
      <lineSegments geometry={bodyGeometry}>
        <lineBasicMaterial color={hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'} />
      </lineSegments>
      <lineSegments geometry={headGeometry}>
        <lineBasicMaterial 
          color={isFocused ? 'hsl(var(--accent))' : (hovered ? 'hsl(var(--primary))' : 'hsl(var(--foreground))')}
          opacity={isFocused ? 1 : 0.8}
          transparent
        />
      </lineSegments>
      {isFocused && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial 
            color="hsl(var(--accent))" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};