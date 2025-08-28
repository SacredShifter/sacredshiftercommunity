import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Text } from '@react-three/drei';
import * as THREE from 'three';

interface MindfulnessVisualizationProps {
  isActive: boolean;
  thoughtCount: number;
  awareness: number; // 0-1
}

function ThoughtBubbles({ isActive, thoughtCount, awareness }: MindfulnessVisualizationProps) {
  const bubblesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!bubblesRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    
    bubblesRef.current.children.forEach((bubble, index) => {
      // Thoughts float by like clouds
      bubble.position.x = -5 + ((time * 0.5 + index) % 10);
      bubble.position.y = Math.sin(time * 0.3 + index) * 0.5;
      
      // Scale based on awareness - higher awareness makes thoughts smaller/more transparent
      const baseScale = 0.3 + Math.random() * 0.3;
      const awarenessScale = baseScale * (1 - awareness * 0.5);
      bubble.scale.setScalar(awarenessScale);
      
      // Transparency based on awareness
      const material = (bubble as any).material;
      if (material) {
        material.opacity = 0.7 - awareness * 0.4;
      }
    });
  });
  
  return (
    <group ref={bubblesRef}>
      {[...Array(Math.min(thoughtCount, 15))].map((_, i) => (
        <Sphere key={i} args={[0.2, 8, 8]}>
          <meshBasicMaterial 
            color={Math.random() > 0.5 ? "#ffb3ba" : "#bae1ff"} 
            transparent 
            opacity={0.6} 
          />
        </Sphere>
      ))}
    </group>
  );
}

function AwarenessOrb({ awareness }: { awareness: number }) {
  const orbRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!orbRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Orb grows and becomes more radiant with awareness
    const scale = 0.5 + awareness * 0.5;
    orbRef.current.scale.setScalar(scale);
    
    // Gentle rotation
    orbRef.current.rotation.y = time * 0.5;
    
    // Color shifts with awareness
    const material = orbRef.current.material as THREE.MeshBasicMaterial;
    const color = new THREE.Color();
    color.setHSL(0.6 + awareness * 0.2, 0.8, 0.5 + awareness * 0.3);
    material.color.copy(color);
  });
  
  return (
    <Sphere ref={orbRef} args={[1, 32, 32]} position={[0, 0, 0]}>
      <meshBasicMaterial transparent opacity={0.8} />
    </Sphere>
  );
}

function PresentMomentIndicator({ awareness }: { awareness: number }) {
  const indicatorRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!indicatorRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Pulse with awareness level
    const pulse = 1 + Math.sin(time * 2) * awareness * 0.2;
    indicatorRef.current.scale.setScalar(pulse);
  });
  
  return (
    <group ref={indicatorRef}>
      {/* Present moment anchor */}
      <Box args={[0.1, 2, 0.1]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={awareness} />
      </Box>
      <Box args={[2, 0.1, 0.1]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={awareness} />
      </Box>
    </group>
  );
}

function AwarenessText({ awareness }: { awareness: number }) {
  const awarenessLevel = awareness > 0.8 ? 'Deep Presence' :
                        awareness > 0.6 ? 'Mindful Awareness' :
                        awareness > 0.4 ? 'Gentle Noticing' :
                        awareness > 0.2 ? 'Mind Wandering' : 'Lost in Thought';
  
  return (
    <Text
      position={[0, -2.5, 0]}
      fontSize={0.25}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
    >
      {awarenessLevel}
    </Text>
  );
}

export default function MindfulnessVisualization(props: MindfulnessVisualizationProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <ThoughtBubbles {...props} />
        <AwarenessOrb awareness={props.awareness} />
        <PresentMomentIndicator awareness={props.awareness} />
        <AwarenessText awareness={props.awareness} />
      </Canvas>
    </div>
  );
}