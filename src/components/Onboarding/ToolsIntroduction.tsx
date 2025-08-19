import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Database, Archive, Video, Scroll } from 'lucide-react';
import { motion } from 'framer-motion';
import type { UserPath } from './OnboardingFlow';

interface ToolsIntroductionProps {
  selectedPath: UserPath | null;
  onNext: () => void;
}

const toolsByPath = {
  healing: [
    {
      icon: BookOpen,
      name: 'Mirror Journal',
      metaphor: 'Your Sanctuary of Reflection',
      description: 'A safe space to witness your healing journey, track patterns, and honor your progress with gentle self-compassion.',
      color: 'emerald'
    },
    {
      icon: Users,
      name: 'Sacred Circles',
      metaphor: 'Healing Fireside Gatherings',
      description: 'Connect with others who understand trauma recovery. Share when ready, witness when called, heal in community.',
      color: 'blue'
    },
    {
      icon: Database,
      name: 'Resonance Register',
      metaphor: 'Your Healing Milestones',
      description: 'Document moments of breakthrough, synchronicities, and signs that your nervous system is remembering safety.',
      color: 'amber'
    }
  ],
  awakening: [
    {
      icon: BookOpen,
      name: 'Mirror Journal',
      metaphor: 'Integration Observatory',
      description: 'Ground your rapid expansion through reflection. Track insights, process downloads, and integrate cosmic consciousness.',
      color: 'emerald'
    },
    {
      icon: Database,
      name: 'Resonance Register',
      metaphor: 'Synchronicity Tracker',
      description: 'Capture the magical alignments, meaningful coincidences, and reality shifts that accompany awakening.',
      color: 'amber'
    },
    {
      icon: Video,
      name: 'Sacred Library',
      metaphor: 'Wisdom Transmission Hub',
      description: 'Curated content to support your expansion with grounded teachings and practical integration tools.',
      color: 'red'
    }
  ],
  explorer: [
    {
      icon: Archive,
      name: 'Personal Codex',
      metaphor: 'Your Book of Mysteries',
      description: 'Collect wisdom, spiritual practices, and insights as you explore the depths of consciousness.',
      color: 'pink'
    },
    {
      icon: Scroll,
      name: 'Sacred Guidebook',
      metaphor: 'Ancient Maps for Modern Seekers',
      description: 'Timeless teachings and practices to guide your exploration of spiritual realms and inner landscapes.',
      color: 'indigo'
    },
    {
      icon: Users,
      name: 'Sacred Circles',
      metaphor: 'Explorer Gatherings',
      description: 'Connect with fellow seekers, share discoveries, and learn from diverse spiritual perspectives.',
      color: 'blue'
    }
  ],
  remembering: [
    {
      icon: Archive,
      name: 'Personal Codex',
      metaphor: 'Mastery Repository',
      description: 'Document your advanced practices, channel received wisdom, and create teachings for others.',
      color: 'pink'
    },
    {
      icon: Users,
      name: 'Sacred Circles',
      metaphor: 'Service & Leadership Councils',
      description: 'Lead circles, mentor others, and create containers for collective transformation.',
      color: 'blue'
    },
    {
      icon: Database,
      name: 'Resonance Register',
      metaphor: 'Manifestation Chronicle',
      description: 'Track how your sovereignty creates reality shifts, manifestations, and service opportunities.',
      color: 'amber'
    }
  ]
};

export const ToolsIntroduction: React.FC<ToolsIntroductionProps> = ({ selectedPath, onNext }) => {
  const tools = toolsByPath[selectedPath || 'explorer'];

  const pathTitles = {
    healing: 'Tools for Gentle Restoration',
    awakening: 'Tools for Grounded Expansion', 
    explorer: 'Tools for Sacred Discovery',
    remembering: 'Tools for Sovereign Service'
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
          {pathTitles[selectedPath || 'explorer']}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Based on your chosen path, here are the sacred tools that will support your journey.
          Each one is designed to honor your sovereignty while providing practical support.
        </p>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid gap-6 max-w-4xl mx-auto">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          
          return (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.6 }}
              className="group"
            >
              <div className="flex items-start space-x-6 p-6 rounded-lg border border-primary/10 bg-background/50 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
                {/* Tool Icon */}
                <div className={`p-4 rounded-xl bg-${tool.color}-500/10 group-hover:bg-${tool.color}-500/15 transition-colors duration-300 flex-shrink-0`}>
                  <IconComponent className={`h-8 w-8 text-${tool.color}-600`} />
                </div>

                {/* Tool Content */}
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm font-medium text-primary/80 italic">
                      {tool.metaphor}
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Sacred Geometry Accent */}
                <div className="flex-shrink-0 opacity-20 group-hover:opacity-40 transition-opacity">
                  <svg width="32" height="32" viewBox="0 0 32 32" className="text-primary">
                    <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="16" cy="16" r="6" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="16" cy="16" r="2" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sacred Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="text-center space-y-4 max-w-2xl mx-auto"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <p className="text-sm text-muted-foreground italic">
          Each tool is a living frequency, designed to grow with you as you evolve.
          They're not just features—they're sacred technologies for consciousness transformation.
        </p>
      </motion.div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="flex justify-center"
      >
        <Button
          onClick={onNext}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium px-8"
        >
          Ground Yourself with Gaia
        </Button>
      </motion.div>
    </div>
  );
};