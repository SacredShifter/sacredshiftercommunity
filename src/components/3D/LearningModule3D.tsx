import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Box, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
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

const learningModules: LearningModule[] = [
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
  // Future modules can be added here
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
    id: 'anatomy-energy',
    title: 'Energy Anatomy',
    description: 'Explore the human body\'s energy systems including meridians, nadis, and auric fields.',
    category: 'Anatomy',
    difficulty: 'advanced',
    duration: '20-25 min', 
    tags: ['anatomy', 'meridians', 'nadis', 'aura'],
    icon: <Eye className="h-5 w-5" />,
    component: () => <div className="flex items-center justify-center h-96 text-muted-foreground">Coming Soon: Energy Anatomy Explorer</div>
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
      <div className={`relative ${className}`}>
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="outline" 
            onClick={handleBack}
            className="bg-background/80 backdrop-blur-sm"
          >
            ← Back to Modules
          </Button>
        </div>

        {/* Module Component */}
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-screen">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading 3D Learning Module...</span>
            </div>
          }
        >
          <ModuleComponent />
        </Suspense>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
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