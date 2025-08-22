import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BiofeedbackDisplayProps {
  currentPhase: string;
  coherenceLevel: number; // 0-1
  heartRate: number;
}

export default function BiofeedbackDisplay({ 
  currentPhase, 
  coherenceLevel, 
  heartRate 
}: BiofeedbackDisplayProps) {
  const hrvLineRef = useRef<THREE.BufferGeometry>(null);
  const coherenceMeterRef = useRef<THREE.Mesh>(null);
  const hrvDataRef = useRef<number[]>([]);
  const timeRef = useRef(0);

  // Generate HRV wave data
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
    
    // Simulate HRV data based on breath phase and coherence
    const baseHR = heartRate;
    let hrVariation = 0;
    
    switch (currentPhase) {
      case 'inhale':
        hrVariation = Math.sin(timeRef.current * 2) * 5 * coherenceLevel;
        break;
      case 'exhale':
        hrVariation = -Math.sin(timeRef.current * 2) * 3 * coherenceLevel;
        break;
      default:
        hrVariation = Math.sin(timeRef.current * 0.5) * 2 * coherenceLevel;
    }

    const currentHR = baseHR + hrVariation;
    
    // Update HRV data array (keep last 100 points)
    hrvDataRef.current.push(currentHR);
    if (hrvDataRef.current.length > 100) {
      hrvDataRef.current.shift();
    }

    // Update HRV line geometry
    if (hrvLineRef.current && hrvDataRef.current.length > 1) {
      const points: THREE.Vector3[] = [];
      hrvDataRef.current.forEach((hr, index) => {
        const x = (index - 50) * 0.05; // Center the wave
        const y = (hr - baseHR) * 0.02; // Scale the variation
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
      });
      
      hrvLineRef.current.setFromPoints(points);
    }

    // Update coherence meter
    if (coherenceMeterRef.current) {
      const targetScale = 0.5 + (coherenceLevel * 0.5);
      coherenceMeterRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale), 
        0.1
      );
      
      // Color shift based on coherence
      const material = coherenceMeterRef.current.material as THREE.MeshBasicMaterial;
      const hue = coherenceLevel * 0.3; // Green to blue range
      material.color.setHSL(hue + 0.3, 0.8, 0.6);
    }
  });

  return (
    <group position={[-3, 2, 0]}>
      {/* HRV Wave Display */}
      <group position={[0, 0.5, 0]}>
        <Line
          points={[]} // Will be updated in useFrame
          color="#60a5fa"
          lineWidth={2}
          transparent
          opacity={0.8}
        />
        
        {/* HRV Label */}
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.08}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Heart Rate Variability
        </Text>
        
        {/* Current HR Display */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.06}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          {Math.round(heartRate)} BPM
        </Text>
      </group>

      {/* Coherence Meter */}
      <group position={[0, -1, 0]}>
        <mesh ref={coherenceMeterRef}>
          <ringGeometry args={[0.2, 0.3, 32]} />
          <meshBasicMaterial 
            color="#4ade80" 
            transparent 
            opacity={0.7}
          />
        </mesh>
        
        {/* Coherence percentage arc */}
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <ringGeometry 
            args={[0.31, 0.35, 32, 1, 0, Math.PI * 2 * coherenceLevel]} 
          />
          <meshBasicMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.9}
          />
        </mesh>
        
        {/* Coherence Label */}
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.08}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          Coherence
        </Text>
        
        {/* Coherence Percentage */}
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.06}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          {Math.round(coherenceLevel * 100)}%
        </Text>
      </group>

      {/* Breath Phase Indicator */}
      <group position={[0, -2, 0]}>
        <Text
          fontSize={0.1}
          color="#a855f7"
          anchorX="center"
          anchorY="middle"
        >
          {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)}
        </Text>
        
        {/* Phase-specific visual cue */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial 
            color={
              currentPhase === 'inhale' ? '#f97316' :
              currentPhase === 'holdIn' ? '#eab308' :
              currentPhase === 'exhale' ? '#3b82f6' :
              '#6366f1'
            }
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* Background panel */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[2, 3]} />
        <meshBasicMaterial 
          color="#1e293b" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
