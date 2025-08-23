import React from 'react';
import ShiftCanvas from './scene/ShiftCanvas';
import HUD from './ui/HUD';

const ShiftPage = () => {
  return (
    <div>
      <ShiftCanvas />
      <HUD />
    </div>
  );
};

export default ShiftPage;
