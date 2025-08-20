import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Compass, Brain, Heart, Star, TreePine, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WisdomCluster {
  id: string;
  title: string;
  insights: string[];
  resonanceScore: number;
  category: string;
  color: string;
  position: { x: number; y: number; z: number };
  size: number;
  connections: string[];
}

interface ResonanceSpheresProps {
  isVisible: boolean;
  onSphereSelect: (sphere: WisdomCluster) => void;
}

export const ResonanceSpheres: React.FC<ResonanceSpheresProps> = ({
  isVisible,
  onSphereSelect
}) => {
  const { user } = useAuth();
  const [spheres, setSpheres] = useState<WisdomCluster[]>([]);
  const [selectedSphere, setSelectedSphere] = useState<WisdomCluster | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && user) {
      loadWisdomSpheres();
    }
  }, [isVisible, user]);

  const loadWisdomSpheres = async () => {
    try {
      setIsLoading(true);
      
      // Fetch wisdom data from akashic_records
      const { data: records, error } = await supabase
        .from('akashic_records')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Process and cluster the data
      const clusters = generateWisdomClusters(records || []);
      setSpheres(clusters);
    } catch (error) {
      console.error('Error loading wisdom spheres:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWisdomClusters = (records: any[]): WisdomCluster[] => {
    const categories = ['consciousness', 'connection', 'creativity', 'growth', 'wisdom', 'mystery'];
    const colors = ['hsl(269 69% 58%)', 'hsl(196 83% 60%)', 'hsl(324 78% 54%)', 'hsl(143 25% 86%)', 'hsl(60 100% 50%)', 'hsl(0 84% 60%)'];
    
    return categories.map((category, index) => {
      const categoryRecords = records.filter(r => 
        r.type?.includes(category) || 
        JSON.stringify(r.data).toLowerCase().includes(category)
      );

      const insights = categoryRecords
        .slice(0, 5)
        .map(r => r.data?.insight || r.data?.content || `Wisdom from ${category}`)
        .filter(Boolean);

      return {
        id: `sphere-${category}-${index}`,
        title: category.charAt(0).toUpperCase() + category.slice(1) + ' Sphere',
        insights: insights.length > 0 ? insights : [`Emerging ${category} patterns`],
        resonanceScore: Math.random() * 0.4 + 0.6, // 0.6-1.0
        category,
        color: colors[index],
        position: {
          x: (Math.random() - 0.5) * 300,
          y: (Math.random() - 0.5) * 200,
          z: Math.random() * 100
        },
        size: Math.random() * 50 + 80, // 80-130px
        connections: categories.filter(c => c !== category).slice(0, 2)
      };
    });
  };

  const handleSphereClick = (sphere: WisdomCluster) => {
    setSelectedSphere(sphere);
    onSphereSelect(sphere);
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* 3D Sphere Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-[600px] perspective-[1000px] transform-style-preserve-3d"
        style={{ perspective: '1000px' }}
      >
        <AnimatePresence>
          {spheres.map((sphere, index) => (
            <motion.div
              key={sphere.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: sphere.position.x,
                y: sphere.position.y,
                z: sphere.position.z
              }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.8,
                type: "spring"
              }}
              className="absolute cursor-pointer"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate3d(${sphere.position.x}px, ${sphere.position.y}px, ${sphere.position.z}px)`,
                width: sphere.size,
                height: sphere.size
              }}
              onClick={() => handleSphereClick(sphere)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Sphere Glow */}
              <div 
                className="absolute inset-0 rounded-full blur-md opacity-60"
                style={{ 
                  background: `radial-gradient(circle, ${sphere.color}40 0%, transparent 70%)`,
                  animation: `pulse 3s ease-in-out infinite`
                }}
              />
              
              {/* Main Sphere */}
              <div 
                className="relative w-full h-full rounded-full border-2 backdrop-blur-sm flex items-center justify-center"
                style={{ 
                  borderColor: sphere.color,
                  background: `radial-gradient(circle at 30% 30%, ${sphere.color}20, ${sphere.color}05)`
                }}
              >
                {/* Sphere Icon */}
                <div className="text-center">
                  {sphere.category === 'consciousness' && <Brain className="w-6 h-6 mx-auto mb-2" style={{ color: sphere.color }} />}
                  {sphere.category === 'connection' && <Heart className="w-6 h-6 mx-auto mb-2" style={{ color: sphere.color }} />}
                  {sphere.category === 'creativity' && <Sparkles className="w-6 h-6 mx-auto mb-2" style={{ color: sphere.color }} />}
                  {sphere.category === 'growth' && <TreePine className="w-6 h-6 mx-auto mb-2" style={{ color: sphere.color }} />}
                  {sphere.category === 'wisdom' && <Star className="w-6 h-6 mx-auto mb-2" style={{ color: sphere.color }} />}
                  {sphere.category === 'mystery' && <Compass className="w-6 h-6 mx-auto mb-2" style={{ color: sphere.color }} />}
                  
                  <div className="text-xs font-semibold" style={{ color: sphere.color }}>
                    {sphere.category.toUpperCase()}
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className="mt-1 text-xs"
                    style={{ borderColor: sphere.color, color: sphere.color }}
                  >
                    {Math.round(sphere.resonanceScore * 100)}%
                  </Badge>
                </div>

                {/* Orbital Ring */}
                <div 
                  className="absolute inset-0 rounded-full border opacity-30"
                  style={{ 
                    borderColor: sphere.color,
                    animation: `spin 20s linear infinite`
                  }}
                />
              </div>

              {/* Connection Lines */}
              {sphere.connections.map((connectionId, connIndex) => (
                <div
                  key={`connection-${connIndex}`}
                  className="absolute w-px opacity-20"
                  style={{
                    height: '100px',
                    background: sphere.color,
                    top: '50%',
                    left: '50%',
                    transformOrigin: 'top',
                    transform: `rotate(${connIndex * 60}deg)`
                  }}
                />
              ))}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full"
            />
          </div>
        )}
      </div>

      {/* Selected Sphere Detail */}
      <AnimatePresence>
        {selectedSphere && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <Card className="bg-background/95 backdrop-blur-xl border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold" style={{ color: selectedSphere.color }}>
                    {selectedSphere.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSphere(null)}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {selectedSphere.insights.map((insight, index) => (
                    <div 
                      key={index}
                      className="text-sm text-muted-foreground p-2 rounded border-l-2"
                      style={{ borderLeftColor: selectedSphere.color }}
                    >
                      {insight}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="secondary">
                    Resonance: {Math.round(selectedSphere.resonanceScore * 100)}%
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    Connected to {selectedSphere.connections.length} other spheres
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};