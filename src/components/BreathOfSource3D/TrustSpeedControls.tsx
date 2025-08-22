import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Turtle, Zap, Rocket } from 'lucide-react';

interface TrustSpeedControlsProps {
  currentSpeed: 'gentle' | 'balanced' | 'bold';
  onSpeedChange: (speed: 'gentle' | 'balanced' | 'bold') => void;
}

const speedOptions = [
  {
    key: 'gentle' as const,
    label: 'Gentle',
    description: 'Take your time, no rush. Perfect for beginners or when feeling tender.',
    multiplier: '1.5x slower',
    icon: <Turtle className="h-5 w-5" />,
    color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
    hoverColor: 'hover:bg-emerald-500/30 hover:border-emerald-500/50'
  },
  {
    key: 'balanced' as const,
    label: 'Balanced',
    description: 'Standard pace for most practice sessions. Natural rhythm.',
    multiplier: 'Normal speed',
    icon: <Zap className="h-5 w-5" />,
    color: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    hoverColor: 'hover:bg-blue-500/30 hover:border-blue-500/50'
  },
  {
    key: 'bold' as const,
    label: 'Bold',
    description: 'Confident pace for experienced practitioners ready to go deeper.',
    multiplier: '1.3x faster',
    icon: <Rocket className="h-5 w-5" />,
    color: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
    hoverColor: 'hover:bg-purple-500/30 hover:border-purple-500/50'
  }
];

export default function TrustSpeedControls({ 
  currentSpeed, 
  onSpeedChange 
}: TrustSpeedControlsProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full mx-6"
      >
        <Card className="bg-background/90 backdrop-blur-lg border-primary/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-sacred bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Choose Your Trust Speed
            </CardTitle>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              Your nervous system sets the pace, not the app. Choose what feels right in this moment.
              You can change this anytime.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {speedOptions.map((option) => (
                <motion.div
                  key={option.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => onSpeedChange(option.key)}
                    className={`
                      w-full p-6 h-auto justify-start text-left space-y-2
                      border-2 transition-all duration-200
                      ${currentSpeed === option.key 
                        ? `${option.color} ring-2 ring-offset-2 ring-offset-background` 
                        : `border-border ${option.hoverColor}`
                      }
                    `}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-2 rounded-lg transition-colors
                          ${currentSpeed === option.key 
                            ? 'bg-current/20' 
                            : 'bg-muted/50'
                          }
                        `}>
                          {option.icon}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-sacred text-lg">
                              {option.label}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className="text-xs"
                            >
                              {option.multiplier}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </div>
                      </div>
                      
                      {currentSpeed === option.key && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="shrink-0 ml-2"
                        >
                          <div className="w-3 h-3 rounded-full bg-current" />
                        </motion.div>
                      )}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Sacred Philosophy Note */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 rounded-lg bg-muted/30 border border-primary/10"
            >
              <p className="text-sm text-muted-foreground text-center italic">
                <span className="text-primary font-medium">"At the speed of trust"</span>
                {" "}means honoring your body's wisdom over external pressure. 
                This choice reflects your sovereignty in this moment.
              </p>
            </motion.div>

            {/* Continue Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center pt-2"
            >
              <p className="text-xs text-muted-foreground">
                Select your preferred speed to continue →
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}