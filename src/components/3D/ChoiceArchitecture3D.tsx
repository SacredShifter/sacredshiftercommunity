import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line, Box } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Eye, Brain, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

interface ChoiceNode {
  id: string;
  position: [number, number, number];
  type: 'decision' | 'outcome' | 'consequence';
  label: string;
  active: boolean;
  color: string;
}

interface ChoicePathProps {
  nodes: ChoiceNode[];
  currentPath: string[];
}

function ChoicePath({ nodes, currentPath }: ChoicePathProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Create path lines
  const pathLines = currentPath.slice(0, -1).map((nodeId, index) => {
    const currentNode = nodes.find(n => n.id === nodeId);
    const nextNode = nodes.find(n => n.id === currentPath[index + 1]);
    
    if (!currentNode || !nextNode) return null;
    
    return (
      <Line
        key={`${nodeId}-${nextNode.id}`}
        points={[currentNode.position, nextNode.position]}
        color="#6366f1"
        lineWidth={3}
      />
    );
  }).filter(Boolean);

  return (
    <group ref={groupRef}>
      {/* Render nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.position}>
          <mesh>
            {node.type === 'decision' ? (
              <Box args={[0.8, 0.8, 0.8]}>
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.active ? node.color : '#000000'}
                  emissiveIntensity={node.active ? 0.3 : 0}
                  transparent
                  opacity={node.active ? 1 : 0.6}
                />
              </Box>
            ) : (
              <Sphere args={[0.4, 16, 16]}>
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.active ? node.color : '#000000'}
                  emissiveIntensity={node.active ? 0.2 : 0}
                  transparent
                  opacity={node.active ? 1 : 0.4}
                />
              </Sphere>
            )}
          </mesh>
          
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {node.label}
          </Text>
        </group>
      ))}

      {/* Render path lines */}
      {pathLines}

      {/* Central axis */}
      <Line
        points={[[0, -8, 0], [0, 8, 0]]}
        color="#ffffff"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
    </group>
  );
}

export default function ChoiceArchitecture3D() {
  const [currentScenario, setCurrentScenario] = useState('trust');
  const [selectedPath, setSelectedPath] = useState<string[]>(['start']);
  const [showConsequences, setShowConsequences] = useState(false);

  const scenarios = {
    trust: {
      title: 'Trust Building',
      description: 'Navigate a trust-building scenario',
      nodes: [
        { id: 'start', position: [0, 0, 0] as [number, number, number], type: 'decision' as const, label: 'New Person', active: true, color: '#10b981' },
        { id: 'assess', position: [-3, 2, 0] as [number, number, number], type: 'decision' as const, label: 'Assess', active: false, color: '#3b82f6' },
        { id: 'openup', position: [3, 2, 0] as [number, number, number], type: 'decision' as const, label: 'Open Up', active: false, color: '#8b5cf6' },
        { id: 'boundary', position: [-5, 4, 0] as [number, number, number], type: 'outcome' as const, label: 'Set Boundary', active: false, color: '#f59e0b' },
        { id: 'connect', position: [-1, 4, 0] as [number, number, number], type: 'outcome' as const, label: 'Test Waters', active: false, color: '#06b6d4' },
        { id: 'vulnerable', position: [1, 4, 0] as [number, number, number], type: 'outcome' as const, label: 'Share Story', active: false, color: '#ec4899' },
        { id: 'invest', position: [5, 4, 0] as [number, number, number], type: 'outcome' as const, label: 'Full Trust', active: false, color: '#84cc16' },
      ]
    },
    sovereignty: {
      title: 'Sovereignty Moment',
      description: 'Practice sovereign choice-making',
      nodes: [
        { id: 'start', position: [0, 0, 0] as [number, number, number], type: 'decision' as const, label: 'Pressure', active: true, color: '#ef4444' },
        { id: 'resist', position: [-3, 2, 0] as [number, number, number], type: 'decision' as const, label: 'Resist', active: false, color: '#f97316' },
        { id: 'pause', position: [0, 2, 0] as [number, number, number], type: 'decision' as const, label: 'Pause', active: false, color: '#eab308' },
        { id: 'comply', position: [3, 2, 0] as [number, number, number], type: 'decision' as const, label: 'Comply', active: false, color: '#6b7280' },
        { id: 'conflict', position: [-5, 4, 0] as [number, number, number], type: 'outcome' as const, label: 'Conflict', active: false, color: '#dc2626' },
        { id: 'boundary', position: [-1, 4, 0] as [number, number, number], type: 'outcome' as const, label: 'Clear No', active: false, color: '#059669' },
        { id: 'choice', position: [1, 4, 0] as [number, number, number], type: 'outcome' as const, label: 'Conscious Yes', active: false, color: '#0d9488' },
        { id: 'resentment', position: [5, 4, 0] as [number, number, number], type: 'outcome' as const, label: 'Resentment', active: false, color: '#7c2d12' },
      ]
    }
  };

  const currentNodes = scenarios[currentScenario as keyof typeof scenarios].nodes;

  const handleNodeSelection = (nodeId: string) => {
    const node = currentNodes.find(n => n.id === nodeId);
    if (!node) return;

    // Update active states
    const updatedNodes = currentNodes.map(n => ({
      ...n,
      active: n.id === nodeId || selectedPath.includes(n.id)
    }));

    // Add to path if not already there
    if (!selectedPath.includes(nodeId)) {
      setSelectedPath([...selectedPath, nodeId]);
    }

    // Show consequences after making choices
    if (node.type === 'outcome') {
      setShowConsequences(true);
    }
  };

  const resetScenario = () => {
    setSelectedPath(['start']);
    setShowConsequences(false);
  };

  const getPathAnalysis = () => {
    const pathLength = selectedPath.length;
    if (pathLength < 2) return null;

    const hasDecisionNode = selectedPath.some(id => 
      currentNodes.find(n => n.id === id)?.type === 'decision'
    );
    
    const hasOutcomeNode = selectedPath.some(id => 
      currentNodes.find(n => n.id === id)?.type === 'outcome'
    );

    return {
      pathLength,
      hasDecisionNode,
      hasOutcomeNode,
      sovereignty: hasDecisionNode && hasOutcomeNode ? 85 : 45,
      awareness: pathLength > 2 ? 90 : 60
    };
  };

  const analysis = getPathAnalysis();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <GitBranch className="h-5 w-5" />
              Choice Architecture Explorer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Scenario</label>
              <div className="flex gap-1">
                <Button
                  variant={currentScenario === 'trust' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentScenario('trust')}
                  className="flex-1 text-xs"
                >
                  Trust
                </Button>
                <Button
                  variant={currentScenario === 'sovereignty' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentScenario('sovereignty')}
                  className="flex-1 text-xs"
                >
                  Sovereignty
                </Button>
              </div>
            </div>

            <div className="text-sm">
              <p className="font-medium mb-1">{scenarios[currentScenario as keyof typeof scenarios].title}</p>
              <p className="text-muted-foreground text-xs">{scenarios[currentScenario as keyof typeof scenarios].description}</p>
            </div>

            <div className="space-y-2">
              <Button onClick={resetScenario} variant="outline" size="sm" className="w-full">
                Reset Scenario
              </Button>
              
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Decision Points (Cubes)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Outcomes (Spheres)</span>
                </div>
              </div>
            </div>

            {analysis && (
              <div className="space-y-2 border-t pt-2">
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span>Path Sovereignty</span>
                    <Badge variant="outline">{analysis.sovereignty}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Choice Awareness</span>
                    <Badge variant="outline">{analysis.awareness}%</Badge>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 right-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              How to Navigate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium mb-1">1. Observe the Choice Points</p>
              <p className="text-muted-foreground text-xs">Each cube represents a decision moment</p>
            </div>
            <div>
              <p className="font-medium mb-1">2. Click to Choose Path</p>
              <p className="text-muted-foreground text-xs">See how choices lead to outcomes</p>
            </div>
            <div>
              <p className="font-medium mb-1">3. Notice Consequences</p>
              <p className="text-muted-foreground text-xs">Spheres show the results of your choices</p>
            </div>
            <div>
              <p className="font-medium mb-1">4. Analyze Your Pattern</p>
              <p className="text-muted-foreground text-xs">Review sovereignty and awareness scores</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [8, 6, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#6366f1" />
        
        <ChoicePath nodes={currentNodes} currentPath={selectedPath} />
        
        <OrbitControls 
          enablePan={false} 
          maxDistance={15} 
          minDistance={6}
          onClick={(e) => {
            // Handle node selection - simplified for demo
            console.log('Canvas clicked');
          }}
        />
      </Canvas>

      {/* Bottom Insight */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/40 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/20 max-w-2xl"
        >
          <p className="text-center text-primary font-medium">
            Every choice creates your reality. Sovereignty is the conscious participation in your own becoming.
          </p>
        </motion.div>
      </div>
    </div>
  );
}