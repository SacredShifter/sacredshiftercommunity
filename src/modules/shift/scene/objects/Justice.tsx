import React from 'react';

const Justice = () => {
  return (
    <mesh>
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      <meshStandardMaterial color={'#f0f0f0'} />
    </mesh>
  );
};

export default Justice;
