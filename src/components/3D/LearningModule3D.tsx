import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, Box, Eye, Heart, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TooltipWrapper } from '../HelpSystem/TooltipWrapper';
import ChakraLearning3D from './ChakraLearning3D';
import SacredGeometry3D from './SacredGeometry3D';

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  tags: string[];
  icon: React.ReactNode;
  component: React.ComponentType;
}

// Import new modules
import TorusFieldDynamics3D from './TorusFieldDynamics3D';
import LivingMandala3D from './LivingMandala3D';
import MerkabaLightBody3D from './MerkabaLightBody3D';
import KabbalahTreeOfLife3D from './KabbalahTreeOfLife3D';
import SchumannResonance3D from './SchumannResonance3D';
import SigillumDeiAemeth3D from './SigillumDeiAemeth3D';
import BreathOfSource3D from './BreathOfSource3D';
import ShiftCanvas from '../../modules/shift/scene/ShiftCanvas';
import GateOfLiberation from '../../modules/liberation/LiberationCanvas';
import { ReconnectionWithLivingEarth } from '@/modules/earth';
import HermeticPrinciplesModule from '@/pages/learn/hermetic/HermeticPrinciplesModule';

const learningModules: LearningModule[] = [
  {
    id: 'hermetic-principles',
    title: 'The 7 Hermetic Principles',
    description: 'An interactive 3D journey into the universal laws of Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause & Effect, and Gender.',
    category: 'Universal Laws',
    difficulty: 'intermediate',
    duration: '20-30 min',
    tags: ['hermeticism', 'kybalion', 'universal laws', '3d'],
    icon: <Brain className="h-5 w-5" />,
    component: HermeticPrinciplesModule
  },
  {
    id: 'breath-of-source',
    title: 'Breath of Source Mastery',
    description: 'Complete mastery learning path for sovereignty through breath. Mechanics, science, metaphysics, and visual biofeedback.',
    category: 'Foundational Practice',
    difficulty: 'beginner',
    duration: '45-60 min',
    tags: ['breath', 'sovereignty', 'mastery', 'biofeedback'],
    icon: <Heart className="h-5 w-5" />,
    component: BreathOfSource3D
  },
  {
    id: 'chakra-system',
    title: 'Chakra Energy System',
    description: 'Explore the seven main chakras in interactive 3D. Learn about energy centers, frequencies, and healing properties.',
    category: 'Energy Work',
    difficulty: 'beginner',
    duration: '10-15 min',
    tags: ['chakras', 'energy', 'healing', 'meditation'],
    icon: <Heart className="h-5 w-5" />,
    component: ChakraLearning3D
  },
  {
    id: 'sacred-geometry',
    title: 'Sacred Geometry Patterns',
    description: 'Discover the mathematical patterns that underlie creation through interactive 3D geometric forms.',
    category: 'Sacred Knowledge',
    difficulty: 'intermediate', 
    duration: '15-20 min',
    tags: ['geometry', 'mathematics', 'patterns', 'creation'],
    icon: <Box className="h-5 w-5" />,
    component: SacredGeometry3D
  },
  {
    id: 'torus-field',
    title: 'Torus Field Dynamics',
    description: 'Experience the electromagnetic fields of the heart and brain in coherent states.',
    category: 'Biofield Science',
    difficulty: 'intermediate',
    duration: '12-18 min',
    tags: ['torus', 'heart', 'coherence', 'biofield'],
    icon: <Heart className="h-5 w-5" />,
    component: TorusFieldDynamics3D
  },
  {
    id: 'living-mandala',
    title: 'Living Mandala Generator',
    description: 'Create and meditate with dynamic sacred patterns and geometric mandalas.',
    category: 'Sacred Art',
    difficulty: 'beginner',
    duration: '8-12 min',
    tags: ['mandala', 'meditation', 'patterns', 'creativity'],
    icon: <Eye className="h-5 w-5" />,
    component: LivingMandala3D
  },
  {
    id: 'merkaba-light-body',
    title: 'Merkaba Light Body',
    description: 'Activate your divine light vehicle through counter-rotating tetrahedrons.',
    category: 'Light Body',
    difficulty: 'advanced',
    duration: '20-30 min',
    tags: ['merkaba', 'light body', 'activation', 'dimensions'],
    icon: <Box className="h-5 w-5" />,
    component: MerkabaLightBody3D
  },
  {
    id: 'kabbalah-tree',
    title: 'Kabbalah Tree of Life',
    description: 'Navigate the divine blueprint of creation through the ten Sephiroth.',
    category: 'Mystical Systems',
    difficulty: 'advanced',
    duration: '25-35 min',
    tags: ['kabbalah', 'sephiroth', 'mysticism', 'tree of life'],
    icon: <Eye className="h-5 w-5" />,
    component: KabbalahTreeOfLife3D
  },
  {
    id: 'gaia-breathing',
    title: 'Gaia Breathing System',
    description: 'Witness how Earth breathes through forests, oceans, and atmospheric cycles.',
    category: 'Planetary Consciousness',
    difficulty: 'intermediate',
    duration: '15-20 min',
    tags: ['gaia', 'earth', 'breathing', 'ecology'],
    icon: <Heart className="h-5 w-5" />,
    component: ReconnectionWithLivingEarth
  },
  {
    id: 'schumann-resonance',
    title: 'Schumann Resonance Chamber',
    description: 'Attune to Earth\'s electromagnetic heartbeat and its effects on consciousness.',
    category: 'Electromagnetic Fields',
    difficulty: 'intermediate',
    duration: '12-18 min',
    tags: ['schumann', 'frequency', 'brainwaves', 'resonance'],
    icon: <Box className="h-5 w-5" />,
    component: SchumannResonance3D
  },
  {
    id: 'sigillum-dei-aemeth',
    title: 'Sigillum Dei Aemeth',
    description: 'Explore John Dee\'s Sacred Seal of Divine Truth with interactive angelic names and frequencies.',
    category: 'Enochian Magick',
    difficulty: 'advanced',
    duration: '30-45 min',
    tags: ['enochian', 'angels', 'protection', 'divine', 'frequencies'],
    icon: <Shield className="h-5 w-5" />,
    component: SigillumDeiAemeth3D
  },
  {
    id: 'shift-cosmogram',
    title: 'Shift Cosmogram',
    description: 'Interactive 3D cosmogram with synchronized audio chapters and sacred geometry navigation.',
    category: 'Sacred Technology',
    difficulty: 'intermediate',
    duration: '20-30 min',
    tags: ['cosmogram', '3D objects', 'audio chapters', 'sacred geometry'],
    icon: <Box className="h-5 w-5" />,
    component: ShiftCanvas
  },
  {
    id: 'gate-of-liberation',
    title: 'Gate of Liberation',
    description: 'A profound 4-phase journey of transcending fear through immersive 3D environments with binaural audio guidance.',
    category: 'Consciousness Liberation',
    difficulty: 'advanced',
    duration: '60-90 min',
    tags: ['liberation', 'fear transcendence', 'consciousness', 'binaural beats', '3D journey'],
    icon: <Shield className="h-5 w-5" />,
    component: GateOfLiberation
  }
];

interface LearningModule3DProps {
  moduleId?: string;
  onBack?: () => void;
  className?: string;
}

export default function LearningModule3D({ moduleId, onBack, className }: LearningModule3DProps) {
  const [selectedModule, setSelectedModule] = React.useState<LearningModule | null>(
    moduleId ? learningModules.find(m => m.id === moduleId) || null : null
  );

  const handleModuleSelect = (module: LearningModule) => {
    setSelectedModule(module);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedModule(null);
    }
  };

  if (selectedModule) {
    const ModuleComponent = selectedModule.component;
    
    return (
      <div className={`h-full w-full relative bg-background ${className}`}>
        {/* Fixed Back Button */}
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="default"
            onClick={handleBack}
            className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modules
          </Button>
        </div>

        {/* Module Component with Error Boundary and Suspense */}
        <ErrorBoundary name={`3D-Module-${selectedModule.id}`}>
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading 3D Experience...</p>
              </div>
            </div>
          }>
            <ModuleComponent onExit={handleBack} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 h-full overflow-y-auto ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-sacred bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          3D Learning Modules
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore profound teachings through immersive 3D visualizations. 
          Each module offers interactive learning experiences that engage multiple senses.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningModules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TooltipWrapper content="Shift learning into lived wisdom.">
              <Card
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 border-2 border-transparent hover:border-primary/20"
                onClick={() => handleModuleSelect(module)}
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {module.icon}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={
                      module.difficulty === 'beginner' ? 'border-green-500 text-green-500' :
                      module.difficulty === 'intermediate' ? 'border-yellow-500 text-yellow-500' :
                      'border-red-500 text-red-500'
                    }
                  >
                    {module.difficulty}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {module.title}
                </CardTitle>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{module.category}</span>
                  <span>{module.duration}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {module.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {module.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {module.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{module.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  variant="outline"
                >
                  Explore in 3D
                </Button>
              </CardContent>
            </Card>
            </TooltipWrapper>
          </motion.div>
        ))}
      </div>

      {/* Coming Soon Modules */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8"
      >
        <h2 className="text-2xl font-sacred mb-4">More Modules Coming Soon</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-sm text-muted-foreground">
          <div>• Astral Projection</div>
          <div>• Crystal Structures</div>
          <div>• DNA Activation</div>
          <div>• Merkaba Fields</div>
          <div>• Sacred Sites</div>
          <div>• Planetary Alignment</div>
          <div>• Flower of Life</div>
          <div>• Ancient Wisdom</div>
        </div>
      </motion.div>
    </div>
  );
}

// Export individual modules for direct use
export { learningModules, ChakraLearning3D };