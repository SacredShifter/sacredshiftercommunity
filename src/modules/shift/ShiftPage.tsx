import React from 'react';
import ShiftCanvas from './scene/ShiftCanvas';
import { YouTubeIntegratedHUD } from './ui/YouTubeIntegratedHUD';

const ShiftPage = () => {
  return (
    <div className="w-full h-screen relative bg-background">
      <ShiftCanvas />
      <YouTubeIntegratedHUD />
    </div>
  );
};

export default ShiftPage;
