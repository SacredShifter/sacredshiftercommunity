import { useState, useEffect, useMemo, useCallback } from 'react';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BreathCycle {
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

const defaultCycle: BreathCycle = {
  inhale: 4000,
  hold1: 4000,
  exhale: 6000,
  hold2: 2000,
};

const phaseOrder: BreathPhase[] = ['inhale', 'hold1', 'exhale', 'hold2'];

export const useBreathCoach = (cycle: BreathCycle = defaultCycle) => {
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentPhase = useMemo(() => phaseOrder[phaseIndex], [phaseIndex]);
  const phaseDuration = useMemo(() => cycle[currentPhase], [cycle, currentPhase]);

  useEffect(() => {
    if (!isActive) return;

    const startTime = Date.now();
    let animationFrameId: number;

    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = Math.min(elapsedTime / phaseDuration, 1);
      setProgress(newProgress);
      if (newProgress < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    const phaseTimeout = setTimeout(() => {
      setPhaseIndex((prevIndex) => (prevIndex + 1) % phaseOrder.length);
      setProgress(0);
    }, phaseDuration);

    return () => {
      clearTimeout(phaseTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, phaseIndex, phaseDuration]);

  const start = useCallback(() => {
    setIsActive(true);
    setPhaseIndex(0);
    setProgress(0);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    currentPhase,
    progress,
    start,
    stop,
  };
};