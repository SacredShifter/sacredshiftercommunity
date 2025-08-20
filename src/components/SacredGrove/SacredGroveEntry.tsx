import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Compass, Heart, Crown } from 'lucide-react';

interface SacredGroveEntryProps {
  onPathSelect: (path: 'discovery' | 'purpose' | 'connection') => void;
  isVisible: boolean;
}

export const SacredGroveEntry: React.FC<SacredGroveEntryProps> = ({ onPathSelect, isVisible }) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [ambientSoundPlaying, setAmbientSoundPlaying] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Create ambient binaural tones (40Hz base frequency)
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.value = 40;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (!ambientSoundPlaying) {
        oscillator.start();
        setAmbientSoundPlaying(true);
      }

      return () => {
        try {
          oscillator.stop();
          audioContext.close();
        } catch (e) {
          // Cleanup error handling
        }
      };
    }
  }, [isVisible, ambientSoundPlaying]);

  const pathways = [
    {
      id: 'discovery' as const,
      title: 'The Path of Discovery',
      subtitle: 'Explore the Grove at your own pace',
      description: 'Follow what calls to you in this moment of wonder',
      icon: Compass,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      color: 'blue',
      frequency: '432 Hz - Harmony',
      symbolDescription: 'A sacred compass that points toward your authentic curiosity'
    },
    {
      id: 'purpose' as const,
      title: 'The Path of Purpose',
      subtitle: 'Share what brings you here',
      description: 'Receive guided waypoints aligned with your soul\'s direction',
      icon: Sparkles,
      gradient: 'from-violet-500/20 to-purple-500/20',
      color: 'violet',
      frequency: '528 Hz - Transformation',
      symbolDescription: 'A luminous seed ready to bloom into your highest potential'
    },
    {
      id: 'connection' as const,
      title: 'The Path of Connection',
      subtitle: 'Join the flowing of community wisdom',
      description: 'Weave your resonance with fellow travelers',
      icon: Heart,
      gradient: 'from-emerald-500/20 to-green-500/20',
      color: 'emerald',
      frequency: '639 Hz - Connection',
      symbolDescription: 'Interconnected hearts creating a field of collective wisdom'
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        <Card className="bg-background/98 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10">
          <CardContent className="p-0">
            <AnimatePresence mode="wait">
              {showWelcome ? (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.8 }}
                  className="min-h-[600px] flex flex-col items-center justify-center p-12 text-center space-y-8"
                >
                  {/* Sacred Geometry Background */}
                  <div className="absolute inset-0 opacity-5">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <defs>
                        <pattern id="sacred-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="10" cy="10" r="3" fill="currentColor" className="text-primary" />
                          <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#sacred-pattern)" />
                    </svg>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="relative"
                  >
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full animate-pulse" />
                      <div className="absolute inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-full" />
                      <Crown className="absolute inset-6 w-full h-full text-primary" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="space-y-4"
                  >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Welcome to the Sacred Grove
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                      A living ecosystem of wisdom, creativity, and conscious evolution
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="space-y-6"
                  >
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 max-w-lg">
                      <p className="text-muted-foreground italic">
                        "Before you enter, take a moment to ground in your own presence..."
                      </p>
                    </div>

                    {/* Breathing Guide */}
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">Take three conscious breaths</p>
                      <motion.div
                        className="w-16 h-16 mx-auto border-2 border-primary/30 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          borderColor: ['hsl(var(--primary) / 0.3)', 'hsl(var(--primary) / 0.8)', 'hsl(var(--primary) / 0.3)']
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>

                    <Button
                      onClick={() => {
                        console.log('Ready button clicked, showWelcome:', showWelcome);
                        setShowWelcome(false);
                        console.log('setShowWelcome(false) called');
                      }}
                      className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
                      size="lg"
                    >
                      I am ready to enter
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="pathways"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="p-12 space-y-8"
                >
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Choose Your Doorway
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Three paths of possibility await. Which calls to your soul in this moment?
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {pathways.map((pathway, index) => {
                      const IconComponent = pathway.icon;
                      
                      return (
                        <motion.div
                          key={pathway.id}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2, duration: 0.8 }}
                          className="group cursor-pointer"
                        >
                          <Card
                            onClick={() => onPathSelect(pathway.id)}
                            className={`h-full bg-gradient-to-br ${pathway.gradient} border-primary/20 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group-hover:scale-105`}
                          >
                            <CardContent className="p-8 h-full flex flex-col space-y-6">
                              {/* Icon and Frequency */}
                              <div className="flex items-start justify-between">
                                <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                                  <IconComponent className={`h-8 w-8 text-${pathway.color}-600 group-hover:scale-110 transition-transform duration-300`} />
                                </div>
                                <span className="text-xs font-medium text-primary/70 bg-primary/5 px-2 py-1 rounded-full">
                                  {pathway.frequency}
                                </span>
                              </div>

                              {/* Title and Subtitle */}
                              <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {pathway.title}
                                </h3>
                                <p className="text-sm font-medium text-primary/80">
                                  {pathway.subtitle}
                                </p>
                              </div>

                              {/* Description */}
                              <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                                {pathway.description}
                              </p>

                              {/* Symbol Description */}
                              <div className="border-t border-primary/10 pt-4">
                                <p className="text-xs text-muted-foreground/80 italic">
                                  {pathway.symbolDescription}
                                </p>
                              </div>

                              {/* Selection Indicator */}
                              <div className="flex items-center justify-center pt-2">
                                <motion.div
                                  className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transition-all duration-500"
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-center mt-8"
                  >
                    <p className="text-sm text-muted-foreground italic max-w-lg mx-auto">
                      Your sovereignty begins with choice. Trust what calls to you in this sacred moment.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};