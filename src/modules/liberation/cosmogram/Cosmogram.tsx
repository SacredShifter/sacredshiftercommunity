import React, { useEffect } from 'react';
import { useCosmogramStore, ActiveNode } from '../store';
import { onChapterJump } from '../events';
import { Cube } from './Cube';
import { Circle } from './Circle';
import { Witness } from './Witness';
import { Eros } from './Eros';
import { Butterfly } from './Butterfly';
import { Justice } from './Justice';

const nodeMap: { [key: string]: ActiveNode } = {
  '1': 'cube',
  '2': 'circle',
  '3': 'witness',
  '4': 'eros',
  '5': 'butterfly',
  '6': 'justice',
};

export const Cosmogram: React.FC = () => {
  const setActiveNode = useCosmogramStore((state) => state.setActiveNode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const node = nodeMap[e.key];
      if (node) {
        setActiveNode(node);
        onChapterJump(node);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveNode]);

  return (
    <group>
      <group position={[-4, 2, 0]}>
        <Cube />
      </group>
      <group position={[4, 2, 0]}>
        <Circle />
      </group>
      <group position={[-4, -2, 0]}>
        <Witness />
      </group>
      <group position={[0, 0, 0]}>
        <Eros />
      </group>
      <group position={[4, -2, 0]}>
        <Butterfly />
      </group>
      <group position={[0, -3, 0]}>
        <Justice />
      </group>
    </group>
  );
};
