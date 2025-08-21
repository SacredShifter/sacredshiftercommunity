import React, { useEffect, useState } from 'react';

export const SacredCosmicBackground = () => {
  const [orbs, setOrbs] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; duration: number }>>([]);

  useEffect(() => {
    // Create floating sacred orbs
    const createOrbs = () => {
      const colors = [
        '269 69% 58%', // primary violet
        '196 83% 60%', // secondary aqua  
        '324 78% 54%', // accent magenta
        '143 25% 86%', // truth mint
        '60 100% 50%'  // pulse yellow
      ];
      const newOrbs = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 300 + 150,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 25 + 20
      }));
      setOrbs(newOrbs);
    };

    createOrbs();
  }, []);

  return (
    <div className="sacred-cosmic-orbs">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, hsl(${orb.color} / 0.15) 0%, hsl(${orb.color} / 0.05) 50%, transparent 70%)`,
            filter: 'blur(2px)',
            animation: `orb-float ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.id * -4}s`,
            zIndex: -1
          }}
        />
      ))}
    </div>
  );
};

export default SacredCosmicBackground;