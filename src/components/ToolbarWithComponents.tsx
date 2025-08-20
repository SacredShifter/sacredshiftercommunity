import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Wind, Waves, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIChatBubble } from '@/components/AIChatBubble';
import BreathOfSource from '@/components/BreathOfSource';
import { SacredSoundscape } from '@/components/SacredSoundscape';
import { UIErrorBoundary, AudioErrorBoundary } from '@/components/ErrorBoundary';

export const ToolbarWithComponents = () => {
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const tools = [
    {
      id: 'breath',
      name: 'Breath of Source',
      icon: Wind,
      color: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'ai',
      name: 'AI Assistant', 
      icon: Brain,
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'frequency',
      name: 'Sacred Frequencies',
      icon: Waves,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const toggleComponent = (toolId: string) => {
    setActiveComponent(activeComponent === toolId ? null : toolId);
  };

  return (
    <div className="fixed top-16 right-4 z-50">
      {/* Main Toolbar */}
      <div className="bg-background/20 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl flex items-center gap-2">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          const isActive = activeComponent === tool.id;
          
          return (
            <div key={tool.id} className="relative">
              <Button
                onClick={() => toggleComponent(tool.id)}
                variant="ghost"
                size="sm"
                className={`w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary/20 border border-primary/50 shadow-lg' 
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
                title={tool.name}
              >
                <IconComponent className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-white/80'}`} />
              </Button>

              {/* Component expands from this specific button */}
              <AnimatePresence>
                {activeComponent === tool.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 z-50"
                    style={{ 
                      right: index === tools.length - 1 ? '0' : 'auto',
                      left: index === 0 ? '0' : 'auto',
                      transform: index === 1 ? 'translateX(-50%)' : 'none',
                      maxWidth: 'calc(100vw - 2rem)',
                      maxHeight: 'calc(100vh - 8rem)'
                    }}
                  >
                    {/* Breath of Source Component */}
                    {tool.id === 'breath' && (
                      <div className="relative">
                        <AudioErrorBoundary>
                          <BreathOfSource />
                        </AudioErrorBoundary>
                      </div>
                    )}

                    {/* AI Assistant Component */}
                    {tool.id === 'ai' && (
                      <div className="relative">
                        <UIErrorBoundary>
                          <AIChatBubble />
                        </UIErrorBoundary>
                      </div>
                    )}

                    {/* Sacred Soundscape Component */}
                    {tool.id === 'frequency' && (
                      <div className="relative">
                        <AudioErrorBoundary>
                          <SacredSoundscape />
                        </AudioErrorBoundary>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        
        {/* Close button when something is active */}
        {activeComponent && (
          <Button
            onClick={() => setActiveComponent(null)}
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/50 hover:bg-red-500/30"
          >
            <X className="h-4 w-4 text-red-400" />
          </Button>
        )}
      </div>
    </div>
  );
};