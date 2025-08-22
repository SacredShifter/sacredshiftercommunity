import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Heart, 
  Send, 
  X, 
  Brain,
  Waves,
  Shield
} from 'lucide-react';

interface ReflectionPanelProps {
  reflections: {
    chosenExperience: string;
    readyToRelease: string;
    fearLoosened: number;
    bodySafety: number;
  };
  onSubmitReflection: (reflection: any) => void;
}

export default function ReflectionPanel({ 
  reflections, 
  onSubmitReflection 
}: ReflectionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localReflections, setLocalReflections] = useState(reflections);
  const [activeTab, setActiveTab] = useState('knowing');

  const handleSubmit = () => {
    onSubmitReflection(localReflections);
    setIsOpen(false);
  };

  const updateReflection = (key: string, value: string | number) => {
    setLocalReflections(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <>
      {/* Floating Reflection Button */}
      <motion.div 
        className="absolute bottom-20 right-6"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-lg"
          size="icon"
        >
          <BookOpen className="h-6 w-6" />
        </Button>
      </motion.div>

      {/* Reflection Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="relative max-w-2xl w-full mx-6 max-h-[80vh] overflow-hidden"
            >
              <Card className="bg-background/95 backdrop-blur-lg border-primary/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-xl font-sacred">
                      <Heart className="h-5 w-5 text-primary" />
                      <span>Sacred Reflection</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Separate what you know from what you feel. Both are sacred.
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="knowing" className="flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span>Knowing</span>
                      </TabsTrigger>
                      <TabsTrigger value="feeling" className="flex items-center space-x-2">
                        <Heart className="h-4 w-4" />
                        <span>Feeling</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="knowing" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">
                          What are you choosing to experience? (Inhale - Life)
                        </label>
                        <Textarea
                          value={localReflections.chosenExperience}
                          onChange={(e) => updateReflection('chosenExperience', e.target.value)}
                          placeholder="What conscious experience are you calling in with this breath..."
                          className="min-h-[100px] resize-none sacred-input"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground">
                          What are you ready to release? (Exhale - Death)
                        </label>
                        <Textarea
                          value={localReflections.readyToRelease}
                          onChange={(e) => updateReflection('readyToRelease', e.target.value)}
                          placeholder="What patterns, fears, or limitations are you letting go of..."
                          className="min-h-[100px] resize-none sacred-input"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="feeling" className="space-y-6 mt-4">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                              <Waves className="h-4 w-4" />
                              <span>Fear loosened its grip</span>
                            </label>
                            <Badge variant="outline">
                              {localReflections.fearLoosened}/5
                            </Badge>
                          </div>
                          <Slider
                            value={[localReflections.fearLoosened]}
                            onValueChange={([value]) => updateReflection('fearLoosened', value)}
                            max={5}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Still tight</span>
                            <span>Completely free</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-foreground flex items-center space-x-2">
                              <Shield className="h-4 w-4" />
                              <span>Body feels safe</span>
                            </label>
                            <Badge variant="outline">
                              {localReflections.bodySafety}/5
                            </Badge>
                          </div>
                          <Slider
                            value={[localReflections.bodySafety]}
                            onValueChange={([value]) => updateReflection('bodySafety', value)}
                            max={5}
                            min={1}
                            step={1}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>On guard</span>
                            <span>Completely relaxed</span>
                          </div>
                        </div>
                      </div>

                      {/* Guidance */}
                      <div className="p-4 rounded-lg bg-muted/30 border border-primary/10">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-primary font-medium">Feeling Check:</span>
                          {" "}Notice what's happening in your body without trying to change it. 
                          These sensations are information, not problems to solve.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Submit */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="sacred-button"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Save Reflection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}