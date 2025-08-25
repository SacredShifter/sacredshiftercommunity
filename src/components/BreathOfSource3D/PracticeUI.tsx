import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CircularTimer from './CircularTimer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  Wind,
  Heart,
  Brain,
  Crown,
  Eye,
  Sparkles,
  Waves
} from 'lucide-react';

export type BreathPhase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'idle';

const phaseData = {
  inhale: { label: 'Inhale Life', color: 'text-orange-400' },
  holdIn: { label: 'Receive', color: 'text-yellow-400' },
  exhale: { label: 'Exhale Death', color: 'text-blue-400' },
  holdOut: { label: 'Surrender', color: 'text-indigo-400' },
  idle: { label: 'Prepare to Begin', color: 'text-muted-foreground' }
};

const lessonContent = {
    0: { title: 'Orientation', icon: <Crown className="h-4 w-4" />, concepts: ['Trust speed', 'Comfort and consent'], practices: ['Choose learning pace'] },
    1: { title: 'The Rhythm', icon: <Wind className="h-4 w-4" />, concepts: ['Diaphragm mechanics', 'Nasal breathing'], practices: ['Practice 4-4-4-4'] },
    2: { title: 'Liberation Breath', icon: <Heart className="h-4 w-4" />, concepts: ['Life-Death labels', 'Sovereignty anchors'], practices: ['Practice 4-1-6-1'] },
    3: { title: 'Sovereignty Cycle', icon: <Crown className="h-4 w-4" />, concepts: ['Extended holds', 'Wheel vs Exit'], practices: ['Practice 5-5-8-5'] },
    4: { title: 'Facing The Wheel', icon: <Eye className="h-4 w-4" />, concepts: ['Recycling visualization', 'Conscious choice'], practices: ['Visualize cycle'] },
    5: { title: 'Integration', icon: <Sparkles className="h-4 w-4" />, concepts: ['Micro-rituals', 'Sharing wisdom'], practices: ['Design ritual'] },
    6: { title: 'Biofeedback', icon: <Waves className="h-4 w-4" />, concepts: ['HRV coherence', 'Audio-visual entrainment'], practices: ['Monitor coherence'] },
    7: { title: 'Mastery', icon: <Crown className="h-4 w-4" />, concepts: ['Teaching safely', 'Collective wisdom'], practices: ['Final assessment'] },
};

const requiredCycles = { 1: 5, 2: 8, 3: 10, 6: 5 };


interface PracticeUIProps {
  currentLesson: number;
  isLessonComplete: boolean;
  onNextLesson: () => void;
  onPrevLesson: () => void;
  onStartPractice: () => void;
  onCompleteLesson: () => void;

  // Data for the unified view
  cycleCount: number;
  isBreathingActive: boolean;
  currentPhase: BreathPhase;
  remainingTime: number;
  duration: number; // Add duration to calculate progress
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  breathPreset: 'basic' | 'liberation' | 'sovereignty';
}

export const PracticeUI: React.FC<PracticeUIProps> = ({
  currentLesson,
  isLessonComplete,
  onNextLesson,
  onPrevLesson,
  onStartPractice,
  onCompleteLesson,
  cycleCount,
  isBreathingActive,
  currentPhase,
  remainingTime,
  duration,
  trustSpeed,
  breathPreset
}) => {
  const lesson = lessonContent[currentLesson as keyof typeof lessonContent];
  const targetCycles = requiredCycles[currentLesson as keyof typeof requiredCycles] || 0;
  const cycleProgress = targetCycles > 0 ? Math.min((cycleCount / targetCycles) * 100, 100) : (isLessonComplete ? 100 : 0);
  const phaseInfo = phaseData[isBreathingActive ? currentPhase : 'idle'];
  const timerProgress = duration > 0 ? ((duration - remainingTime) / duration) * 100 : 0;

  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4 pointer-events-none">
      <motion.div
        key={currentLesson}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="w-full max-w-sm mx-auto pointer-events-auto"
      >
        <Card className="bg-background/80 backdrop-blur-xl border-primary/10 shadow-2xl shadow-primary/10">
          <CardHeader className="text-center p-4">
            <div className="flex items-center justify-center space-x-2">
                {lesson.icon}
                <CardTitle className="font-sacred text-xl text-primary">
                    L{currentLesson}: {lesson.title}
                </CardTitle>
            </div>
            <CardDescription className="text-xs">{breathPreset} - {trustSpeed}</CardDescription>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            {/* Countdown and Phase Display */}
            <div className="relative flex items-center justify-center my-4 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <CircularTimer progress={timerProgress} color={phaseInfo.color} />
              </div>
              <div className="text-center">
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={phaseInfo.label}
                    className={`text-2xl font-bold font-sacred ${phaseInfo.color}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {phaseInfo.label}
                  </motion.h2>
                </AnimatePresence>
                <p className="text-5xl font-mono text-foreground mt-1">
                  {isBreathingActive ? remainingTime.toFixed(1) : '...'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {targetCycles > 0 && (
                <div className="w-full px-4 mb-4">
                    <Progress value={cycleProgress} className="h-2 bg-primary/20" />
                    <div className="text-xs text-muted-foreground text-right mt-1">
                        {cycleCount} / {targetCycles} cycles
                    </div>
                </div>
            )}

            {/* Lesson Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-sm">Lesson Details</AccordionTrigger>
                <AccordionContent className="space-y-3 text-xs px-1">
                  <div>
                    <h4 className="font-bold flex items-center"><Brain className="h-3 w-3 mr-1"/>Concepts</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {lesson.concepts.map(c => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center"><Heart className="h-3 w-3 mr-1"/>Practice</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {lesson.practices.map(p => <li key={p}>{p}</li>)}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button variant="outline" size="icon" onClick={onPrevLesson} disabled={currentLesson === 0}>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {!isLessonComplete ? (
                <Button onClick={onStartPractice} className="sacred-button px-6 text-sm">
                  <Play className="h-4 w-4 mr-2" />
                  {isBreathingActive ? 'Pause' : 'Start Practice'}
                </Button>
              ) : (
                <Button onClick={onCompleteLesson} className="sacred-button px-6 text-sm bg-green-500 hover:bg-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              )}

              <Button variant="outline" size="icon" onClick={onNextLesson} disabled={!isLessonComplete}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
