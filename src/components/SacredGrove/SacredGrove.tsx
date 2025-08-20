import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SacredGroveEntry } from './SacredGroveEntry';
import { PathExperience } from './PathExperiences';
import { ResonanceCheck } from './ResonanceCheck';
import { ResonanceSpheres } from './ResonanceSpheres';
import { EvolutionSpirals } from './EvolutionSpirals';
import { MysteryGates } from './MysteryGates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Compass, Sparkles, Heart, Brain, TreePine, Star, Zap, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePersonalSignature } from '@/hooks/usePersonalSignature';
import { useCommunityResonance } from '@/hooks/useCommunityResonance';
import { useWisdomEcosystem } from '@/hooks/useWisdomEcosystem';
import { supabase } from '@/integrations/supabase/client';

type PathType = 'discovery' | 'purpose' | 'connection';

interface GroveState {
  hasEntered: boolean;
  selectedPath: PathType | null;
  pathData: any;
  showResonanceCheck: boolean;
  ecosystemView: 'overview' | 'spheres' | 'spirals' | 'gates';
}

interface SacredGroveProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SacredGrove: React.FC<SacredGroveProps> = ({ isVisible, onClose }) => {
  const { user } = useAuth();
  const { signature, isAnalyzing } = usePersonalSignature();
  const { resonanceState } = useCommunityResonance();
  const { getEcosystemInsights } = useWisdomEcosystem();
  
  const [groveState, setGroveState] = useState<GroveState>({
    hasEntered: false,
    selectedPath: null,
    pathData: null,
    showResonanceCheck: false,
    ecosystemView: 'overview'
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
          className="w-full max-w-7xl max-h-[95vh] overflow-hidden"
        >
          <Card className="bg-background/98 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center border-b border-primary/10">
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Sacred Grove Wisdom Ecosystem
              </CardTitle>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="text-sm text-muted-foreground">
                  Path: <Badge variant="secondary">{groveState.pathData.path}</Badge>
                </div>
                {signature && (
                  <div className="text-sm text-muted-foreground">
                    Signature: <Badge variant="outline">{signature.temperament}</Badge>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Resonance: <Badge variant="outline">{Math.round(resonanceState.globalResonance * 100)}%</Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs value={groveState.ecosystemView} onValueChange={(view) => 
                setGroveState(prev => ({ ...prev, ecosystemView: view as any }))
              }>
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="overview" className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="spheres" className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4" />
                    <span>Resonance Spheres</span>
                  </TabsTrigger>
                  <TabsTrigger value="spirals" className="flex items-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <span>Evolution Spirals</span>
                  </TabsTrigger>
                  <TabsTrigger value="gates" className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Mystery Gates</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Path Echo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          {groveState.pathData.path === 'discovery' && <Compass className="h-6 w-6 text-alignment" />}
                          {groveState.pathData.path === 'purpose' && <Sparkles className="h-6 w-6 text-purpose" />}
                          {groveState.pathData.path === 'connection' && <Heart className="h-6 w-6 text-resonance" />}
                          <h3 className="text-lg font-semibold">Your Path Echo</h3>
                          <Badge variant="secondary" className="bg-primary/10 text-primary">
                            {groveState.pathData.path.charAt(0).toUpperCase() + groveState.pathData.path.slice(1)} Path
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your journey has created unique resonance patterns that guide your ecosystem experience.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Ecosystem Insights */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card className="bg-secondary/5 border-secondary/20">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Zap className="w-5 h-5 text-pulse" />
                          <span>Living Ecosystem Insights</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getEcosystemInsights().map((insight, index) => (
                          <div key={index} className="p-3 rounded border-l-2 border-pulse/50 bg-pulse/5">
                            <h4 className="font-medium text-pulse">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{insight.content}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Grove Areas Quick Access */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Resonance Spheres",
                        description: "3D clusters of wisdom insights",
                        icon: TreePine,
                        view: "spheres",
                        color: "text-alignment"
                      },
                      {
                        title: "Evolution Spirals", 
                        description: "Growth pattern visualization",
                        icon: Brain,
                        view: "spirals",
                        color: "text-purpose"
                      },
                      {
                        title: "Mystery Gates",
                        description: "Portals to undefined wisdom",
                        icon: Eye,
                        view: "gates",
                        color: "text-resonance"
                      }
                    ].map((area, index) => (
                      <motion.div
                        key={area.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <Card 
                          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-primary/40"
                          onClick={() => setGroveState(prev => ({ ...prev, ecosystemView: area.view as any }))}
                        >
                          <CardContent className="p-6 text-center">
                            <area.icon className={`h-8 w-8 mx-auto mb-3 ${area.color}`} />
                            <h4 className="font-semibold mb-2">{area.title}</h4>
                            <p className="text-xs text-muted-foreground">{area.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="spheres" className="h-[600px]">
                  <ResonanceSpheres 
                    isVisible={true}
                    onSphereSelect={(sphere) => console.log('Selected sphere:', sphere)}
                  />
                </TabsContent>

                <TabsContent value="spirals" className="h-[600px] overflow-y-auto">
                  <EvolutionSpirals 
                    isVisible={true}
                    userId={user?.id}
                  />
                </TabsContent>

                <TabsContent value="gates" className="h-[600px] overflow-y-auto">
                  <MysteryGates 
                    isVisible={true}
                    communityResonance={resonanceState.globalResonance}
                  />
                </TabsContent>
              </Tabs>

              {/* Grove Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="mt-6 pt-6 border-t border-primary/10"
              >
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
      isVisible={true}
      onPathSelect={handlePathSelect}
    />
  );
};