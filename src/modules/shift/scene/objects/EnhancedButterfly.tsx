import React, { useState, useRef, useMemo } from 'react';
import { useCursor } from '@react-three/drei';
import { useShiftStore } from '../../state/useShiftStore';
import { onChapterJump } from '../../events';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const EnhancedButterfly: React.FC = () => {
  const [hovered, setHover] = useState(false);
  const { setActiveNode } = useShiftStore();
  const leftWingRef = useRef<THREE.Mesh>(null!);
  const rightWingRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  useCursor(hovered);

  const handleClick = (e: any) => {
    e.stopPropagation();
    setActiveNode('butterfly');
    onChapterJump('butterfly');
  };

  // Particle trail system
  const particleData = useMemo(() => {
    const count = 20;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (leftWingRef.current && rightWingRef.current) {
      const time = state.clock.getElapsedTime();
      const flutter = Math.sin(time * 10) * 0.3;
      
      leftWingRef.current.rotation.z = flutter;
      rightWingRef.current.rotation.z = -flutter;
    }
    
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(time + i) * 0.01;
        positions[i] += Math.cos(time + i) * 0.005;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[4, -2, 0]}>
      {/* Left Wing */}
      <mesh 
        ref={leftWingRef}
        position={[-0.3, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        <planeGeometry args={[0.8, 1.2]} />
        <meshStandardMaterial
          color={hovered ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Right Wing */}
      <mesh 
        ref={rightWingRef}
        position={[0.3, 0, 0]}
      >
        <planeGeometry args={[0.8, 1.2]} />
        <meshStandardMaterial
          color={hovered ? 'hsl(var(--primary))' : 'hsl(var(--accent))'}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Particle Trail */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particleData.positions}
            count={particleData.positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={particleData.colors}
            count={particleData.colors.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.6}
        />
      </points>
    </group>
  );
};