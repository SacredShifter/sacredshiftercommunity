import React, { useState } from 'react';
import { GateOfLiberation } from '@/modules/liberation';
import { UnhookingFromFearBroadcasts } from '@/modules/unhooking';
import { ReconnectionWithLivingEarth } from '@/modules/earth';
import { CollectiveCoherenceCircle } from '@/modules/collective';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TrustIntroduction } from '@/components/Onboarding/TrustIntroduction';

type ModulePhase = 'selection' | 'liberation' | 'unhooking' | 'earth' | 'collective';

const modules = [
  {
    id: 'liberation',
    title: 'Gate of Liberation',
    description: 'Dissolve fear of death/life through embodied journey',
    phase: 'Phase 1 - Core Liberation',
    status: 'available',
    component: GateOfLiberation
  },
  {
    id: 'unhooking',
    title: 'Unhooking from Fear Broadcasts',
    description: 'Learn to detect and dismiss collective fear loops',
    phase: 'Phase 2 - Sovereignty Foundations',
    status: 'beta',
    component: UnhookingFromFearBroadcasts
  },
  {
    id: 'earth',
    title: 'Reconnection with Living Earth',
    description: 'Sync your nervous system with Gaia\'s resonance',
    phase: 'Phase 3 - Deep Earth & Collective Coherence',
    status: 'beta',
    component: ReconnectionWithLivingEarth
  },
  {
    id: 'collective',
    title: 'Collective Coherence Circle',
    description: 'Experience shared resonance with others',
    phase: 'Phase 4 - Embodied Learning Ecosystem',
    status: 'beta',
    component: CollectiveCoherenceCircle
  }
];

export default function Liberation() {
  const [currentModule, setCurrentModule] = useState<ModulePhase>('selection');
  const [showTrustIntro, setShowTrustIntro] = useState(true);
  const navigate = useNavigate();

  const handleModuleSelect = (moduleId: string) => {
    setCurrentModule(moduleId as ModulePhase);
  };

  const handleBackToSelection = () => {
    setCurrentModule('selection');
  };

  const getCurrentComponent = () => {
    const module = modules.find(m => m.id === currentModule);
    if (module?.component) {
      const Component = module.component;
      return <Component onExit={handleBackToSelection} />;
    }
    return null;
  };

  if (showTrustIntro) {
    return <TrustIntroduction onNext={() => setShowTrustIntro(false)} />;
  }

  if (currentModule !== 'selection') {
    return getCurrentComponent();
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Sacred Shifter Liberation Modules
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            A four-phase journey through embodied transformation, from individual liberation to collective coherence.
          </p>
          <p className="text-sm text-primary/80 italic">
            Learning at the speed of trust, not the speed of data.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-primary/20 hover:border-primary/40"
              onClick={() => handleModuleSelect(module.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {module.title}
                    </CardTitle>
                    <Badge 
                      variant={module.status === 'available' ? 'default' : 'secondary'}
                      className="mb-2"
                    >
                      {module.status === 'available' ? 'Ready' : 'Beta'}
                    </Badge>
                    <p className="text-sm text-muted-foreground font-medium">
                      {module.phase}
                    </p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    {module.status === 'available' ? (
                      <Play className="w-5 h-5 text-primary" />
                    ) : (
                      <Play className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Journey Progress */}
        <div className="mt-16 p-6 rounded-lg border border-primary/20 bg-primary/5">
          <h2 className="text-xl font-semibold mb-4">Your Liberation Journey</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm">Phase 1: Core Liberation - Foundation of safety and fear dissolution</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary/60"></div>
              <span className="text-sm">Phase 2: Sovereignty Foundations - Reclaim personal agency</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary/40"></div>
              <span className="text-sm">Phase 3: Deep Earth Connection - Planetary resonance sync</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary/20"></div>
              <span className="text-sm">Phase 4: Collective Coherence - Shared embodied experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}