import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SacredGroveEntry } from './SacredGroveEntry';
import { PathExperience } from './PathExperiences';
import { ResonanceCheck } from './ResonanceCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, Sparkles, Heart, Brain, TreePine, Star } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type PathType = 'discovery' | 'purpose' | 'connection';

interface GroveState {
  hasEntered: boolean;
  selectedPath: PathType | null;
  pathData: any;
  showResonanceCheck: boolean;
}

interface SacredGroveProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SacredGrove: React.FC<SacredGroveProps> = ({ isVisible, onClose }) => {
  const { user } = useAuth();
  const [groveState, setGroveState] = useState<GroveState>({
    hasEntered: false,
    selectedPath: null,
    pathData: null,
    showResonanceCheck: false
  });

  const handlePathSelect = (path: PathType) => {
    setGroveState(prev => ({
      ...prev,
      hasEntered: true,
      selectedPath: path
    }));
  };

  const handlePathComplete = async (pathData: any) => {
    setGroveState(prev => ({
      ...prev,
      pathData
    }));

    // Store path data in Supabase
    if (user) {
      try {
        await supabase
          .from('akashic_records')
          .insert({
            type: 'sacred_grove_path',
            data: pathData,
            metadata: {
              path: pathData.path,
              userId: user.id,
              timestamp: pathData.timestamp
            }
          });
      } catch (error) {
        console.error('Error storing path data:', error);
      }
    }

    // Navigate to Grove ecosystem view
    setTimeout(() => {
      setGroveState(prev => ({ ...prev, selectedPath: null }));
    }, 2000);
  };

  const handleBackToEntry = () => {
    setGroveState(prev => ({
      ...prev,
      hasEntered: false,
      selectedPath: null
    }));
  };

  const toggleResonanceCheck = () => {
    setGroveState(prev => ({
      ...prev,
      showResonanceCheck: !prev.showResonanceCheck
    }));
  };

  if (!isVisible) return null;

  // Path Experience View
  if (groveState.selectedPath && !groveState.pathData) {
    return (
      <PathExperience
        path={groveState.selectedPath}
        onComplete={handlePathComplete}
        onBack={handleBackToEntry}
      />
    );
  }

  // Grove Ecosystem View (after path completion)
  if (groveState.pathData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/95 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          <Card className="bg-background/98 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center border-b border-primary/10">
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome to Your Sacred Grove
              </CardTitle>
              <p className="text-muted-foreground">
                A living ecosystem of wisdom, awakened by your {groveState.pathData.path} journey
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              {/* Path Echo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      {groveState.pathData.path === 'discovery' && <Compass className="h-6 w-6 text-blue-600" />}
                      {groveState.pathData.path === 'purpose' && <Sparkles className="h-6 w-6 text-violet-600" />}
                      {groveState.pathData.path === 'connection' && <Heart className="h-6 w-6 text-emerald-600" />}
                      <h3 className="text-lg font-semibold">Your Path Echo</h3>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {groveState.pathData.path.charAt(0).toUpperCase() + groveState.pathData.path.slice(1)} Path
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your journey has created unique resonance patterns that will guide your experience in the Grove.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Grove Areas */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    title: "Resonance Spheres",
                    description: "Luminous clusters of related wisdom insights",
                    icon: TreePine,
                    status: "Available",
                    gradient: "from-blue-500/20 to-cyan-500/20"
                  },
                  {
                    title: "Evolution Spirals", 
                    description: "Living helixes of transformation patterns",
                    icon: Brain,
                    status: "Emerging",
                    gradient: "from-violet-500/20 to-purple-500/20"
                  },
                  {
                    title: "Mystery Gates",
                    description: "Portals to undefined edges of wisdom",
                    icon: Star,
                    status: "Awakening",
                    gradient: "from-amber-500/20 to-orange-500/20"
                  }
                ].map((area, index) => (
                  <motion.div
                    key={area.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Card className={`bg-gradient-to-br ${area.gradient} border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <area.icon className="h-6 w-6 text-primary" />
                          <Badge variant="outline" className="text-xs">
                            {area.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-2">{area.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {area.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Grove Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Grove Tools</h3>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={toggleResonanceCheck}
                    variant="outline"
                    className="bg-primary/5 border-primary/30 hover:bg-primary/10"
                  >
                    3-Point Resonance Check
                  </Button>
                  <Button
                    onClick={onClose}
                    className="bg-primary text-primary-foreground"
                  >
                    Return to Sacred Shifter
                  </Button>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resonance Check Modal */}
        <ResonanceCheck
          isOpen={groveState.showResonanceCheck}
          onClose={() => setGroveState(prev => ({ ...prev, showResonanceCheck: false }))}
        />
      </div>
    );
  }

  // Initial Entry View
  return (
    <SacredGroveEntry
      isVisible={!groveState.hasEntered}
      onPathSelect={handlePathSelect}
    />
  );
};