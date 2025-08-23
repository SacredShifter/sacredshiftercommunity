import React, { useState, useMemo } from 'react';
import { useCursor } from '@react-three/drei';
import { useCosmogramStore } from '../store';
import { onChapterJump } from '../events';
import * as THREE from 'three';

export const Witness: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const setActiveNode = useCosmogramStore((state) => state.setActiveNode);
  const activeNode = useCosmogramStore((state) => state.activeNode);

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
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
      onClick={handleClick}
    >
      <lineSegments geometry={bodyGeometry}>
        <lineBasicMaterial color={hovered ? '#f0f0f0' : '#ffffff'} />
      </lineSegments>
      <line geometry={headGeometry}>
        <lineBasicMaterial color={isFocused ? '#ffff00' : (hovered ? '#f0f0f0' : '#ffffff')} />
      </line>
    </group>
  );
};
