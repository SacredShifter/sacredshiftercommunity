import React, { useEffect } from 'react';
import { useShiftStore, ActiveNode } from '../state/useShiftStore';
import { onChapterJump } from '../events';
import { EnhancedCube } from './objects/EnhancedCube';
import { EnhancedCircle } from './objects/EnhancedCircle';
import { EnhancedWitness } from './objects/EnhancedWitness';
import { EnhancedEros } from './objects/EnhancedEros';
import { EnhancedButterfly } from './objects/EnhancedButterfly';
import { EnhancedJustice } from './objects/EnhancedJustice';

const nodeMap: { [key: string]: ActiveNode } = {
  '1': 'cube',
  '2': 'circle',
  '3': 'witness',
  '4': 'eros',
  '5': 'butterfly',
  '6': 'justice',
};

export const EnhancedCosmogram: React.FC = () => {
  const { setActiveNode } = useShiftStore();

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
      <EnhancedCube />
      <EnhancedCircle />
      <EnhancedWitness />
      <EnhancedEros />
      <EnhancedButterfly />
      <EnhancedJustice />
    </group>
  );
};