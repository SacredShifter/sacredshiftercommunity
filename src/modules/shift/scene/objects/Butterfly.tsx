import React from 'react';

const Butterfly = () => {
  return (
    <mesh>
      <coneGeometry args={[0.5, 1, 4]} />
      <meshStandardMaterial color={'#f0f0f0'} />
    </mesh>
  );
};

export default Butterfly;
