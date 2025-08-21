import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { WelcomeGateway } from './WelcomeGateway';
import { PathSelection } from './PathSelection';
import { ToolsIntroduction } from './ToolsIntroduction';
import { GaiaAnchor } from './GaiaAnchor';
import { SovereigntyReminder } from './SovereigntyReminder';
import { AuraIntroduction } from './AuraIntroduction';
import { FirstStepInvitation } from './FirstStepInvitation';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export type UserPath = 'healing' | 'awakening' | 'explorer' | 'remembering';

interface OnboardingFlowProps {
  isVisible: boolean;
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isVisible, onComplete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPath, setSelectedPath] = useState<UserPath | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const steps = [
    'welcome',
    'path-selection', 
    'tools-introduction',
    'gaia-anchor',
    'sovereignty',
    'aura-introduction',
    'first-step'
  ];

  const handleNext = useCallback(() => {
    console.log('handleNext called, currentStep:', currentStep, 'steps.length:', steps.length);
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        console.log('Moving to next step:', currentStep + 1);
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      console.log('Completing onboarding');
      handleComplete();
    }
  }, [currentStep, steps.length]);

  const handleComplete = useCallback(async () => {
    try {
      // Mark onboarding as completed in database
      if (user) {
        await supabase
          .from('profiles')
          .upsert({ 
            id: user.id,
            display_name: user.email?.split('@')[0] || 'Sacred Seeker',
            onboarding_completed: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        // Store path selection locally for other components
        localStorage.setItem(`sacred-path-${user.id}`, selectedPath || 'explorer');
      }
      
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      onComplete(); // Complete anyway to avoid blocking user
    }
  }, [user, selectedPath, onComplete]);

  const handlePathSelect = useCallback((path: UserPath) => {
    setSelectedPath(path);
    handleNext();
  }, [handleNext]);

  const renderCurrentStep = () => {
    const stepProps = {
      onNext: handleNext,
      onComplete: handleComplete,
      isTransitioning
    };

    switch (steps[currentStep]) {
      case 'welcome':
        return <WelcomeGateway {...stepProps} />;
      case 'path-selection':
        return <PathSelection onPathSelect={handlePathSelect} {...stepProps} />;
      case 'tools-introduction':
        return <ToolsIntroduction selectedPath={selectedPath} {...stepProps} />;
      case 'gaia-anchor':
        return <GaiaAnchor {...stepProps} />;
      case 'sovereignty':
        return <SovereigntyReminder {...stepProps} />;
      case 'aura-introduction':
        return <AuraIntroduction {...stepProps} />;
      case 'first-step':
        return <FirstStepInvitation selectedPath={selectedPath} {...stepProps} />;
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-5xl max-h-[95vh] flex flex-col"
      >
        <Card className="bg-background/98 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10 flex-1 flex flex-col overflow-hidden">
          <CardContent className="p-0 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-4 flex justify-center">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-primary shadow-md shadow-primary/50' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};