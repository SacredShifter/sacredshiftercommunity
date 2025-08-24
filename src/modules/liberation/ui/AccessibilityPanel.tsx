import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  Volume2, 
  Eye, 
  Zap, 
  Heart, 
  Settings,
  X 
} from 'lucide-react';
import { useLiberationState } from '../context/LiberationContext';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { state, send } = useLiberationState();
  const [localSettings, setLocalSettings] = useState(state.context.comfortSettings);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    send({ type: 'COMFORT_TOGGLE', setting: key, value });
  };

  const accessibilityPresets = [
    {
      name: 'Sensitive',
      description: 'Minimal motion, low audio, high comfort',
      settings: {
        motionReduced: true,
        volumeLevel: 0.3,
        vignetteEnabled: true,
        fovClamped: true,
      },
    },
    {
      name: 'Standard',
      description: 'Balanced experience for most users',
      settings: {
        motionReduced: false,
        volumeLevel: 0.7,
        vignetteEnabled: true,
        fovClamped: false,
      },
    },
    {
      name: 'Immersive',
      description: 'Full experience with all effects',
      settings: {
        motionReduced: false,
        volumeLevel: 1.0,
        vignetteEnabled: false,
        fovClamped: false,
      },
    },
  ];

  const applyPreset = (preset: typeof accessibilityPresets[0]) => {
    setLocalSettings(preset.settings);
    Object.entries(preset.settings).forEach(([key, value]) => {
      send({ type: 'COMFORT_TOGGLE', setting: key, value });
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Accessibility className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Accessibility & Comfort</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Customize your liberation experience for optimal comfort
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* Quick Presets */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Quick Presets</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {accessibilityPresets.map((preset) => (
                  <Card
                    key={preset.name}
                    className="cursor-pointer transition-all hover:border-primary/50"
                    onClick={() => applyPreset(preset)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-1">{preset.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {preset.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Visual Comfort */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <Label className="text-base font-medium">Visual Comfort</Label>
              </div>
              
              <div className="space-y-4 pl-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reduce Motion Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimizes camera movement and animations
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.motionReduced}
                    onCheckedChange={(checked) => updateSetting('motionReduced', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Comfort Vignette</Label>
                    <p className="text-sm text-muted-foreground">
                      Adds dark edges to reduce motion sickness
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.vignetteEnabled}
                    onCheckedChange={(checked) => updateSetting('vignetteEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Limit Field of View</Label>
                    <p className="text-sm text-muted-foreground">
                      Reduces wide-angle effects for sensitive users
                    </p>
                  </div>
                  <Switch
                    checked={localSettings.fovClamped}
                    onCheckedChange={(checked) => updateSetting('fovClamped', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Audio Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Label className="text-base font-medium">Audio Experience</Label>
              </div>
              
              <div className="space-y-4 pl-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Master Volume</Label>
                    <Badge variant="outline">
                      {Math.round(localSettings.volumeLevel * 100)}%
                    </Badge>
                  </div>
                  <Slider
                    value={[localSettings.volumeLevel]}
                    onValueChange={([value]) => updateSetting('volumeLevel', value)}
                    max={1}
                    step={0.1}
                    className="w-full"
                  />
                  <p className="text-sm text-muted-foreground">
                    Controls binaural beats and healing frequencies
                  </p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <Label className="text-base font-medium">Current Status</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pl-6">
                <div className="space-y-1">
                  <Label className="text-sm">Scene</Label>
                  <Badge variant="secondary">{state.context.currentScene}</Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Arousal Level</Label>
                  <Badge variant={state.context.arousalLevel > 6 ? 'destructive' : 'default'}>
                    {state.context.arousalLevel}/10
                  </Badge>
                </div>
              </div>
            </div>

            {/* Emergency Controls */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <Label className="text-base font-medium">Emergency Controls</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pl-6">
                <Button
                  variant="outline"
                  onClick={() => send({ type: 'PAUSE' })}
                  className="w-full"
                >
                  Pause Journey
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => send({ type: 'ABORT' })}
                  className="w-full"
                >
                  Exit Safely
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Comfort Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Take breaks if you feel overwhelmed</li>
                <li>Breathe deeply and focus on your intention</li>
                <li>Use headphones for the full binaural effect</li>
                <li>Sit in a comfortable, quiet space</li>
              </ul>
            </div>
          </CardContent>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};