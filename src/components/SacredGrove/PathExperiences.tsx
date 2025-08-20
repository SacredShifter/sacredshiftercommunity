import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Compass, Sparkles, Heart, Eye, Flame, Droplet } from 'lucide-react';

type PathType = 'discovery' | 'purpose' | 'connection';

interface StepData {
  type: string;
  question?: string;
  instruction?: string;
  inputType?: string;
  symbols?: Array<{id: string; icon: string; name: string; meaning: string}>;
  soils?: Array<{id: string; name: string; description: string; icon: string}>;
  orbs?: Array<{id: string; name: string; color: string; frequency: string; icon: string}>;
  duration?: number;
  maxSelection?: number;
}

interface PathExperienceProps {
  path: PathType;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export const PathExperience: React.FC<PathExperienceProps> = ({ path, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pathConfigs = {
    discovery: {
      title: "The Way of Wonder",
      color: "blue",
      icon: Compass,
      steps: [
        {
          type: "reflection",
          question: "What catches your attention most strongly right now?",
          instruction: "Allow your intuition to guide your response",
          inputType: "textarea"
        } as StepData,
        {
          type: "symbol",
          question: "Choose the symbol that resonates with your response",
          symbols: [
            { id: "spiral", icon: "🌀", name: "Spiral", meaning: "Evolution and growth" },
            { id: "key", icon: "🗝️", name: "Key", meaning: "Opening new possibilities" },
            { id: "star", icon: "⭐", name: "Star", meaning: "Guidance and illumination" }
          ]
        } as StepData,
        {
          type: "contemplation",
          instruction: "Take a moment to contemplate how your attention and chosen symbol weave together...",
          duration: 30
        } as StepData
      ]
    },
    purpose: {
      title: "The Way of Essence",
      color: "violet", 
      icon: Sparkles,
      steps: [
        {
          type: "vision",
          question: "Hold this seed of your potential. What does it wish to become?",
          instruction: "Speak or write from the deepest place of knowing within you",
          inputType: "textarea"
        } as StepData,
        {
          type: "soil",
          question: "Choose the soil where you'd like to plant this seed",
          soils: [
            { id: "change", name: "Change", description: "Transforming yourself and your environment", icon: "🌱" },
            { id: "creation", name: "Creation", description: "Bringing new beauty and innovation into being", icon: "🎨" },
            { id: "service", name: "Service", description: "Contributing to the healing and evolution of others", icon: "💝" }
          ]
        } as StepData,
        {
          type: "meditation",
          instruction: "Feel your seed taking root in the soil you've chosen. Notice what wants to grow...",
          duration: 45
        } as StepData
      ]
    },
    connection: {
      title: "The Way of Resonance",
      color: "emerald",
      icon: Heart,
      steps: [
        {
          type: "field",
          question: "You're surrounded by orbs of light, each representing a different form of connection",
          instruction: "Move closer to the orbs that feel most alive to you",
          orbs: [
            { id: "self", name: "Connection to Self", color: "amber", frequency: "396 Hz", icon: "🧘" },
            { id: "others", name: "Connection to Others", color: "rose", frequency: "528 Hz", icon: "👥" },
            { id: "nature", name: "Connection to Nature", color: "emerald", frequency: "639 Hz", icon: "🌿" },
            { id: "spirit", name: "Connection to Spirit", color: "violet", frequency: "741 Hz", icon: "✨" }
          ]
        } as StepData,
        {
          type: "gather",
          question: "Choose three orbs that feel most essential to your being right now",
          maxSelection: 3
        } as StepData,
        {
          type: "pattern",
          instruction: "Watch as your chosen connections weave together into your unique pattern...",
          duration: 30
        } as StepData
      ]
    }
  };

  const config = pathConfigs[path];
  const currentStepData = config.steps[currentStep];
  const IconComponent = config.icon;

  const handleResponse = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < config.steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete({
        path,
        responses,
        selectedSymbol,
        timestamp: new Date().toISOString()
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case "reflection":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <svg className="absolute inset-4 w-24 h-24 text-primary/40" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      values="0 50 50;360 50 50"
                      dur="20s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                  <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.8" />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">{currentStepData.question}</h3>
              <p className="text-sm text-muted-foreground text-center italic">
                {currentStepData.instruction}
              </p>
              
              <Textarea
                placeholder="Let your awareness flow onto the page..."
                className="min-h-32 bg-background/50 border-primary/20 focus:border-primary/50"
                value={responses.reflection || ''}
                onChange={(e) => handleResponse('reflection', e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={nextStep}
                disabled={!responses.reflection?.trim()}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "symbol":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">{currentStepData.question}</h3>
              <p className="text-sm text-muted-foreground">
                Your words have created ripples in the reflection pool
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {currentStepData.symbols?.map((symbol) => (
                <motion.div
                  key={symbol.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer p-6 rounded-lg border transition-all duration-300 ${
                    selectedSymbol === symbol.id
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                  }`}
                  onClick={() => setSelectedSymbol(symbol.id)}
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{symbol.icon}</div>
                    <h4 className="font-medium">{symbol.name}</h4>
                    <p className="text-xs text-muted-foreground">{symbol.meaning}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={nextStep}
                disabled={!selectedSymbol}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
              >
                Choose This Symbol
              </Button>
            </div>
          </div>
        );

      case "vision":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <motion.div
                className="w-20 h-20 mx-auto relative"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full" />
                <div className="absolute inset-2 bg-gradient-to-br from-primary/20 to-transparent rounded-full" />
                <Sparkles className="absolute inset-4 w-full h-full text-primary" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">{currentStepData.question}</h3>
              <p className="text-sm text-muted-foreground text-center italic">
                {currentStepData.instruction}
              </p>
              
              <Textarea
                placeholder="I feel this seed wants to become..."
                className="min-h-32 bg-background/50 border-primary/20 focus:border-primary/50"
                value={responses.vision || ''}
                onChange={(e) => handleResponse('vision', e.target.value)}
              />
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={nextStep}
                disabled={!responses.vision?.trim()}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
              >
                Plant This Vision
              </Button>
            </div>
          </div>
        );

      case "soil":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">{currentStepData.question}</h3>
            </div>

            <div className="space-y-4">
              {currentStepData.soils?.map((soil) => (
                <motion.div
                  key={soil.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer p-6 rounded-lg border transition-all duration-300 ${
                    responses.soil === soil.id
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
                  }`}
                  onClick={() => handleResponse('soil', soil.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{soil.icon}</div>
                    <div>
                      <h4 className="font-medium">{soil.name}</h4>
                      <p className="text-sm text-muted-foreground">{soil.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={nextStep}
                disabled={!responses.soil}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
              >
                Plant in This Soil
              </Button>
            </div>
          </div>
        );

      case "field":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">{currentStepData.question}</h3>
              <p className="text-sm text-muted-foreground italic">
                {currentStepData.instruction}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {currentStepData.orbs?.map((orb) => (
                <motion.div
                  key={orb.id}
                  whileHover={{ scale: 1.05, boxShadow: `0 10px 30px hsl(var(--${orb.color}) / 0.3)` }}
                  className={`cursor-pointer p-6 rounded-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 bg-gradient-to-br from-primary/5 to-transparent`}
                  onClick={() => handleResponse('selectedOrb', orb.id)}
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{orb.icon}</div>
                    <h4 className="font-medium">{orb.name}</h4>
                    <p className="text-xs text-muted-foreground">{orb.frequency}</p>
                    <motion.div
                      className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-${orb.color}-400/30 to-${orb.color}-600/30 border border-${orb.color}-400/50`}
                      animate={{ 
                        boxShadow: [
                          `0 0 0 0 hsl(var(--${orb.color}) / 0.3)`,
                          `0 0 0 10px hsl(var(--${orb.color}) / 0)`,
                        ] 
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={nextStep}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
              >
                Explore These Connections
              </Button>
            </div>
          </div>
        );

      case "contemplation":
      case "meditation":
      case "pattern":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <motion.div
                className="w-32 h-32 mx-auto relative"
                animate={{ rotate: 360 }}
                transition={{ duration: currentStepData.duration, ease: "linear", repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full" />
                <div className="absolute inset-4 bg-gradient-to-br from-primary/15 to-transparent rounded-full" />
                <IconComponent className="absolute inset-8 w-full h-full text-primary" />
              </motion.div>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium">Integration</h3>
              <p className="text-muted-foreground italic">
                {currentStepData.instruction}
              </p>
            </div>

            <motion.div
              className="w-full bg-muted/30 rounded-full h-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: currentStepData.duration, ease: "linear" }}
                onAnimationComplete={nextStep}
              />
            </motion.div>

            <div className="text-center">
              <motion.p
                className="text-sm text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Allow the integration to unfold naturally...
              </motion.p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <Card className="bg-background/98 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8 space-y-2">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <IconComponent className={`h-8 w-8 text-${config.color}-600`} />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {config.title}
                </h2>
              </div>
              
              {/* Progress */}
              <div className="flex justify-center space-x-2">
                {config.steps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-8 rounded-full transition-all duration-300 ${
                      index <= currentStep 
                        ? 'bg-primary shadow-md shadow-primary/50' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: isTransitioning ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isTransitioning ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Back Button */}
            <div className="flex justify-start mt-8">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Grove
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};