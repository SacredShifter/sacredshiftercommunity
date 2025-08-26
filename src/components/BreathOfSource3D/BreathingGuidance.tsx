import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wind, Clock, Circle } from 'lucide-react';

export type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface BreathingGuidanceProps {
  currentPhase: BreathPhase;
  isActive: boolean;
  preset: 'basic' | 'liberation' | 'sovereignty';
  cycleCount: number;
  targetCycles: number;
  timeRemaining: number;
}

const phaseData = {
  inhale: {
    label: 'Inhale',
    description: 'Life - The chosen experience',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
    icon: <Wind className="h-6 w-6" />
  },
  holdIn: {
    label: 'Hold',
    description: 'Receive - Let it settle',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
    icon: <Circle className="h-6 w-6" />
  },
  exhale: {
    label: 'Exhale',
    description: 'Death - Return to Source',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    icon: <Wind className="h-6 w-6 rotate-180" />
  },
  holdOut: {
    label: 'Hold',
    description: 'Surrender - Complete release',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/30',
    icon: <Circle className="h-6 w-6" />
  }
};

const presetLabels = {
  basic: 'Basic Rhythm (4-4-4-4)',
  liberation: 'Liberation Breath (4-1-6-1)',
  sovereignty: 'Sovereignty Cycle (5-5-8-5)'
};

export default function BreathingGuidance({
  currentPhase,
  isActive,
  preset,
  cycleCount,
  targetCycles,
  timeRemaining,
}: BreathingGuidanceProps) {
  const phase = phaseData[currentPhase];
  const progress = targetCycles > 0 ? Math.min((cycleCount / targetCycles) * 100, 100) : 0;

  if (!isActive) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 w-96 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="font-sacred text-7xl font-light text-white/80 mb-2">
            {(timeRemaining / 1000).toFixed(1)}s
          </div>
          <Card
            className={`
            ${phase.bgColor} ${phase.borderColor} border backdrop-blur-md
            shadow-lg w-full inline-block
          `}
          >
            <CardContent className="p-4 space-y-2">
              {/* Compact header */}
              <div className="flex items-center space-x-3">
                <div className={`${phase.color} flex-shrink-0`}>
                  {phase.icon}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h3 className={`text-xl font-sacred ${phase.color} leading-tight`}>
                    {phase.label}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-tight truncate">
                    {phase.description}
                  </p>
                </div>
              </div>

              {/* Compact progress */}
              <div className="space-y-1">{/* Reduced spacing */}
                <div className="flex items-center justify-between text-xs">
                  <span>{presetLabels[preset]}</span>
                  <span className="font-mono">
                    {cycleCount}/{targetCycles}
                  </span>
                </div>

                {targetCycles > 0 && (
                  <div className="w-full h-1 bg-background/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}