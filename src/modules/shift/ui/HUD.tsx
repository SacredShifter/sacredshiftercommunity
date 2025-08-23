import React from 'react';
import Legend from './Legend';

const HUD = () => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, color: 'white' }}>
      <button>Play/Pause</button>
      <div>
        <button>Chapter 1</button>
        <button>Chapter 2</button>
        <button>Chapter 3</button>
      </div>
      <Legend />
    </div>
  );
};

export default HUD;
