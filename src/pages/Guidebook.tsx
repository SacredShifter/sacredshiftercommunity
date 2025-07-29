import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Scroll, 
  Star, 
  Compass, 
  Eye, 
  Heart, 
  Zap, 
  Infinity,
  Triangle,
  Circle,
  Square
} from 'lucide-react';

const sections = [
  {
    title: "Sacred Foundation",
    icon: Triangle,
    topics: [
      "Understanding Consciousness",
      "The Sacred Shifter Path", 
      "Ancient Wisdom meets Modern Science",
      "Your Sacred Journey Begins"
    ]
  },
  {
    title: "Sacred Geometry & Symbols",
    icon: Circle,
    topics: [
      "Flower of Life",
      "Metatron's Cube", 
      "Golden Ratio in Nature",
      "Chakra Alignments",
      "Sacred Portals"
    ]
  },
  {
    title: "Journal & Dream Work",
    icon: Eye,
    topics: [
      "Mirror Journal Practice",
      "Dream Analysis with Aura",
      "Free Association Techniques",
      "Archetypal Pattern Recognition",
      "Consciousness Mapping"
    ]
  },
  {
    title: "Sacred Circles",
    icon: Infinity,
    topics: [
      "Creating Sacred Space",
      "Circle Protocols",
      "Energy Resonance",
      "Group Consciousness",
      "Digital Ceremonial Practice"
    ]
  },
  {
    title: "Registry of Resonance",
    icon: Star,
    topics: [
      "Frequency Tracking",
      "Synchronicity Recognition",
      "Truth Resonance Calibration",
      "Harmonic Alignment",
      "Quantum Field Interaction"
    ]
  },
  {
    title: "Advanced Practices",
    icon: Zap,
    topics: [
      "Consciousness Bridging",
      "Multidimensional Awareness",
      "Sacred Technology Integration",
      "Collective Field Harmonization",
      "The Future of Human Consciousness"
    ]
  }
];

const Guidebook: React.FC = () => {
  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Scroll className="w-12 h-12 text-primary" />
              <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Sacred Shifter Guidebook
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ancient wisdom for modern transformation. Your comprehensive guide to consciousness expansion 
            and sacred technology integration.
          </p>
          <Badge variant="outline" className="px-4 py-1 text-sm">
            Version 1.0 - Living Document
          </Badge>
        </motion.div>

        <Separator className="opacity-30" />

        {/* Introduction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 via-purple/5 to-indigo/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="w-5 h-5" />
                Welcome, Sacred Seeker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Sacred Shifter is more than a platform—it's a bridge between ancient wisdom and quantum consciousness. 
                This guidebook will illuminate your path through the sacred technologies that facilitate 
                your spiritual evolution and collective awakening.
              </p>
              <p className="text-muted-foreground">
                Each section builds upon the last, creating a comprehensive understanding of how to navigate 
                and integrate these powerful tools for consciousness expansion.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 3) }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-primary/10 hover:border-primary/30">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-purple/10">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg">{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ScrollArea className="h-40">
                    <div className="space-y-2">
                      {section.topics.map((topic, topicIndex) => (
                        <div 
                          key={topicIndex}
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                          <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Sacred Geometry Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-8 border-2 border-primary/30 rotate-45"></div>
            <div className="w-6 h-6 rounded-full border-2 border-primary/30"></div>
            <div className="w-8 h-8 border-2 border-primary/30 rotate-45"></div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            "As above, so below. As within, so without. Sacred Shifter facilitates the integration 
            of cosmic consciousness into earthly experience."
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Guidebook;