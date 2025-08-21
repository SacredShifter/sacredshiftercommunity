import React, { useEffect, useState } from 'react';

export const SacredCosmicBackground = () => {
  const [orbs, setOrbs] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; duration: number }>>([]);

  useEffect(() => {
    // Create floating sacred orbs
    const createOrbs = () => {
      const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
      const newOrbs = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 200 + 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 15
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
            background: `radial-gradient(circle, hsl(${orb.color} / 0.1) 0%, transparent 70%)`,
            filter: 'blur(2px)',
            animation: `orb-float ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.id * -3}s`
          }}
        />
      ))}
    </div>
  );
};

export default SacredCosmicBackground;