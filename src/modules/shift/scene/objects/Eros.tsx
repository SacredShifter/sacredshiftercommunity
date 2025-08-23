import React from 'react';

const Eros = () => {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={'#ff0000'} />
    </mesh>
  );
};

export default Eros;
