import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BreathRingProps {
  phase: BreathPhase;
  progress: number;
  size?: number;
  strokeWidth?: number;
}

const phaseConfig = {
  inhale: { label: 'Inhale', color: '#63e6be' }, // teal
  hold1: { label: 'Hold', color: '#fcc419' }, // yellow
  exhale: { label: 'Exhale', color: '#e67700' }, // orange
  hold2: { label: 'Hold', color: '#fcc419' }, // yellow
};

export const BreathRing: React.FC<BreathRingProps> = ({
  phase,
  progress,
  size = 120,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const { label, color } = phaseConfig[phase];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ffffff30"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </svg>
      <AnimatePresence mode="wait">
        <motion.div
          key={label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="absolute text-center"
        >
          <p className="text-white text-lg font-medium">{label}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
