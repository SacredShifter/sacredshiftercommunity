import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Zap, Compass, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserPath } from './OnboardingFlow';

interface PathSelectionProps {
  onPathSelect: (path: UserPath) => void;
}

const pathOptions = [
  {
    id: 'healing' as UserPath,
    title: 'Healing from Trauma',
    description: 'You\'re working through wounds, seeking gentle tools for restoration and integration.',
    longDescription: 'Your nervous system needs safety, your heart needs witnessing, and your soul needs gentle tending. This path offers trauma-informed approaches to remembering your wholeness.',
    icon: Heart,
    gradient: 'from-emerald-500/20 to-green-500/20',
    color: 'emerald',
    energy: 'Restoration & Safety'
  },
  {
    id: 'awakening' as UserPath,
    title: 'In the Midst of Awakening',
    description: 'You\'re experiencing rapid expansion, seeking grounding tools for integration.',
    longDescription: 'Your consciousness is expanding faster than your nervous system can integrate. You need practical wisdom for navigating this accelerated transformation with grace.',
    icon: Zap,
    gradient: 'from-violet-500/20 to-purple-500/20',
    color: 'violet',
    energy: 'Expansion & Integration'
  },
  {
    id: 'explorer' as UserPath,
    title: 'Curious Explorer',
    description: 'You\'re drawn to spiritual growth and seeking tools for deeper understanding.',
    longDescription: 'You sense there\'s more to reality than meets the eye. Your curiosity is sacred—it\'s calling you to explore the mysteries of consciousness and connection.',
    icon: Compass,
    gradient: 'from-blue-500/20 to-cyan-500/20',
    color: 'blue',
    energy: 'Discovery & Wonder'
  },
  {
    id: 'remembering' as UserPath,
    title: 'Ready to Remember Fully',
    description: 'You\'re prepared for deep work, seeking advanced tools for full embodiment.',
    longDescription: 'You\'ve done the foundational work and are ready to step into your full sovereignty. This path is for those ready to embody their highest truth and serve from overflow.',
    icon: Crown,
    gradient: 'from-amber-500/20 to-orange-500/20',
    color: 'amber',
    energy: 'Mastery & Service'
  }
];

export const PathSelection: React.FC<PathSelectionProps> = ({ onPathSelect }) => {
  return (
    <div className="p-6 space-y-6 w-full max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Choose Your Sacred Path
        </h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Where are you on your journey? There's no right or wrong answer—only what's true for you right now.
          Your sovereignty begins with this choice.
        </p>
      </motion.div>

      {/* Path Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {pathOptions.map((path, index) => {
          const IconComponent = path.icon;
          
          return (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
              className="w-full"
            >
              <div
                onClick={() => {
                  console.log(`Path selected: ${path.id}`);
                  onPathSelect(path.id);
                }}
                className="w-full p-4 border border-primary/20 rounded-lg bg-background/50 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="space-y-3">
                  {/* Icon and Energy Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-full bg-gradient-to-br ${path.gradient} group-hover:scale-105 transition-transform duration-300 flex-shrink-0`}>
                      <IconComponent className={`h-5 w-5 text-${path.color}-600`} />
                    </div>
                    <div className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full flex-shrink-0">
                      {path.energy}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                  </div>

                  {/* Short Description */}
                  <div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {path.description}
                    </p>
                  </div>

                  {/* Long Description */}
                  <div className="border-t border-border/30 pt-3">
                    <p className="text-xs text-muted-foreground/70 leading-relaxed">
                      {path.longDescription}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex items-center justify-end pt-2">
                    <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Select →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sovereignty Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center mt-6"
      >
        <p className="text-sm text-muted-foreground italic max-w-lg mx-auto leading-relaxed">
          Remember: You can change paths anytime. This choice simply helps us customize your initial experience.
          Your journey is yours to define.
        </p>
      </motion.div>
    </div>
  );
};