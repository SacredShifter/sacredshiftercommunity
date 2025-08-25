import React from 'react';
import { motion } from 'framer-motion';

interface CircularTimerProps {
  progress: number; // 0 to 100
  color: string;
}

const CircularTimer: React.FC<CircularTimerProps> = ({ progress, color }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
      {/* Background Circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        strokeWidth="10"
        className="stroke-current text-primary/10"
        fill="transparent"
      />
      {/* Progress Circle */}
      <motion.circle
        cx="60"
        cy="60"
        r={radius}
        strokeWidth="10"
        fill="transparent"
        className={`stroke-current ${color}`}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.3, ease: 'linear' }}
      />
    </svg>
  );
};

export default CircularTimer;
