import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check } from 'lucide-react';

interface SovereigntyAnchorProps {
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  onAcknowledge: () => void;
}

const anchorMessages = [
  "I choose to proceed in my own time.",
  "My breath is my sovereign territory.",
  "I honor my body's wisdom above all else.",
  "This practice serves my highest good.",
  "I release what no longer serves me."
];

export default function SovereigntyAnchor({ 
  trustSpeed, 
  onAcknowledge 
}: SovereigntyAnchorProps) {
  const [currentMessage] = React.useState(() => 
    anchorMessages[Math.floor(Math.random() * anchorMessages.length)]
  );
  const [isVisible, setIsVisible] = React.useState(true);

  const duration = {
    gentle: 8000,
    balanced: 5000,
    bold: 3000
  }[trustSpeed];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleAcknowledge = () => {
    setIsVisible(false);
    onAcknowledge();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          />

          {/* Anchor Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="relative max-w-md mx-6"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-lg border-primary/30 shadow-2xl">
              <CardContent className="p-8 text-center space-y-6">
                {/* Crown Icon */}
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex justify-center"
                >
                  <div className="p-4 rounded-full bg-primary/20 border border-primary/30">
                    <Crown className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>

                {/* Sovereignty Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-3"
                >
                  <h3 className="text-xl font-sacred text-foreground">
                    Sovereignty Anchor
                  </h3>
                  <p className="text-lg text-primary font-medium leading-relaxed">
                    "{currentMessage}"
                  </p>
                </motion.div>

                {/* Sacred Pause Indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          delay: 0.5 + index * 0.1,
                          type: "spring" 
                        }}
                        className="w-2 h-2 rounded-full bg-primary/60"
                      />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Take a moment to breathe with this truth
                  </p>
                </motion.div>

                {/* Acknowledge Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={handleAcknowledge}
                    className="w-full sacred-button"
                    size="lg"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    I Acknowledge My Sovereignty
                  </Button>
                </motion.div>

                {/* Auto-continue indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-muted-foreground"
                >
                  Will continue automatically in {Math.round(duration / 1000)}s
                </motion.div>
              </CardContent>
            </Card>

            {/* Sacred Geometry Accent */}
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 0.3, rotate: 360 }}
              transition={{ 
                duration: duration / 1000,
                ease: "linear",
                repeat: Infinity 
              }}
              className="absolute -top-2 -right-2 w-8 h-8 border border-primary/30 rotate-45"
            />
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 0.2, rotate: -360 }}
              transition={{ 
                duration: duration / 1000 * 1.5,
                ease: "linear",
                repeat: Infinity 
              }}
              className="absolute -bottom-2 -left-2 w-6 h-6 border border-secondary/30 rotate-45"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}