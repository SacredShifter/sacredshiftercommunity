import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind,
  Heart,
  Brain,
  Shield,
  Eye,
  Sparkles,
  Waves,
  Crown,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  Clock
} from 'lucide-react';
import { BreathPhase } from './BreathCycleManager';
import CircularTimer from './CircularTimer'; // We will use this later

interface UnifiedPracticeUIProps {
  currentLesson: number;
  lessonTitle: string;
  lessonDescription: string;
  isLessonComplete: boolean;
  cycleCount: number;
  targetCycles: number;
  currentPhase: BreathPhase;
  phaseTime: number;
  phaseDuration: number;
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  preset: 'basic' | 'liberation' | 'sovereignty';
  onStartLesson: () => void;
  onCompleteLesson: () => void;
  onNextLesson: () => void;
  onPrevLesson: () => void;
}

const lessonContent = {
    0: {
      title: 'Orientation - Trust Speed Selection',
      icon: <Crown className="h-5 w-5" />,
      concepts: [
        'Trust speed vs information speed',
        'Comfort and consent in practice',
        'Your nervous system as guide'
      ],
      practices: [
        'Choose your learning pace',
        'Set comfort boundaries',
        'Understand sovereignty in breath'
      ],
      wisdom: '"At the speed of trust" means honoring your body\'s wisdom over external pressure.'
    },
    1: {
      title: 'Mechanics of the Rhythm',
      icon: <Wind className="h-5 w-5" />,
      concepts: [
        'Diaphragm and rib expansion',
        'Nasal vs mouth breathing',
        'Breath rate and depth awareness'
      ],
      practices: [
        'Feel the diaphragm move',
        'Notice chest vs belly breathing',
        'Practice 4-4-4-4 basic rhythm'
      ],
      wisdom: 'The breath is the bridge between the conscious and unconscious mind.'
    },
    2: {
      title: 'Liberation Breath',
      icon: <Heart className="h-5 w-5" />,
      concepts: [
        'Life-Death rhythm labels',
        'Sovereignty anchors',
        'Conscious choice in each breath'
      ],
      practices: [
        'Practice 4-1-6-1 Liberation pattern',
        'Label: Inhale (Life), Exhale (Death)',
        'Install sovereignty anchors'
      ],
      wisdom: 'When fear of the exhale dissolves, fear of living dissolves with it.'
    },
    3: {
      title: 'Sovereignty Cycle',
      icon: <Crown className="h-5 w-5" />,
      concepts: [
        'Extended holds for presence',
        'Letting go without collapse',
        'Wheel vs Exit metaphor'
      ],
      practices: [
        'Practice 5-5-8-5 Sovereignty pattern',
        'Hold without forcing',
        'Notice choice points in the wheel'
      ],
      wisdom: 'True surrender is not collapse - it is conscious choice to release.'
    },
    4: {
      title: 'Facing The Wheel',
      icon: <Eye className="h-5 w-5" />,
      concepts: [
        'The recycling wheel visualization',
        'Conscious participation vs unconscious repetition',
        'Sovereignty through choice'
      ],
      practices: [
        'Visualize the habitual cycle',
        'Find the exit points',
        'Practice choosing vs reacting'
      ],
      wisdom: 'The wheel only controls you when you forget you can step off.'
    },
    5: {
      title: 'Integration and Choice',
      icon: <Sparkles className="h-5 w-5" />,
      concepts: [
        'Daily micro-ritual installation',
        'Sharing wisdom responsibly',
        'Opening the Gate of Liberation'
      ],
      practices: [
        'Design your daily breath ritual',
        'Complete sovereignty assessment',
        'Prepare for advanced teachings'
      ],
      wisdom: 'Integration is where practice becomes transformation.'
    },
    6: {
      title: 'Visual & Audio Biofeedback',
      icon: <Waves className="h-5 w-5" />,
      concepts: [
        'HRV and coherence feedback',
        'Audio-visual entrainment',
        'Biofeedback interpretation'
      ],
      practices: [
        'Use breath orb for pacing',
        'Follow audio phase cues',
        'Monitor coherence states'
      ],
      wisdom: 'Technology serves awareness, not the other way around.'
    },
    7: {
      title: 'Mastery Integration',
      icon: <Crown className="h-5 w-5" />,
      concepts: [
        'Teaching others safely',
        'Advanced practice variations',
        'Collective wisdom sharing'
      ],
      practices: [
        'Final mastery assessment',
        'Share in Collective Codex',
        'Guide others with sovereignty'
      ],
      wisdom: 'True mastery is the ability to help others find their own path.'
    }
  };

const phaseData = {
    inhale: { label: 'Inhale Life', color: 'text-orange-400', progressColor: 'bg-orange-400' },
    holdIn: { label: 'Hold & Receive', color: 'text-yellow-400', progressColor: 'bg-yellow-400' },
    exhale: { label: 'Exhale Death', color: 'text-blue-400', progressColor: 'bg-blue-400' },
    holdOut: { label: 'Hold & Surrender', color: 'text-indigo-400', progressColor: 'bg-indigo-400' },
};

const presetLabels = {
    basic: 'Basic Rhythm (4-4-4-4)',
    liberation: 'Liberation Breath (4-1-6-1)',
    sovereignty: 'Sovereignty Cycle (5-5-8-5)'
};

export default function UnifiedPracticeUI({
    currentLesson,
    isLessonComplete,
    cycleCount,
    targetCycles,
    currentPhase,
    phaseTime,
    phaseDuration,
    trustSpeed,
    preset,
    onStartLesson,
    onCompleteLesson,
    onNextLesson,
    onPrevLesson,
}: UnifiedPracticeUIProps) {
  const lesson = lessonContent[currentLesson as keyof typeof lessonContent];
  const phaseInfo = phaseData[currentPhase];
  const progress = targetCycles > 0 ? Math.min((cycleCount / targetCycles) * 100, 100) : 0;
  const canComplete = targetCycles === 0 || cycleCount >= targetCycles;
  const countdown = Math.ceil(phaseDuration - phaseTime);
  const timerProgress = (phaseTime / phaseDuration) * 100;

  if (!lesson) return null;

  return (
    <div className="absolute top-4 left-4 w-96 z-20 pointer-events-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLesson}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Card className="bg-background/80 backdrop-blur-md border-primary/20">
            <CardHeader className="p-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">{lesson.icon}</div>
                    <div>
                        <Badge variant="outline" className="text-xs">Lesson {currentLesson}</Badge>
                        <h3 className="font-sacred text-lg font-medium text-foreground mt-1">{lesson.title}</h3>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Practice Section */}
              <div className="p-4 rounded-lg bg-primary/5 space-y-3">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className={`font-sacred text-2xl ${phaseInfo.color}`}>{phaseInfo.label}</h4>
                        <p className="text-sm text-muted-foreground">{presetLabels[preset]}</p>
                    </div>
                    <div className="relative w-24 h-24">
                        <CircularTimer progress={100 - timerProgress} color={phaseInfo.color} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`font-mono text-4xl ${phaseInfo.color}`}>{countdown}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Cycle Progress</span>
                        <span>{cycleCount} / {targetCycles}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
              </div>

              {/* Key Concepts */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-primary flex items-center space-x-1"><Brain className="h-4 w-4" /><span>Key Concepts</span></h4>
                <ul className="space-y-1 pl-2">
                  {lesson.concepts.map((concept, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start space-x-2">
                      <span className="text-primary mt-1">•</span><span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practices */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-secondary flex items-center space-x-1"><Heart className="h-4 w-4" /><span>Practices</span></h4>
                <ul className="space-y-1 pl-2">
                  {lesson.practices.map((practice, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start space-x-2">
                      <span className="text-secondary mt-1">→</span><span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Wisdom Quote */}
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <p className="text-sm italic text-foreground leading-relaxed">{lesson.wisdom}</p>
              </div>
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={onPrevLesson} disabled={currentLesson === 0}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>

                {!isLessonComplete ? (
                    <Button onClick={onStartLesson} size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        {currentLesson === 0 ? 'Begin' : 'Practice'}
                    </Button>
                ) : (
                    <Button onClick={canComplete ? onCompleteLesson : undefined} disabled={!canComplete} size="sm" className="sacred-button">
                        <CheckCircle className="h-4 w-4 mr-1" /> Complete
                    </Button>
                )}

                <Button variant="outline" size="sm" onClick={onNextLesson} disabled={currentLesson >= 7 || !isLessonComplete}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
