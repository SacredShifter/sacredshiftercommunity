import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Cube from './objects/Cube';
import Circle from './objects/Circle';
import Witness from './objects/Witness';
import Eros from './objects/Eros';
import Butterfly from './objects/Butterfly';
import Justice from './objects/Justice';

const ShiftCanvas = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Cube />
      <Circle />
      <Witness />
      <Eros />
      <Butterfly />
      <Justice />
      <OrbitControls />
    </Canvas>
  );
};

export default ShiftCanvas;
