import { useState, useEffect, useCallback } from 'react';
import { useMachine } from '@xstate/react';
import { breathOfSourceMachine, BreathOfSourceContext } from '@/modules/breathOfSource/machine';
import { useBreathingTool } from '@/hooks/useBreathingTool';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BreathOfSourceModuleHook {
  // State machine
  state: any;
  send: any;
  context: BreathOfSourceContext;
  
  // Current lesson info
  currentLesson: number;
  lessonTitle: string;
  lessonDescription: string;
  isLessonComplete: boolean;
  
  // Breathing integration
  isBreathing: boolean;
  currentPhase: string;
  breathingPresets: Record<string, any>;
  
  // Actions
  startLesson: () => void;
  completeLesson: () => void;
  nextLesson: () => void;
  prevLesson: () => void;
  setTrustSpeed: (speed: 'gentle' | 'balanced' | 'bold') => void;
  submitReflection: (reflection: Partial<BreathOfSourceContext['reflections']>) => void;
  
  // Sovereignty anchors
  showSovereigntyAnchor: () => void;
  
  // Data persistence
  saveSession: () => Promise<void>;
  loadPreviousSession: () => Promise<void>;
}

const lessonData = {
  0: {
    title: 'Orientation - Trust Speed Selection',
    description: 'Welcome to sovereignty through breath. Choose your learning pace and establish comfort.',
    requiredCycles: 0,
  },
  1: {
    title: 'Mechanics of the Rhythm',
    description: 'Learn the life-death breath labels. Inhale Life, Exhale Death, with sacred holds.',
    requiredCycles: 5,
  },
  2: {
    title: 'Liberation Breath',
    description: 'Practice 4-1-6-1 preset with sovereignty anchors and conscious reflection.',
    requiredCycles: 8,
  },
  3: {
    title: 'Sovereignty Cycle',
    description: 'Extended 5-5-8-5 holds. Practice letting go without collapse.',
    requiredCycles: 10,
  },
  4: {
    title: 'Facing The Wheel',
    description: 'Visualize the recycling wheel. Choose conscious participation or sovereignty step.',
    requiredCycles: 0,
  },
  5: {
    title: 'Integration and Choice',
    description: 'Install daily ritual. Share wisdom. Unlock Gate of Liberation.',
    requiredCycles: 0,
  },
};

export function useBreathOfSourceModule(): BreathOfSourceModuleHook {
  const [state, send] = useMachine(breathOfSourceMachine);
  const { 
    isActive: isBreathing, 
    currentPhase, 
    startBreathing, 
    stopBreathing,
    presets: breathingPresets 
  } = useBreathingTool();
  
  const [showSovereigntyPrompt, setShowSovereigntyPrompt] = useState(false);

  const context = state.context as BreathOfSourceContext;
  const currentLesson = context.currentLesson;
  const lessonInfo = lessonData[currentLesson as keyof typeof lessonData];

  // Check if current lesson is complete
  const isLessonComplete = context.completedLessons.includes(currentLesson);

  // Breathing cycle tracking
  useEffect(() => {
    if (isBreathing && currentPhase === 'exhale') {
      send({ type: 'BREATH_CYCLE' });
    }
  }, [isBreathing, currentPhase, send]);

  // Trust speed effects on breathing
  useEffect(() => {
    const speedMultipliers = {
      gentle: 1.5,
      balanced: 1.0,
      bold: 0.7,
    };
    
    // Apply trust speed to breathing animations
    const multiplier = speedMultipliers[context.trustSpeed];
    // This would integrate with breathing tool to adjust timing
  }, [context.trustSpeed]);

  const startLesson = useCallback(() => {
    if (currentLesson === 0) {
      send({ type: 'START' });
    } else {
      // Start breathing for lessons with breath work
      if ([1, 2, 3].includes(currentLesson)) {
        const presets = {
          1: 'basic', // 4-4-4-4
          2: 'liberation', // 4-1-6-1
          3: 'sovereignty', // 5-5-8-5
        };
        
        const preset = presets[currentLesson as keyof typeof presets];
        send({ type: 'SET_PRESET', preset });
        startBreathing();
      }
    }
  }, [currentLesson, send, startBreathing]);

  const completeLesson = useCallback(() => {
    stopBreathing();
    send({ type: 'COMPLETE_LESSON' });
    
    toast.success(`Lesson ${currentLesson} Complete`, {
      description: lessonInfo.title,
    });
  }, [currentLesson, lessonInfo.title, send, stopBreathing]);

  const nextLesson = useCallback(() => {
    send({ type: 'NEXT' });
  }, [send]);

  const prevLesson = useCallback(() => {
    send({ type: 'BACK' });
  }, [send]);

  const setTrustSpeed = useCallback((speed: 'gentle' | 'balanced' | 'bold') => {
    send({ type: 'SET_TRUST_SPEED', speed });
  }, [send]);

  const submitReflection = useCallback((reflection: Partial<BreathOfSourceContext['reflections']>) => {
    send({ type: 'SUBMIT_REFLECTION', reflection });
  }, [send]);

  const showSovereigntyAnchor = useCallback(() => {
    if (context.sovereigntyAnchors) {
      setShowSovereigntyPrompt(true);
      send({ type: 'SOVEREIGNTY_ANCHOR' });
      
      // Auto-hide after trust speed duration
      const durations = { gentle: 8000, balanced: 5000, bold: 3000 };
      setTimeout(() => {
        setShowSovereigntyPrompt(false);
      }, durations[context.trustSpeed]);
    }
  }, [context.sovereigntyAnchors, context.trustSpeed, send]);

  // Data persistence - simplified for now
  const saveSession = useCallback(async () => {
    try {
      console.log('Session saved:', context);
    } catch (error) {
      console.error('Error saving breath session:', error);
    }
  }, [context]);

  const loadPreviousSession = useCallback(async () => {
    try {
      console.log('Loading previous session...');
    } catch (error) {
      console.error('Error loading previous session:', error);
    }
  }, []);

  // Auto-save on significant state changes
  useEffect(() => {
    if (context.sessionId && isLessonComplete) {
      saveSession();
    }
  }, [isLessonComplete, saveSession, context.sessionId]);

  return {
    // State machine
    state,
    send,
    context,
    
    // Current lesson info
    currentLesson,
    lessonTitle: lessonInfo.title,
    lessonDescription: lessonInfo.description,
    isLessonComplete,
    
    // Breathing integration
    isBreathing,
    currentPhase,
    breathingPresets,
    
    // Actions
    startLesson,
    completeLesson,
    nextLesson,
    prevLesson,
    setTrustSpeed,
    submitReflection,
    
    // Sovereignty anchors
    showSovereigntyAnchor,
    
    // Data persistence
    saveSession,
    loadPreviousSession,
  };
}