import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle,
  Circle,
  Heart,
  Wind
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HUDInterfaceProps {
  currentLesson: number;
  lessonTitle: string;
  lessonDescription: string;
  isLessonComplete: boolean;
  cycleCount: number;
  onStartLesson: () => void;
  onCompleteLesson: () => void;
  onNextLesson: () => void;
  onPrevLesson: () => void;
}

const lessonIcons = {
  0: <Circle className="h-5 w-5" />,
  1: <Wind className="h-5 w-5" />,
  2: <Heart className="h-5 w-5" />,
  3: <Circle className="h-5 w-5" />,
  4: <Circle className="h-5 w-5" />,
  5: <Circle className="h-5 w-5" />,
  6: <Heart className="h-5 w-5" />,
  7: <CheckCircle className="h-5 w-5" />
};

const requiredCycles = {
  0: 0,
  1: 5,
  2: 8,
  3: 10,
  4: 0,
  5: 0,
  6: 5,
  7: 0
};

export default function HUDInterface({
  currentLesson,
  lessonTitle,
  lessonDescription,
  isLessonComplete,
  cycleCount,
  onStartLesson,
  onCompleteLesson,
  onNextLesson,
  onPrevLesson
}: HUDInterfaceProps) {
  const required = requiredCycles[currentLesson as keyof typeof requiredCycles] || 0;
  const progress = required > 0 ? Math.min((cycleCount / required) * 100, 100) : 100;
  const canComplete = required === 0 || cycleCount >= required;

  return (
    <div className="fixed inset-0 pointer-events-none z-15 flex flex-col">{/* Fixed positioning */}
      {/* Top HUD - Lesson Info - Fixed to top */}
      <div className="absolute top-4 left-4 right-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl"
        >
          <Card className="bg-background/80 backdrop-blur-md border-primary/20">
            <CardContent className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-primary text-sm">
                    {lessonIcons[currentLesson as keyof typeof lessonIcons]}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-sacred text-foreground leading-tight">
                      L{currentLesson}: {lessonTitle}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {lessonDescription}
                    </p>
                  </div>
                </div>
                
                <Badge 
                  variant={isLessonComplete ? "default" : "outline"}
                  className={`text-xs shrink-0 ${isLessonComplete ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {isLessonComplete ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Done
                    </>
                  ) : (
                    `${Math.min(cycleCount, required)}/${required}`
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom HUD - Fixed to bottom */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm mx-auto"
        >
          <Card className="bg-background/80 backdrop-blur-md border-primary/20">
            <CardContent className="p-2">
              <div className="flex items-center justify-between space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevLesson}
                  disabled={currentLesson === 0}
                  className="shrink-0 h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex-1 min-w-0">
                  {!isLessonComplete ? (
                    <Button
                      onClick={onStartLesson}
                      className="w-full h-7 text-xs"
                      size="sm"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {currentLesson === 0 ? 'Begin' : 'Practice'}
                    </Button>
                  ) : (
                    <Button
                      onClick={canComplete ? onCompleteLesson : undefined}
                      disabled={!canComplete}
                      className="w-full h-7 text-xs sacred-button"
                      size="sm"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextLesson}
                  disabled={currentLesson >= 7 || !isLessonComplete}
                  className="shrink-0 h-7 w-7 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}