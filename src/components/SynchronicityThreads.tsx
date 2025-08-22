import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuraPlatformIntegration } from '@/hooks/useAuraPlatformIntegration';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Eye, BookOpen, Users, TreePine, ChevronRight } from 'lucide-react';

interface SynchronicityConnection {
  id: string;
  type: 'journal' | 'grove' | 'circles' | 'registry' | 'quantum';
  source: string;
  target: string;
  resonanceScore: number;
  sharedConcepts: string[];
  timestamp: string;
  description: string;
}

interface SynchronicityThreadsProps {
  currentMessages: any[];
  isVisible: boolean;
  onToggle: () => void;
}

export const SynchronicityThreads: React.FC<SynchronicityThreadsProps> = ({
  currentMessages,
  isVisible,
  onToggle
}) => {
  const auraPlatform = useAuraPlatformIntegration();
  const [connections, setConnections] = useState<SynchronicityConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);

  // Detect synchronicity threads in real-time
  useEffect(() => {
    const detectConnections = async () => {
      if (currentMessages.length < 2) return;

      setLoading(true);
      try {
        const recentContent = currentMessages.slice(-5).map(m => m.content);
        
        // Analyze connections across all platform areas
        // Simulate semantic connections for now
        const semanticConnections: any[] = [];

        // Transform into synchronicity connections
        const synchronicities: SynchronicityConnection[] = semanticConnections.map(conn => ({
          id: conn.id,
          type: conn.sourceType as any,
          source: conn.sourceContent.substring(0, 100) + '...',
          target: conn.targetContent.substring(0, 100) + '...',
          resonanceScore: conn.semanticSimilarity,
          sharedConcepts: conn.sharedConcepts || [],
          timestamp: new Date().toISOString(),
          description: generateSynchronicityDescription(conn)
        }));

        setConnections(synchronicities);
      } catch (error) {
        console.error('Failed to detect synchronicity:', error);
      } finally {
        setLoading(false);
      }
    };

    const interval = setInterval(detectConnections, 5000); // Check every 5 seconds
    detectConnections(); // Initial check

    return () => clearInterval(interval);
  }, [currentMessages]);

  const generateSynchronicityDescription = (connection: any): string => {
    const { sourceType, semanticSimilarity, sharedConcepts } = connection;
    
    if (semanticSimilarity > 0.8) {
      return `Deep resonance detected with your ${sourceType} entry - the universe is reflecting your thoughts`;
    } else if (semanticSimilarity > 0.6) {
      return `Meaningful connection found in your ${sourceType} - synchronicity is unfolding`;
    } else if (sharedConcepts?.length > 2) {
      return `Multiple concept alignment with ${sourceType} - pattern recognition active`;
    }
    
    return `Subtle thread connecting to your ${sourceType} journey`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'journal': return <BookOpen className="w-4 h-4" />;
      case 'grove': return <TreePine className="w-4 h-4" />;
      case 'circles': return <Users className="w-4 h-4" />;
      case 'registry': return <Eye className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'journal': return 'bg-blue-500/20 text-blue-400';
      case 'grove': return 'bg-green-500/20 text-green-400';
      case 'circles': return 'bg-purple-500/20 text-purple-400';
      case 'registry': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-primary/20 text-primary';
    }
  };

  const getResonanceIntensity = (score: number) => {
    if (score > 0.8) return 'High Resonance';
    if (score > 0.6) return 'Medium Resonance';
    if (score > 0.4) return 'Subtle Resonance';
    return 'Faint Resonance';
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={isVisible ? "default" : "outline"}
          size="sm"
          onClick={onToggle}
          className="rounded-full h-12 w-12 p-0 shadow-lg backdrop-blur-sm"
        >
          <div className="relative">
            <Zap className="w-5 h-5" />
            {connections.length > 0 && (
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full text-xs font-bold text-black flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {connections.length}
              </motion.div>
            )}
          </div>
        </Button>
      </motion.div>

      {/* Synchronicity Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed right-4 top-20 bottom-20 w-80 z-40"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="h-full bg-background/90 backdrop-blur-md border-primary/20 overflow-hidden">
              <div className="p-4 border-b border-border/20">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Synchronicity Threads
                  </h3>
                  <Button variant="ghost" size="sm" onClick={onToggle}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Live resonance detection across your sacred journey
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading && (
                  <div className="text-center py-8">
                    <motion.div
                      className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Scanning for synchronicities...
                    </p>
                  </div>
                )}

                {!loading && connections.length === 0 && (
                  <div className="text-center py-8">
                    <Zap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      No synchronicity threads detected yet
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Continue your conversation to reveal connections
                    </p>
                  </div>
                )}

                <AnimatePresence>
                  {connections.map((connection) => (
                    <motion.div
                      key={connection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="relative"
                    >
                      <Card 
                        className={`p-3 cursor-pointer transition-all hover:scale-[1.02] ${
                          selectedConnection === connection.id ? 'ring-2 ring-primary/50' : ''
                        }`}
                        onClick={() => setSelectedConnection(
                          selectedConnection === connection.id ? null : connection.id
                        )}
                      >
                        {/* Resonance Pulse Animation */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                          animate={{ x: [-100, 300] }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: Math.random() * 2
                          }}
                        />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={`${getTypeColor(connection.type)} text-xs`}>
                              <div className="flex items-center gap-1">
                                {getTypeIcon(connection.type)}
                                {connection.type}
                              </div>
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {getResonanceIntensity(connection.resonanceScore)}
                            </Badge>
                          </div>

                          <p className="text-sm mb-2">{connection.description}</p>

                          {connection.sharedConcepts.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {connection.sharedConcepts.slice(0, 3).map((concept, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {concept}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {Math.round(connection.resonanceScore * 100)}% match
                            </span>
                            <span>
                              {new Date(connection.timestamp).toLocaleTimeString()}
                            </span>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {selectedConnection === connection.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-3 pt-3 border-t border-border/20"
                              >
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                      Source:
                                    </p>
                                    <p className="text-xs bg-muted/50 p-2 rounded">
                                      {connection.source}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                      Current:
                                    </p>
                                    <p className="text-xs bg-muted/50 p-2 rounded">
                                      {connection.target}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};