import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Settings, X } from 'lucide-react';
import { useLiberationState } from '../context/LiberationContext';

export const ComfortMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, send } = useLiberationState();
  const comfort = state.context.comfortSettings;

  const updateSetting = (setting: string, value: any) => {
    send({ type: 'COMFORT_TOGGLE', setting, value });
  };

  return (
    <>
      {/* Comfort button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-black/40 backdrop-blur-sm border border-white/20 text-white hover:bg-white/10 rounded-full h-12 w-12"
          size="icon"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Comfort menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="m-4"
            >
              <Card className="w-full max-w-md bg-background/95 backdrop-blur-sm border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Comfort Settings</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="motion-reduced" className="text-sm font-medium">
                        Reduce Motion
                      </Label>
                      <Switch
                        id="motion-reduced"
                        checked={comfort.motionReduced}
                        onCheckedChange={(checked) => updateSetting('motionReduced', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Volume Level: {Math.round(comfort.volumeLevel * 100)}%
                      </Label>
                      <Slider
                        value={[comfort.volumeLevel]}
                        onValueChange={([value]) => updateSetting('volumeLevel', value)}
                        max={1}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="vignette" className="text-sm font-medium">
                        Edge Softening
                      </Label>
                      <Switch
                        id="vignette"
                        checked={comfort.vignetteEnabled}
                        onCheckedChange={(checked) => updateSetting('vignetteEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fov-clamp" className="text-sm font-medium">
                        Limit Field of View
                      </Label>
                      <Switch
                        id="fov-clamp"
                        checked={comfort.fovClamped}
                        onCheckedChange={(checked) => updateSetting('fovClamped', checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      These settings help ensure a comfortable experience.
                      You can pause anytime if you need a break.
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="flex-1"
                    >
                      Apply Settings
                    </Button>
                    <Button
                      onClick={() => send({ type: 'PAUSE' })}
                      variant="outline"
                      className="flex-1"
                    >
                      Pause Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};