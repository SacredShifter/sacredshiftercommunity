import React from 'react';

const Cube = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={'#f0f0f0'} />
    </mesh>
  );
};

export default Cube;
