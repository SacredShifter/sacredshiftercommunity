import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Database, Archive, Scroll } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { UserPath } from './OnboardingFlow';

interface FirstStepInvitationProps {
  selectedPath: UserPath | null;
  onComplete: () => void;
}

const firstStepsByPath = {
  healing: [
    {
      icon: BookOpen,
      title: 'Begin with Sacred Reflection',
      subtitle: 'Write a gentle check-in in your Mirror Journal',
      description: 'Start with: "Today I acknowledge where I am in my healing..." Write whatever comes. There\'s no wrong way.',
      path: '/journal',
      cta: 'Open Mirror Journal'
    },
    {
      icon: Users,
      title: 'Connect Gently with Others',
      subtitle: 'Join a healing-focused Sacred Circle',
      description: 'When you\'re ready, witness others\' journeys and share yours. Community healing is powerful.',
      path: '/circles',
      cta: 'Explore Sacred Circles'
    }
  ],
  awakening: [
    {
      icon: Database,
      title: 'Document the Download',
      subtitle: 'Capture a recent synchronicity in your Collective Codex',
      description: 'Record that meaningful coincidence, dream, or "coincidence" that\'s been calling your attention.',
      path: '/registry',
      cta: 'Record Synchronicity'
    },
    {
      icon: BookOpen,
      title: 'Ground Your Expansion',
      subtitle: 'Journal your current experience in Mirror Journal',
      description: 'Process what\'s happening in your consciousness. Integration through writing is sacred.',
      path: '/journal',
      cta: 'Ground Through Writing'
    }
  ],
  explorer: [
    {
      icon: Archive,
      title: 'Start Your Wisdom Collection',
      subtitle: 'Add your first insight to your Personal Codex',
      description: 'What spiritual truth has been resonating with you lately? Begin documenting your discoveries.',
      path: '/codex',
      cta: 'Open Your Codex'
    },
    {
      icon: Scroll,
      title: 'Explore Ancient Wisdom',
      subtitle: 'Dive into the Sacred Shifter Guidebook',
      description: 'Discover timeless teachings and practices that can guide your exploration.',
      path: '/guidebook',
      cta: 'Open Guidebook'
    }
  ],
  remembering: [
    {
      icon: Archive,
      title: 'Channel Your Mastery',
      subtitle: 'Document your current practice in your Personal Codex',
      description: 'What wisdom are you embodying? What teachings are flowing through you? Begin chronicling.',
      path: '/codex',
      cta: 'Chronicle Wisdom'
    },
    {
      icon: Users,
      title: 'Serve Through Circle',
      subtitle: 'Create or join a Sacred Circle to guide others',
      description: 'Your mastery is meant to be shared. Step into your role as a guide and mentor.',
      path: '/circles',
      cta: 'Lead a Circle'
    }
  ]
};

export const FirstStepInvitation: React.FC<FirstStepInvitationProps> = ({ selectedPath, onComplete }) => {
  const navigate = useNavigate();
  const options = firstStepsByPath[selectedPath || 'explorer'];

  const handleStepSelect = (path: string) => {
    onComplete();
    navigate(path);
  };

  const handleExploreAll = () => {
    onComplete();
    navigate('/');
  };

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
          Your First Sacred Step
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The path opens when you take your first step. 
          Choose what calls to your soul right now—there's no rush, no pressure, just invitation.
        </p>
      </motion.div>

      {/* First Step Options */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {options.map((option, index) => {
          const IconComponent = option.icon;
          
          return (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div
                onClick={() => handleStepSelect(option.path)}
                className="h-full p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-background/80 to-primary/5 hover:from-background/90 hover:to-primary/10 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:scale-[1.02]"
              >
                <div className="space-y-4">
                  {/* Icon */}
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/15 transition-colors duration-300">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-sm font-medium text-primary/80">
                        {option.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {option.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {option.cta}
                    </span>
                    <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Alternative Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="text-center space-y-6"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Or simply begin exploring at your own pace:
          </p>
          
          <Button
            onClick={handleExploreAll}
            variant="outline"
            size="lg"
            className="border-primary/20 hover:border-primary/50 hover:bg-primary/5"
          >
            Return to Sacred Shifter Hub
          </Button>
        </div>

        {/* Sacred Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-6 max-w-2xl mx-auto"
        >
          <p className="text-foreground font-medium mb-2">Welcome Home, Sacred Shifter</p>
          <p className="text-sm text-muted-foreground italic">
            "You are exactly where you need to be. Trust your timing, honor your process, 
            and remember—this journey is yours to shape. We're simply honored to walk alongside you."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};