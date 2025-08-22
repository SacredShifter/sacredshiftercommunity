import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind, 
  Heart, 
  Brain, 
  Shield, 
  Eye,
  Sparkles,
  Waves,
  Crown
} from 'lucide-react';

interface LessonContentProps {
  currentLesson: number;
  trustSpeed: 'gentle' | 'balanced' | 'bold';
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

export default function LessonContent({ 
  currentLesson, 
  trustSpeed 
}: LessonContentProps) {
  const lesson = lessonContent[currentLesson as keyof typeof lessonContent];
  
  if (!lesson) return null;

  const speedConfig = {
    gentle: { 
      duration: 0.8, 
      delay: 0.3,
      className: 'border-emerald-500/20 bg-emerald-500/5'
    },
    balanced: { 
      duration: 0.6, 
      delay: 0.2,
      className: 'border-blue-500/20 bg-blue-500/5'
    },
    bold: { 
      duration: 0.4, 
      delay: 0.1,
      className: 'border-purple-500/20 bg-purple-500/5'
    }
  }[trustSpeed];

  return (
    <div className="absolute top-20 left-4 w-72 z-20">{/* Positioned below header, fixed width */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentLesson}
          initial={{ opacity: 0, x: -20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ 
            duration: speedConfig.duration,
            delay: speedConfig.delay,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <Card className={`
            bg-background/80 backdrop-blur-md border-2 
            ${speedConfig.className}
          `}>
            <CardContent className="p-3 space-y-3">{/* Reduced padding */}
              {/* Lesson Header */}
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                  {lesson.icon}
                </div>
                <div>
                  <Badge variant="outline" className="text-xs">
                    Lesson {currentLesson}
                  </Badge>
                  <h3 className="font-sacred text-sm font-medium text-foreground mt-1">
                    {lesson.title}
                  </h3>
                </div>
              </div>

              {/* Key Concepts */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-primary flex items-center space-x-1">
                  <Brain className="h-3 w-3" />
                  <span>Key Concepts</span>
                </h4>
                <ul className="space-y-1">
                  {lesson.concepts.map((concept, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: speedConfig.delay + (index * 0.1),
                        duration: speedConfig.duration 
                      }}
                      className="text-xs text-muted-foreground flex items-start space-x-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{concept}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Practices */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-secondary flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>Practices</span>
                </h4>
                <ul className="space-y-1">
                  {lesson.practices.map((practice, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: speedConfig.delay + 0.3 + (index * 0.1),
                        duration: speedConfig.duration 
                      }}
                      className="text-xs text-muted-foreground flex items-start space-x-2"
                    >
                      <span className="text-secondary mt-1">→</span>
                      <span>{practice}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Wisdom Quote */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: speedConfig.delay + 0.6,
                  duration: speedConfig.duration 
                }}
                className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
              >
                <p className="text-xs italic text-foreground leading-relaxed">
                  {lesson.wisdom}
                </p>
              </motion.div>

              {/* Trust Speed Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: speedConfig.delay + 0.8 }}
                className="flex items-center justify-between text-xs"
              >
                <Badge 
                  variant="secondary" 
                  className="text-xs"
                >
                  Trust Speed: {trustSpeed}
                </Badge>
                <div className="text-muted-foreground">
                  L{currentLesson}/7
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}