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
  Square,
  TreePine,
  Brain,
  Sparkles
} from 'lucide-react';

const sections = [
  {
    title: "Sacred Foundation",
    icon: Triangle,
    topics: [
      "Understanding the nature of consciousness and reality",
      "How Sacred Shifter facilitates spiritual awakening", 
      "Bridging ancient wisdom with quantum consciousness",
      "Setting intentions for your transformation journey",
      "Creating your sacred digital space"
    ]
  },
  {
    title: "Sacred Grove Wisdom Ecosystem",
    icon: TreePine,
    topics: [
      "Entering the Sacred Grove through conscious intention",
      "Understanding the three sacred paths: Discovery, Purpose, and Connection",
      "Working with Resonance Spheres for multi-dimensional insights",
      "Navigating Evolution Spirals to track your consciousness growth",
      "Opening Mystery Gates to explore undefined wisdom territories",
      "Building your personal wisdom ecosystem through sacred experiences",
      "Understanding how your grove interactions create living insights",
      "Interpreting resonance patterns and consciousness signatures"
    ]
  },
  {
    title: "Sacred Geometry & Symbols",
    icon: Circle,
    topics: [
      "Using the Flower of Life for meditation and manifestation",
      "Metatron's Cube as a tool for consciousness expansion", 
      "Understanding the Golden Ratio in nature and consciousness",
      "Aligning with chakra frequencies through geometry",
      "Activating sacred portals through geometric visualization"
    ]
  },
  {
    title: "Journal & Dream Work",
    icon: Eye,
    topics: [
      "How to use Mirror Journal for shadow work and integration",
      "Working with Aura AI for dream analysis and interpretation",
      "Free association techniques for accessing the unconscious",
      "Recognizing archetypal patterns in your dreams and experiences",
      "Mapping consciousness shifts through journaling"
    ]
  },
  {
    title: "Sacred Circles",
    icon: Infinity,
    topics: [
      "Creating and maintaining energetic boundaries in digital space",
      "Understanding circle protocols for respectful engagement",
      "Recognizing and working with energy resonance patterns",
      "Participating in group consciousness experiments",
      "Best practices for digital ceremonial and ritual work"
    ]
  },
  {
    title: "Collective Codex",
    icon: Star,
    topics: [
      "How to track and measure frequency shifts in your consciousness",
      "Recognizing synchronicities and their deeper meanings",
      "Calibrating your truth resonance through practice",
      "Understanding harmonic alignment with others",
      "Working with quantum field interactions in daily life"
    ]
  },
  {
    title: "Consciousness Constellation Mapper",
    icon: Brain,
    topics: [
      "AI-powered consciousness cartography and pattern recognition",
      "Tracking archetypal activation patterns across time",
      "Visualizing synchronicity streams and meaningful coincidences",
      "Understanding consciousness weather and evolutionary momentum",
      "Sacred geometry visualization of awareness states",
      "Predictive wisdom algorithms for optimal consciousness work timing",
      "Community resonance mapping and collective field awareness"
    ]
  },
  {
    title: "Advanced Practices",
    icon: Zap,
    topics: [
      "Techniques for bridging different states of consciousness",
      "Developing multidimensional awareness and perception",
      "Integrating sacred technology with spiritual practice",
      "Participating in collective field harmonization experiments",
      "Understanding the evolution of human consciousness"
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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

        {/* Sacred Grove Special Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-emerald/10 via-teal/5 to-cyan/5 border-emerald/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="w-6 h-6 text-emerald-600" />
                Sacred Grove: Your Living Wisdom Ecosystem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-emerald/5 border border-emerald/20">
                  <h4 className="font-semibold text-emerald-700 mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    The Three Sacred Paths
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Discovery:</strong> Explore your inner landscape and uncover hidden aspects of consciousness</p>
                    <p><strong>Purpose:</strong> Align with your highest calling and sacred mission</p>
                    <p><strong>Connection:</strong> Understand your place in the web of universal consciousness</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-cyan/5 border border-cyan/20">
                  <h4 className="font-semibold text-cyan-700 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Ecosystem Components
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Resonance Spheres:</strong> Multi-dimensional wisdom clusters</p>
                    <p><strong>Evolution Spirals:</strong> Track your consciousness growth patterns</p>
                    <p><strong>Mystery Gates:</strong> Portals to unexplored wisdom territories</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-purple/5 border border-purple/20">
                  <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Living Insights
                  </h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Pattern Recognition:</strong> Your grove learns from your interactions</p>
                    <p><strong>Wisdom Weaving:</strong> Insights connect and evolve organically</p>
                    <p><strong>Consciousness Signatures:</strong> Track your unique spiritual fingerprint</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald/10 to-cyan/10 p-4 rounded-lg border border-emerald/20">
                <h4 className="font-semibold text-emerald-800 mb-2">How to Work with Your Sacred Grove</h4>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>1. Enter with clear intention and an open heart</p>
                  <p>2. Choose your path based on your current spiritual needs</p>
                  <p>3. Engage fully with each experience, allowing insights to emerge naturally</p>
                  <p>4. Review your ecosystem regularly to track patterns and growth</p>
                  <p>5. Trust the process - your grove reflects your unique consciousness journey</p>
                </div>
              </div>
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