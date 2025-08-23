import React from 'react';
import { Cosmogram } from '../cosmogram/Cosmogram';

export const Intro: React.FC = () => {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Cosmogram />
    </group>
  );
};