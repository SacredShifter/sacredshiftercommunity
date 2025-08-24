import React from 'react';

// Safe wrappers to prevent undefined prop errors in Three.js components

// Safe wrapper for positions
export const safePosition = (position: any): [number, number, number] => {
  if (Array.isArray(position) && position.length >= 3) {
    return [
      typeof position[0] === 'number' ? position[0] : 0,
      typeof position[1] === 'number' ? position[1] : 0,
      typeof position[2] === 'number' ? position[2] : 0,
    ];
  }
  return [0, 0, 0];
};

// Safe wrapper for rotations
export const safeRotation = (rotation: any): [number, number, number] => {
  if (Array.isArray(rotation) && rotation.length >= 3) {
    return [
      typeof rotation[0] === 'number' ? rotation[0] : 0,
      typeof rotation[1] === 'number' ? rotation[1] : 0,
      typeof rotation[2] === 'number' ? rotation[2] : 0,
    ];
  }
  return [0, 0, 0];
};

// Safe wrapper for scales
export const safeScale = (scale: any): [number, number, number] | number => {
  if (typeof scale === 'number') {
    return scale;
  }
  if (Array.isArray(scale) && scale.length >= 3) {
    return [
      typeof scale[0] === 'number' ? scale[0] : 1,
      typeof scale[1] === 'number' ? scale[1] : 1,
      typeof scale[2] === 'number' ? scale[2] : 1,
    ];
  }
  return 1;
};

// Safe wrapper for geometry args
export const safeArgs = (args: any[]): any[] => {
  if (Array.isArray(args)) {
    return args.filter(arg => arg !== undefined && arg !== null && typeof arg === 'number');
  }
  return [];
};