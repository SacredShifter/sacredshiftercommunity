import React, { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'

const nodes = [
  { id: 'A', position: new THREE.Vector3(-3, 2, 0) }, { id: 'B', position: new THREE.Vector3(-1, 0, 0) },
  { id: 'C', position: new THREE.Vector3(1, 0, 0) }, { id: 'D', position: new THREE.Vector3(3, 2, 0) },
  { id: 'E', position: new THREE.Vector3(-1, -2, 0) }, { id: 'F', position: new THREE.Vector3(1, -2, 0) },
];
const edges = [
  ['A', 'B'], ['A', 'C'], ['B', 'E'], ['C', 'E'], ['C', 'F'], ['D', 'C'],
];

const CausalGraph = () => {
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set(['A']));
  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), []);

  const handleNodeClick = (nodeId: string) => {
    const newActiveNodes = new Set(activeNodes);
    const queue = [nodeId];
    const visited = new Set<string>();
    while(queue.length > 0) {
      const currentId = queue.shift()!;
      if(visited.has(currentId)) continue;
      visited.add(currentId);
      if (newActiveNodes.has(currentId)) newActiveNodes.delete(currentId);
      else newActiveNodes.add(currentId);
      const children = edges.filter(([parent]) => parent === currentId).map(([, child]) => child);
      queue.push(...children);
    }
    setActiveNodes(newActiveNodes);
  };

  return (
    <group>
      {nodes.map(node => (
        <mesh key={node.id} position={node.position} onClick={() => handleNodeClick(node.id)}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color={activeNodes.has(node.id) ? 'purple' : 'white'} emissive={activeNodes.has(node.id) ? 'purple' : 'black'} emissiveIntensity={activeNodes.has(node.id) ? 2 : 0} />
        </mesh>
      ))}
      {edges.map(([startId, endId], i) => {
        const start = nodeMap.get(startId)?.position;
        const end = nodeMap.get(endId)?.position;
        if (!start || !end) return null;
        return <Line key={i} points={[start, end]} color="gray" lineWidth={2} />;
      })}
    </group>
  );
};

const SceneContent = () => (
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[1, 1, 5]} />
    <CausalGraph />
  </>
)

export default function CauseEffect() {
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <color attach="background" args={["#0b0c10"]} />
        <SceneContent />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-4 rounded-lg w-96 border border-white/10">
        <h2 className="text-xl text-white font-bold">The Principle of Cause & Effect</h2>
        <p className="text-xs opacity-80 pb-2">"Every Cause has its Effect; every Effect has its Cause..."</p>

        <p className="text-sm text-white/90">Click a node to see the ripple effect through the causal chain.</p>

        <Button onClick={() => setShowInfo(!showInfo)} variant="outline" size="sm" className="w-full mt-2">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn More
            <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showInfo ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
        {showInfo && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-4 mt-4 border-t border-white/10 text-sm text-white/90 space-y-3">
                    <p>This principle explains that nothing merely "happens." Everything happens according to law; chance is but a name for law not recognized. There are many planes of causation, but nothing escapes the Law.</p>
                    <p><strong className="text-purple-300">Application:</strong> Instead of being a passive effect, become an active cause. Trace the causes behind events in your life to understand them. To change an effect, you must change the cause. Master your moods and thoughts to become a master of your reality.</p>
                    <p><strong className="text-purple-300">Reflection:</strong> In what areas of my life am I acting as a "pawn" (an effect) versus a "player" (a cause)? What single cause can I initiate today to create a desired effect tomorrow?</p>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
