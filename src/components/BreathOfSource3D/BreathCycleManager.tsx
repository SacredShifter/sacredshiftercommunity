import React, { useRef, useEffect } from 'react';

export type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface BreathCycleManagerProps {
  isActive: boolean;
  preset: 'liberation' | 'sovereignty' | 'basic';
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  onPhaseChange: (phase: BreathPhase) => void;
  onCycleComplete: () => void;
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
  onCycleComplete
}: BreathCycleManagerProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<BreathPhase>('inhale');
  const cycleStartRef = useRef<number>(0);

  const speedMultipliers = {
    gentle: 1.5,
    balanced: 1.0,
    bold: 0.7
  };

  const speedMultiplier = speedMultipliers[trustSpeed];
  const pattern = breathPresets[preset];

  useEffect(() => {
    // Clear any existing timer first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isActive) {
      return;
    }

    // Reset phase to inhale when starting
    phaseRef.current = 'inhale';

    const runBreathCycle = () => {
      const phases: BreathPhase[] = ['inhale', 'holdIn', 'exhale', 'holdOut'];
      let currentPhaseIndex = 0;
      
      const nextPhase = () => {
        // Double check if still active
        if (!isActive) {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          return;
        }
        
        const phase = phases[currentPhaseIndex];
        phaseRef.current = phase;
        onPhaseChange(phase);
        
        const duration = pattern[phase] * 1000 * speedMultiplier;
        console.log(`Starting ${phase} for ${duration}ms`);
        
        timerRef.current = setTimeout(() => {
          currentPhaseIndex++;
          
          if (currentPhaseIndex >= phases.length) {
            // Cycle complete
            onCycleComplete();
            currentPhaseIndex = 0;
          }
          nextPhase(); // Continue to next phase
        }, duration);
      };
      
      nextPhase(); // Start the cycle
    };

    runBreathCycle();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]); // Remove dependencies that cause re-renders

  // Handle preset/speed changes without restarting the entire cycle
  useEffect(() => {
    // Only log the change, don't restart the cycle
    if (isActive) {
      console.log(`Breath settings updated: ${preset} at ${trustSpeed} speed`);
    }
  }, [preset, trustSpeed]);

  // This component doesn't render anything visible
  return null;
}