import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BodyScanVisualizationProps {
  isActive: boolean;
  currentBodyPart: string;
  scanProgress: number; // 0-1
  relaxationLevel: number; // 0-1
}

const bodyParts = [
  { name: 'Toes', position: [0, -3, 0] },
  { name: 'Feet', position: [0, -2.5, 0] },
  { name: 'Ankles', position: [0, -2, 0] },
  { name: 'Calves', position: [0, -1.5, 0] },
  { name: 'Knees', position: [0, -1, 0] },
  { name: 'Thighs', position: [0, -0.5, 0] },
  { name: 'Hips', position: [0, 0, 0] },
  { name: 'Abdomen', position: [0, 0.5, 0] },
  { name: 'Chest', position: [0, 1, 0] },
  { name: 'Shoulders', position: [0, 1.5, 0] },
  { name: 'Arms', position: [0, 1.2, 0] },
  { name: 'Neck', position: [0, 2, 0] },
  { name: 'Face', position: [0, 2.5, 0] },
  { name: 'Head', position: [0, 3, 0] }
];

function BodyOutline({ currentBodyPart, scanProgress, relaxationLevel }: Omit<BodyScanVisualizationProps, 'isActive'>) {
  const bodyRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!bodyRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    bodyRef.current.children.forEach((part, index) => {
      const bodyPart = bodyParts[index];
      const isCurrentPart = bodyPart.name === currentBodyPart;
      
      // Highlighting current body part
      const targetScale = isCurrentPart ? 1.3 + Math.sin(time * 3) * 0.1 : 1;
      part.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Color based on relaxation and current part
      const material = (part as any).material;
      if (material) {
        if (isCurrentPart) {
          // Current part glows
          material.color.lerp(new THREE.Color(0x00ff88), 0.1);
          material.opacity = 0.8 + Math.sin(time * 2) * 0.2;
        } else {
          // Other parts show relaxation level
          const relaxedColor = new THREE.Color(0x4facfe);
          const tenseColor = new THREE.Color(0xff6b6b);
          material.color.lerp(relaxedColor.lerp(tenseColor, 1 - relaxationLevel), 0.05);
          material.opacity = 0.3 + relaxationLevel * 0.3;
        }
      }
    });
  });
  
  return (
    <group ref={bodyRef}>
      {bodyParts.map((part, index) => (
        <Cylinder
          key={part.name}
          args={[0.15, 0.15, 0.3, 8]}
          position={part.position as [number, number, number]}
        >
          <meshBasicMaterial transparent />
        </Cylinder>
      ))}
    </group>
  );
}

function ScanningWave({ scanProgress }: { scanProgress: number }) {
  const waveRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (!waveRef.current) return;
    
    // Move the scanning wave based on progress
    const totalHeight = 6; // from -3 to +3
    const yPosition = -3 + (scanProgress * totalHeight);
    waveRef.current.position.y = yPosition;
  });
  
  return (
    <Cylinder
      ref={waveRef}
      args={[0.8, 0.8, 0.05, 32]}
      position={[0, -3, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
    </Cylinder>
  );
}

function RelaxationIndicators({ relaxationLevel }: { relaxationLevel: number }) {
  const particlesRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    particlesRef.current.children.forEach((particle, index) => {
      const offset = index * 0.3;
      
      // Floating relaxation particles
      particle.position.y += Math.sin(time + offset) * 0.01;
      particle.position.x = Math.cos(time * 0.5 + offset) * 2;
      particle.position.z = Math.sin(time * 0.5 + offset) * 0.5;
      
      // Opacity based on relaxation level
      (particle as any).material.opacity = relaxationLevel * 0.8;
    });
  });
  
  const particleCount = Math.floor(relaxationLevel * 20);
  
  return (
    <group ref={particlesRef}>
      {[...Array(particleCount)].map((_, i) => (
        <Sphere key={i} args={[0.03, 6, 6]}>
          <meshBasicMaterial color="#b19cd9" transparent />
        </Sphere>
      ))}
    </group>
  );
}

function BodyPartText({ currentBodyPart, relaxationLevel }: { currentBodyPart: string; relaxationLevel: number }) {
  const relaxationText = relaxationLevel > 0.8 ? 'Deeply Relaxed' :
                        relaxationLevel > 0.6 ? 'Very Relaxed' :
                        relaxationLevel > 0.4 ? 'Relaxed' :
                        relaxationLevel > 0.2 ? 'Releasing' : 'Tense';
  
  return (
    <group>
      <Text
        position={[0, -4, 0]}
        fontSize={0.3}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        {currentBodyPart}
      </Text>
      <Text
        position={[0, -4.5, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {relaxationText}
      </Text>
    </group>
  );
}

export default function BodyScanVisualization(props: BodyScanVisualizationProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-teal-500/10 to-cyan-500/10">
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} />
        
        <BodyOutline {...props} />
        <ScanningWave scanProgress={props.scanProgress} />
        <RelaxationIndicators relaxationLevel={props.relaxationLevel} />
        <BodyPartText 
          currentBodyPart={props.currentBodyPart} 
          relaxationLevel={props.relaxationLevel} 
        />
      </Canvas>
    </div>
  );
}
