import React from 'react';

const Witness = () => {
  return (
    <mesh>
      <capsuleGeometry args={[0.2, 1, 4, 8]} />
      <meshStandardMaterial color={'#f0f0f0'} />
    </mesh>
  );
};

export default Witness;
