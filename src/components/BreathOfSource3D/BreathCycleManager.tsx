import React, { useRef, useEffect } from 'react';

export type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface BreathCycleManagerProps {
  isActive: boolean;
  preset: 'liberation' | 'sovereignty' | 'basic';
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  onPhaseChange: (phase: BreathPhase) => void;
  onCycleComplete: () => void;
  onTimeUpdate: (time: number) => void;
}

const breathPresets = {
  basic: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
  liberation: { inhale: 4, holdIn: 1, exhale: 6, holdOut: 1 },
  sovereignty: { inhale: 5, holdIn: 5, exhale: 8, holdOut: 5 }
};

export default function BreathCycleManager({
  isActive,
  preset,
  trustSpeed,
  onPhaseChange,
  onCycleComplete,
  onTimeUpdate,
}: BreathCycleManagerProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<BreathPhase>('inhale');

  const speedMultipliers = {
    gentle: 1.5,
    balanced: 1.0,
    bold: 0.7,
  };

  const speedMultiplier = speedMultipliers[trustSpeed];
  const pattern = breathPresets[preset];

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!isActive) {
      onTimeUpdate(0);
      return;
    }

    phaseRef.current = 'inhale';
    let currentPhaseIndex = 0;
    const phases: BreathPhase[] = ['inhale', 'holdIn', 'exhale', 'holdOut'];

    const nextPhase = () => {
      const phase = phases[currentPhaseIndex];
      phaseRef.current = phase;
      onPhaseChange(phase);

      const duration = pattern[phase] * 1000 * speedMultiplier;
      let remainingTime = duration;

      timerRef.current = setInterval(() => {
        remainingTime -= 100;
        onTimeUpdate(remainingTime);

        if (remainingTime <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);

          currentPhaseIndex++;
          if (currentPhaseIndex >= phases.length) {
            onCycleComplete();
            currentPhaseIndex = 0;
          }
          nextPhase();
        }
      }, 100);
    };

    nextPhase();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive, preset, trustSpeed]);

  return null;
}