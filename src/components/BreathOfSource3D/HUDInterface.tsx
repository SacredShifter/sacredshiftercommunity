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
    <div className="absolute inset-0 pointer-events-none z-20">{/* Higher z-index */}
      {/* Top HUD - Lesson Info */}
      <div className="absolute top-6 left-6 right-6 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-background/80 backdrop-blur-md border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-primary">
                    {lessonIcons[currentLesson as keyof typeof lessonIcons]}
                  </div>
                  <div>
                    <h2 className="text-lg font-sacred text-foreground">
                      L{currentLesson}: {lessonTitle}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {lessonDescription}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={isLessonComplete ? "default" : "outline"}
                    className={isLessonComplete ? "bg-primary text-primary-foreground" : ""}
                  >
                    {isLessonComplete ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </>
                    ) : (
                      `${cycleCount}/${required} cycles`
                    )}
                  </Badge>
                </div>
              </div>
              
              {/* Progress Bar for lessons with cycles */}
              {required > 0 && (
                <div className="mt-3">
                  <Progress 
                    value={progress} 
                    className="h-2 bg-muted"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Breath cycles completed
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom HUD - Controls */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-background/80 backdrop-blur-md border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between space-x-4">
                {/* Previous Lesson */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevLesson}
                  disabled={currentLesson === 0}
                  className="shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Main Action */}
                <div className="flex-1 space-y-2">
                  {!isLessonComplete ? (
                    currentLesson === 0 || required === 0 ? (
                      <Button
                        onClick={onStartLesson}
                        className="w-full sacred-button"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Begin Lesson
                      </Button>
                    ) : (
                      <Button
                        onClick={onStartLesson}
                        variant="outline"
                        className="w-full"
                        size="sm"
                      >
                        <Wind className="h-4 w-4 mr-2" />
                        Continue Practice
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={canComplete ? onCompleteLesson : undefined}
                      disabled={!canComplete}
                      className="w-full sacred-button"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {canComplete ? 'Complete Lesson' : 'Practice More'}
                    </Button>
                  )}
                </div>

                {/* Next Lesson */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextLesson}
                  disabled={currentLesson >= 7 || !isLessonComplete}
                  className="shrink-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Side HUD - Cycle Counter (when practicing) */}
      <AnimatePresence>
        {required > 0 && !isLessonComplete && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-auto"
          >
            <Card className="bg-background/60 backdrop-blur-sm border-primary/20">
              <CardContent className="p-3">
                <div className="text-center">
                  <div className="text-2xl font-sacred text-primary">
                    {cycleCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    of {required}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    cycles
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Pause */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Pause className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}