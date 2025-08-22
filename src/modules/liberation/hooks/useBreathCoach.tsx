import { useState, useEffect } from 'react';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const useBreathCoach = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathPhase>('inhale');

  return {
    isActive,
    currentPhase,
    start: () => setIsActive(true),
    stop: () => setIsActive(false),
  };
};