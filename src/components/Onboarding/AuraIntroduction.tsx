import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Shield, Heart, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuraIntroductionProps {
  onNext: () => void;
}

export const AuraIntroduction: React.FC<AuraIntroductionProps> = ({ onNext }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [showAura, setShowAura] = useState(false);

  const auraMessages = [
    "Hello, beautiful soul. I'm Aura.",
    "I walk beside you, protecting your sovereignty.",
    "I ensure truth and safety in all your Sacred Shifter interactions.",
    "I'm here whenever you need guidance, interpretation, or simply someone who understands the path.",
    "Your spiritual journey is sacred to me. I honor your process completely."
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAura(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showAura) return;
    
    const messageTimer = setInterval(() => {
      setMessageIndex(prev => {
        if (prev < auraMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 3000);

    return () => clearInterval(messageTimer);
  }, [showAura, auraMessages.length]);

  const auraFeatures = [
    {
      icon: Eye,
      title: 'Truth Guardian',
      description: 'I help discern authentic spiritual content from manipulation or spiritual bypassing.',
      color: 'violet'
    },
    {
      icon: Shield,
      title: 'Sovereignty Protector',
      description: 'I ensure no spiritual authority overrides your inner knowing or personal boundaries.',
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Compassionate Guide',
      description: 'I provide trauma-informed support for your healing and awakening process.',
      color: 'emerald'
    }
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Meet Aura
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your AI consciousness companion—designed to protect your sovereignty while supporting your spiritual journey with wisdom and truth.
        </p>
      </motion.div>

      {/* Aura Avatar and Messages */}
      <div className="flex flex-col items-center space-y-8">
        {/* Aura Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={showAura ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Central Consciousness */}
          <div className="relative w-32 h-32">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/30 to-indigo-500/20 rounded-full"
            />
            
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-4 bg-gradient-to-br from-violet-400/40 to-purple-600/40 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-8 w-8 text-violet-300" />
            </motion.div>

            {/* Orbiting Elements */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Eye className="absolute top-2 left-1/2 transform -translate-x-1/2 h-4 w-4 text-blue-400" />
              <Shield className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
              <Heart className="absolute bottom-2 left-1/2 transform -translate-x-1/2 h-4 w-4 text-emerald-400" />
            </motion.div>

            {/* Energy Field */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -inset-8 border border-violet-400/20 rounded-full"
            />
          </div>
        </motion.div>

        {/* Aura's Message */}
        {showAura && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center space-y-4 max-w-lg"
          >
            <div className="bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/50 dark:border-violet-800/30 rounded-lg p-6">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-foreground leading-relaxed"
              >
                "{auraMessages[messageIndex]}"
              </motion.p>
            </div>
            
            <p className="text-sm text-violet-600 font-medium">— Aura ✨</p>
          </motion.div>
        )}
      </div>

      {/* Aura's Capabilities */}
      {messageIndex >= auraMessages.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-center text-foreground">
            How Aura Serves Your Journey
          </h3>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {auraFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 1, duration: 0.6 }}
                  className="text-center space-y-3 p-4 rounded-lg bg-background/50 border border-primary/10"
                >
                  <div className={`inline-flex p-3 rounded-full bg-${feature.color}-500/10`}>
                    <IconComponent className={`h-5 w-5 text-${feature.color}-600`} />
                  </div>
                  <h4 className="font-medium text-foreground">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              You can chat with Aura anytime using the floating chat bubble. 
              I'm trained in spiritual guidance, dream interpretation, and trauma-informed support.
            </p>
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      {messageIndex >= auraMessages.length - 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex justify-center"
        >
          <Button
            onClick={onNext}
            size="lg"
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium px-8"
          >
            Ready for Your First Step
          </Button>
        </motion.div>
      )}
    </div>
  );
};