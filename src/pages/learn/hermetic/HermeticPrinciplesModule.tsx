import React, { useState, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Brain, Zap, GitBranch, Waves, Repeat, Contrast, Atom } from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Slogan } from '@/components/ui/Slogan';

// Lazy load the individual principle components
const Mentalism = React.lazy(() => import('./Mentalism'));
const Correspondence = React.lazy(() => import('./Correspondence'));
const Vibration = React.lazy(() => import('./Vibration'));
const Polarity = React.lazy(() => import('./Polarity'));
const Rhythm = React.lazy(() => import('./Rhythm'));
const CauseEffect = React.lazy(() => import('./CauseEffect'));
const Gender = React.lazy(() => import('./Gender'));

const principles = [
  { id: 'mentalism', title: 'The Principle of Mentalism', component: Mentalism, icon: Brain, description: '"The All is Mind; The Universe is Mental."' },
  { id: 'correspondence', title: 'The Principle of Correspondence', component: Correspondence, icon: GitBranch, description: '"As above, so below; as below, so above."' },
  { id: 'vibration', title: 'The Principle of Vibration', component: Vibration, icon: Waves, description: '"Nothing rests; everything moves; everything vibrates."' },
  { id: 'polarity', title: 'The Principle of Polarity', component: Polarity, icon: Contrast, description: '"Everything is dual; everything has poles..."' },
  { id: 'rhythm', title: 'The Principle of Rhythm', component: Rhythm, icon: Repeat, description: '"Everything flows, out and in..."' },
  { id: 'cause-effect', title: 'The Principle of Cause & Effect', component: CauseEffect, icon: Zap, description: '"Every Cause has its Effect; every Effect has its Cause..."' },
  { id: 'gender', title: 'The Principle of Gender', component: Gender, icon: Atom, description: '"Gender is in everything; everything has its Masculine and Feminine Principles..."' },
];

export default function HermeticPrinciplesModule() {
  const [selectedPrinciple, setSelectedPrinciple] = useState<React.ComponentType | null>(null);

  if (selectedPrinciple) {
    const PrincipleComponent = selectedPrinciple;
    return (
      <div className="h-full w-full relative bg-black">
        <div className="fixed top-4 left-4 z-50">
          <Button onClick={() => setSelectedPrinciple(null)} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Principles
          </Button>
        </div>
        <ErrorBoundary name={`Principle-${selectedPrinciple.displayName}`}>
          <Suspense fallback={
            <div className="h-full w-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }>
            <PrincipleComponent />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto bg-black">
      <Slogan variant="watermark" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-sacred bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          The Seven Hermetic Principles
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the seven universal laws as described in The Kybalion. Each principle is an interactive 3D experience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map((principle, index) => (
          <motion.div
            key={principle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 border-2 border-transparent hover:border-purple-500/20 bg-background/50"
              onClick={() => setSelectedPrinciple(() => principle.component)}
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <principle.icon className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-purple-400 transition-colors">
                  {principle.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground italic">
                  {principle.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
