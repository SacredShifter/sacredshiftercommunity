import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Circle, CheckCircle } from 'lucide-react';

interface ResonanceCheckProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result: 'resonance' | 'distortion') => void;
}

export const ResonanceCheck: React.FC<ResonanceCheckProps> = ({ 
  isOpen, 
  onClose, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [result, setResult] = useState<'resonance' | 'distortion' | null>(null);
  const [timer, setTimer] = useState(20);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const steps = [
    {
      title: "Pause & Center",
      subtitle: "20 seconds",
      instruction: "Take a conscious breath. Feel your energy field as a sphere extending about an arm's length around you. Notice this is your sovereign space.",
      action: "breathing",
      duration: 20
    },
    {
      title: "Scan & Sense", 
      subtitle: "20 seconds",
      instruction: "Bring to mind the situation, choice, or relationship you're checking. Place one hand on your heart, one on your belly.",
      questions: [
        "Does your energy field expand or contract?",
        "Where do you feel flow or restriction in your body?", 
        "What's the quality of your breath?"
      ],
      action: "sensing",
      duration: 20
    },
    {
      title: "Honor & Choose",
      subtitle: "20 seconds", 
      instruction: "Thank your body's wisdom and choose from this awareness.",
      interpretation: {
        expansion: "Expansion, flow, and ease signals RESONANCE",
        contraction: "Contraction, restriction, and tension signals DISTORTION"
      },
      action: "choosing",
      duration: 20
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
      handleStepComplete();
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const startStep = () => {
    setIsTimerActive(true);
    setTimer(steps[currentStep].duration);
  };

  const handleStepComplete = () => {
    setIsTimerActive(false);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTimer(20);
    } else {
      // Practice complete
      if (onComplete) {
        onComplete(result || 'resonance');
      }
    }
  };

  const handleResultSelect = (resultType: 'resonance' | 'distortion') => {
    setResult(resultType);
    setTimeout(handleStepComplete, 1000);
  };

  const reset = () => {
    setCurrentStep(0);
    setResponses([]);
    setResult(null);
    setTimer(20);
    setIsTimerActive(false);
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-background/98 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10">
          <CardHeader className="text-center border-b border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                3-Point Resonance Check
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </Button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted/30 rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              A 60-second sovereignty alignment practice
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Step Header */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {currentStepData.title}
                  </h3>
                  <p className="text-sm text-primary font-medium">
                    {currentStepData.subtitle}
                  </p>
                </div>

                {/* Step Content */}
                <div className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed text-center">
                    {currentStepData.instruction}
                  </p>

                  {/* Step-specific content */}
                  {currentStepData.action === 'breathing' && (
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        className="w-20 h-20 border-2 border-primary/40 rounded-full flex items-center justify-center"
                        animate={{
                          scale: [1, 1.2, 1],
                          borderColor: ['hsl(var(--primary) / 0.4)', 'hsl(var(--primary) / 0.8)', 'hsl(var(--primary) / 0.4)']
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Circle className="w-8 h-8 text-primary" />
                      </motion.div>
                      <p className="text-sm text-muted-foreground italic">
                        Breathe naturally and settle into your presence
                      </p>
                    </div>
                  )}

                  {currentStepData.action === 'sensing' && currentStepData.questions && (
                    <div className="space-y-4">
                      <div className="flex justify-center mb-4">
                        <div className="flex space-x-4">
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <Heart className="w-4 h-4 text-primary" />
                          </div>
                          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                            <Circle className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground mb-3">Notice without judgment:</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {currentStepData.questions.map((question, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {currentStepData.action === 'choosing' && currentStepData.interpretation && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                            RESONANCE
                          </p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">
                            {currentStepData.interpretation.expansion}
                          </p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                          <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">
                            DISTORTION
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-400">
                            {currentStepData.interpretation.contraction}
                          </p>
                        </div>
                      </div>

                      {!result && (
                        <div className="text-center space-y-4">
                          <p className="text-sm text-muted-foreground">
                            What did your body tell you?
                          </p>
                          <div className="flex justify-center space-x-4">
                            <Button
                              onClick={() => handleResultSelect('resonance')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              Resonance
                            </Button>
                            <Button
                              onClick={() => handleResultSelect('distortion')}
                              className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                              Distortion
                            </Button>
                          </div>
                        </div>
                      )}

                      {result && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center space-y-3"
                        >
                          <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                          <p className="text-sm font-medium text-foreground">
                            Thank you for honoring your body's wisdom
                          </p>
                          <p className="text-xs text-muted-foreground">
                            You detected {result}. Trust this knowing and choose from this awareness.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Timer and Action */}
                  <div className="flex flex-col items-center space-y-4">
                    {!isTimerActive && currentStep < steps.length - 1 && !result && (
                      <Button onClick={startStep} className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30">
                        Begin {currentStepData.title}
                      </Button>
                    )}

                    {isTimerActive && (
                      <div className="text-center space-y-2">
                        <div className="text-2xl font-mono text-primary font-bold">
                          {timer}s
                        </div>
                        <motion.div
                          className="w-24 h-1 bg-muted rounded-full overflow-hidden"
                        >
                          <motion.div
                            className="h-full bg-primary"
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: currentStepData.duration, ease: "linear" }}
                          />
                        </motion.div>
                      </div>
                    )}

                    {currentStep === steps.length - 1 && result && (
                      <div className="flex space-x-4">
                        <Button onClick={reset} variant="outline">
                          Practice Again
                        </Button>
                        <Button onClick={onClose} className="bg-primary text-primary-foreground">
                          Complete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};