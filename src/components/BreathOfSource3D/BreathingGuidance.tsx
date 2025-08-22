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
  targetCycles
}: BreathingGuidanceProps) {
  const phase = phaseData[currentPhase];
  const progress = targetCycles > 0 ? Math.min((cycleCount / targetCycles) * 100, 100) : 0;

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: 0.3 
          }}
          className="text-center"
        >
          <Card className={`
            ${phase.bgColor} ${phase.borderColor} border-2 backdrop-blur-lg
            shadow-2xl transform transition-all duration-300
          `}>
            <CardContent className="p-8 space-y-4">
              {/* Phase Icon */}
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className={`flex justify-center ${phase.color}`}
              >
                <div className="p-3 rounded-full bg-background/20">
                  {phase.icon}
                </div>
              </motion.div>

              {/* Phase Label */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <h2 className={`text-3xl font-sacred ${phase.color}`}>
                  {phase.label}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {phase.description}
                </p>
              </motion.div>

              {/* Breathing Pattern Info */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <div className="text-sm text-muted-foreground">
                  {presetLabels[preset]}
                </div>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>Cycles</span>
                    </span>
                    <span className="font-mono">
                      {cycleCount} / {targetCycles}
                    </span>
                  </div>
                  
                  {targetCycles > 0 && (
                    <div className="w-48 h-2 bg-background/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Sacred Geometry Accent */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className={`w-16 h-16 mx-auto border border-current opacity-30 ${phase.color}`}
                style={{ 
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}