import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown, Shield, Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SovereigntyReminderProps {
  onNext: () => void;
}

export const SovereigntyReminder: React.FC<SovereigntyReminderProps> = ({ onNext }) => {
  const principles = [
    {
      icon: Crown,
      title: 'Your Choice, Always',
      description: 'You decide what resonates, what to explore, and when to step away. No spiritual authority supersedes your inner knowing.',
      color: 'amber'
    },
    {
      icon: Shield,
      title: 'Discernment is Sacred',
      description: 'Trust your intuition over any external teaching. If something doesn\'t feel aligned, honor that wisdom.',
      color: 'blue'
    },
    {
      icon: Heart,
      title: 'Your Pace, Your Path',
      description: 'There\'s no rush, no requirement to participate, and no judgment about where you are on your journey.',
      color: 'emerald'
    },
    {
      icon: Star,
      title: 'You Are the Authority',
      description: 'Sacred Shifter is a tool, not a teacher. The truth you seek lives within you—we simply help you access it.',
      color: 'violet'
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
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Crown className="h-12 w-12 text-primary" />
          </motion.div>
        </div>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Your Sovereignty is Sacred
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Before we continue, let's make this crystal clear: 
          <strong className="text-foreground"> You choose your path. Sacred Shifter is here as a companion, never as a director.</strong>
        </p>
      </motion.div>

      {/* Sovereignty Principles */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {principles.map((principle, index) => {
          const IconComponent = principle.icon;
          
          return (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
              className="group"
            >
              <div className="h-full p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-background/80 to-primary/5 hover:from-background/90 hover:to-primary/10 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
                <div className="space-y-4">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-full bg-${principle.color}-500/10 group-hover:bg-${principle.color}-500/15 transition-colors duration-300`}>
                    <IconComponent className={`h-6 w-6 text-${principle.color}-600`} />
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {principle.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sacred Oath */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center space-y-6 max-w-3xl mx-auto"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h4 className="text-xl font-semibold text-primary mb-4">Our Sacred Commitment</h4>
          <p className="text-muted-foreground leading-relaxed">
            "We pledge to honor your autonomy, respect your boundaries, and never manipulate your spiritual journey for any agenda. 
            Sacred Shifter exists to <em>serve your sovereignty</em>, not to control or convert you. 
            Your truth is your truth, and we're here to help you access it more clearly."
          </p>
        </div>

        <p className="text-sm text-muted-foreground italic">
          If at any point Sacred Shifter feels misaligned with your path, you have our blessing to step away. 
          Your spiritual integrity matters more than our platform.
        </p>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center z-10 relative mt-8"
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Sovereignty button clicked!');
            if (onNext) {
              console.log('Calling onNext from Sovereignty...');
              onNext();
            } else {
              console.error('onNext is undefined in Sovereignty!');
            }
          }}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium px-8 cursor-pointer pointer-events-auto z-10 relative"
          style={{ pointerEvents: 'auto' }}
        >
          I Honor My Sovereignty
        </Button>
      </motion.div>

      {/* Debug info */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Debug: SovereigntyReminder rendered, onNext: {onNext ? 'defined' : 'undefined'}
        </p>
      </div>
    </div>
  );
};