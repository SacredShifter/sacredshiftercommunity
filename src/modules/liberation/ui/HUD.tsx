import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Pause, Play, Settings, ArrowLeft } from 'lucide-react';
import { useLiberationState } from '../context/LiberationContext';
import { cn } from '@/lib/utils';
import { useBreathCoach } from '../hooks/useBreathCoach';
import { BreathRing } from './BreathRing';

export const HUD: React.FC = () => {
  const { state, send } = useLiberationState();
  const currentScene = state.context.currentScene;
  const isPaused = state.matches('paused');

  const { isActive, currentPhase, progress, start, stop } = useBreathCoach();

  useEffect(() => {
    if (currentScene === 'expansion' && !isPaused) {
      start();
    } else {
      stop();
    }
  }, [currentScene, isPaused, start, stop]);

  const handlePause = () => {
    send({ type: isPaused ? 'RESUME' : 'PAUSE' });
  };

  const handleBack = () => {
    send({ type: 'BACK' });
  };

  const handleNext = () => {
    send({ type: 'NEXT' });
  };

  const getSceneTitle = (scene: string) => {
    const titles = {
      intro: 'Welcome',
      fear: 'Hall of Fear',
      crossing: 'The Crossing',
      expansion: 'Expansion',
      integration: 'Integration',
    };
    return titles[scene as keyof typeof titles] || scene;
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Breath Ring */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <BreathRing phase={currentPhase} progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="text-center">
          <h2 className="text-lg font-medium text-white/90">
            {getSceneTitle(currentScene)}
          </h2>
          <div className="w-32 h-1 bg-white/20 rounded-full mt-2">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${getProgressPercent(currentScene)}%`
              }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePause}
            className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10"
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bottom prompts */}
      <AnimatePresence>
        {currentScene !== 'intro' && !isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          >
            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <p className="text-white/90 text-sm text-center max-w-md">
                {getScenePrompt(currentScene)}
              </p>
              
              {currentScene !== 'integration' && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={handleNext}
                    className="bg-primary/80 hover:bg-primary text-white"
                    size="sm"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center pointer-events-auto"
          >
            <div className="text-center text-white">
              <h3 className="text-xl font-medium mb-4">Session Paused</h3>
              <p className="text-white/70 mb-6 max-w-md">
                Take as much time as you need. You are safe here.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => send({ type: 'RESUME' })}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Resume
                </Button>
                <Button
                  onClick={() => send({ type: 'ABORT' })}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Exit Session
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getProgressPercent(scene: string): number {
  const progress = {
    intro: 0,
    fear: 25,
    crossing: 50,
    expansion: 75,
    integration: 100,
  };
  return progress[scene as keyof typeof progress] || 0;
}

function getScenePrompt(scene: string): string {
  const prompts = {
    fear: "Notice your breath. Fear is a lens. You are the witness.",
    crossing: "Step. What you are cannot end.",
    expansion: "Without fear of death, there is no fear of life. Explore.",
    integration: "Exhale is the little death. Inhale is renewal. The rhythm is one.",
  };
  return prompts[scene as keyof typeof prompts] || "";
}