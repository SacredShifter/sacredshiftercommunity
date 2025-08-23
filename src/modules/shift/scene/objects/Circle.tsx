import React from 'react';

const Circle = () => {
  return (
    <mesh>
      <torusGeometry args={[1, 0.1, 16, 100]} />
      <meshStandardMaterial color={'#f0f0f0'} />
    </mesh>
  );
};

export default Circle;
