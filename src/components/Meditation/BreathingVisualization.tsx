import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Ring, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BreathingVisualizationProps {
  isActive: boolean;
  phase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
  progress: number;
  intensity?: number;
}

function BreathOrb({ isActive, phase, progress, intensity = 0.5 }: BreathingVisualizationProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    
    // Scale based on breathing phase
    let targetScale = 1;
    switch (phase) {
      case 'inhale':
        targetScale = 1 + (progress * intensity);
        break;
      case 'hold1':
        targetScale = 1 + intensity;
        break;
      case 'exhale':
        targetScale = 1 + (intensity * (1 - progress));
        break;
      case 'hold2':
        targetScale = 1;
        break;
    }
    
    // Smooth scaling animation
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.05);
    glowRef.current.scale.lerp(new THREE.Vector3(targetScale * 1.2, targetScale * 1.2, targetScale * 1.2), 0.03);
    
    // Gentle rotation
    meshRef.current.rotation.y = time * 0.3;
    
    // Color transition based on phase
    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
    
    if (phase === 'inhale') {
      material.color.lerp(new THREE.Color(0x4facfe), 0.05);
      glowMaterial.color.lerp(new THREE.Color(0x00f2fe), 0.05);
    } else if (phase === 'exhale') {
      material.color.lerp(new THREE.Color(0xff9a8b), 0.05);
      glowMaterial.color.lerp(new THREE.Color(0xffecd2), 0.05);
    } else {
      material.color.lerp(new THREE.Color(0xd299c2), 0.05);
      glowMaterial.color.lerp(new THREE.Color(0xfef9d7), 0.05);
    }
  });
  
  return (
    <group>
      {/* Glow effect */}
      <Sphere ref={glowRef} args={[1.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial transparent opacity={0.2} color="#4facfe" />
      </Sphere>
      
      {/* Main orb */}
      <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#4facfe" transparent opacity={0.8} />
      </Sphere>
      
      {/* Inner light */}
      <Sphere args={[0.7, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
      </Sphere>
    </group>
  );
}

function BreathingRings({ isActive, phase, progress }: Omit<BreathingVisualizationProps, 'intensity'>) {
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!ringsRef.current || !isActive) return;
    
    const time = state.clock.getElapsedTime();
    
    ringsRef.current.children.forEach((ring, index) => {
      const offset = index * 0.3;
      const scale = 1 + Math.sin(time * 2 + offset) * 0.1;
      ring.scale.setScalar(scale);
      ring.rotation.z = time * (0.5 + index * 0.1);
    });
  });
  
  return (
    <group ref={ringsRef}>
      {[...Array(3)].map((_, i) => (
        <Ring
          key={i}
          args={[1.5 + i * 0.3, 1.7 + i * 0.3, 32]}
          position={[0, 0, -0.1 - i * 0.05]}
          rotation={[0, 0, i * Math.PI / 3]}
        >
          <meshBasicMaterial 
            color={i === 0 ? "#4facfe" : i === 1 ? "#00f2fe" : "#d299c2"} 
            transparent 
            opacity={0.4 - i * 0.1} 
          />
        </Ring>
      ))}
    </group>
  );
}

function PhaseText({ phase }: { phase: string }) {
  const textColor = useMemo(() => {
    switch (phase) {
      case 'inhale': return '#4facfe';
      case 'hold1': return '#d299c2';
      case 'exhale': return '#ff9a8b';
      case 'hold2': return '#fef9d7';
      default: return '#ffffff';
    }
  }, [phase]);
  
  return (
    <Text
      position={[0, -2.5, 0]}
      fontSize={0.3}
      color={textColor}
      anchorX="center"
      anchorY="middle"
    >
      {phase.toUpperCase()}
    </Text>
  );
}

export default function BreathingVisualization(props: BreathingVisualizationProps) {
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <BreathOrb {...props} />
        <BreathingRings {...props} />
        <PhaseText phase={props.phase} />
      </Canvas>
    </div>
  );
}