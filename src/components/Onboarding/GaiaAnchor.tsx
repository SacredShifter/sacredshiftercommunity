import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Leaf, Heart, Sun } from 'lucide-react';

interface GaiaAnchorProps {
  onNext: () => void;
}

export const GaiaAnchor: React.FC<GaiaAnchorProps> = ({ onNext }) => {
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const breathingTimer = setInterval(() => {
      setBreathingPhase(current => {
        if (current === 'inhale') {
          return 'hold';
        } else if (current === 'hold') {
          return 'exhale';
        } else {
          setCycleCount(prev => prev + 1);
          return 'inhale';
        }
      });
    }, 3000); // 3 seconds per phase

    return () => clearInterval(breathingTimer);
  }, [isComplete]);

  useEffect(() => {
    if (cycleCount >= 3) {
      setIsComplete(true);
    }
  }, [cycleCount]);

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe in... receive Gaia\'s life force';
      case 'hold':
        return 'Hold... feel the connection';
      case 'exhale':
        return 'Breathe out... send gratitude to Earth';
      default:
        return '';
    }
  };

  const getCircleScale = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 1.2;
      case 'hold':
        return 1.2;
      case 'exhale':
        return 0.8;
      default:
        return 1;
    }
  };

  return (
    <div className="p-8 space-y-8 flex flex-col items-center justify-center min-h-[600px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Ground with Gaia
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Before we continue, let's anchor your energy to Earth. 
          Gaia is our living foundation—the source that holds us while we transform.
        </p>
      </motion.div>

      {/* Earth Visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative"
      >
        {/* Earth Background */}
        <div className="relative w-48 h-48">
          {/* Pulsing Earth */}
          <motion.div
            animate={{ scale: getCircleScale() }}
            transition={{ duration: 3, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-green-600/40 rounded-full flex items-center justify-center"
          >
            {/* Inner Earth */}
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-600/40 to-green-700/50 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-700/60 to-green-800/70 rounded-full" />
            </div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Leaf className="absolute top-4 left-8 h-4 w-4 text-green-500" />
            <Heart className="absolute top-8 right-4 h-4 w-4 text-emerald-400" />
            <Sun className="absolute bottom-8 left-4 h-4 w-4 text-yellow-500" />
          </motion.div>

          {/* Energy Waves */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 border-2 border-emerald-400/30 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute inset-0 border-2 border-green-400/20 rounded-full"
          />
        </div>
      </motion.div>

      {/* Breathing Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center space-y-4"
      >
        <p className="text-xl font-medium text-foreground">
          {getBreathingInstruction()}
        </p>
        
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((cycle) => (
            <div
              key={cycle}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                cycle <= cycleCount ? 'bg-emerald-500' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {!isComplete && (
          <p className="text-sm text-muted-foreground">
            Cycle {cycleCount + 1} of 3
          </p>
        )}
      </motion.div>

      {/* Completion Message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6"
        >
          <p className="text-lg text-emerald-600 font-medium">
            ✨ Beautiful. You're now anchored to Gaia's heartbeat.
          </p>
          
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-lg p-6 max-w-lg">
            <p className="text-sm text-muted-foreground italic">
              "Step outside barefoot later today and feel this connection in your body. 
              Let Earth remind you that you're held, supported, and deeply loved."
            </p>
          </div>

          <Button
            onClick={onNext}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium px-8"
          >
            Carry This Grounding Forward
          </Button>
        </motion.div>
      )}

      {/* Skip Option for those who prefer to move ahead */}
      {!isComplete && cycleCount < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 8, duration: 0.5 }}
        >
          <Button
            onClick={onNext}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Continue without grounding exercise
          </Button>
        </motion.div>
      )}
    </div>
  );
};