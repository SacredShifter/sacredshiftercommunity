import React, { useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

// Define a simple Directed Acyclic Graph (DAG)
const nodes = [
  { id: 'A', position: new THREE.Vector3(-3, 2, 0) },
  { id: 'B', position: new THREE.Vector3(-1, 0, 0) },
  { id: 'C', position: new THREE.Vector3(1, 0, 0) },
  { id: 'D', position: new THREE.Vector3(3, 2, 0) },
  { id: 'E', position: new THREE.Vector3(-1, -2, 0) },
  { id: 'F', position: new THREE.Vector3(1, -2, 0) },
];

const edges = [
  ['A', 'B'], ['A', 'C'],
  ['B', 'E'], ['C', 'E'], ['C', 'F'],
  ['D', 'C'],
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

      if (newActiveNodes.has(currentId)) {
        newActiveNodes.delete(currentId);
      } else {
        newActiveNodes.add(currentId);
      }

      const children = edges.filter(([parent]) => parent === currentId).map(([, child]) => child);
      queue.push(...children);
    }
    setActiveNodes(newActiveNodes);
  };

  return (
    <group>
      {nodes.map(node => (
        <Sphere
          key={node.id}
          position={node.position}
          args={[0.4, 32, 32]}
          onClick={() => handleNodeClick(node.id)}
        >
          <meshStandardMaterial
            color={activeNodes.has(node.id) ? 'purple' : 'white'}
            emissive={activeNodes.has(node.id) ? 'purple' : 'black'}
            emissiveIntensity={activeNodes.has(node.id) ? 2 : 0}
          />
        </Sphere>
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

const SceneContent = () => {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[1, 1, 5]} />
            <CausalGraph />
        </>
    )
}

export default function CauseEffect() {
  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <color attach="background" args={["#0b0c10"]} />
        <SceneContent />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-3 rounded w-96">
        <h2 className="text-xl text-white">The Principle of Cause & Effect</h2>
        <p className="text-xs opacity-80 text-white">"Every cause has its effect; every effect has its cause. Click a node to see the ripple effect."</p>
      </div>
    </div>
  );
}
