import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EnhancedCosmogram } from './EnhancedCosmogram';

const ShiftCanvas = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <EnhancedCosmogram />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={5}
        />
      </Canvas>
    </div>
  );
};

export default ShiftCanvas;
