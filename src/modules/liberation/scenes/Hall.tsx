import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLiberationState } from '../context/LiberationContext';
import { useSharedGeometries, useSharedMaterials } from './SharedAssets';
import * as THREE from 'three';

export const Hall: React.FC = () => {
  const { state } = useLiberationState();
  const tunnelRef = useRef<THREE.Mesh>(null);
  const materialsRef = useRef<THREE.ShaderMaterial[]>([]);
  const { dissolve } = useSharedMaterials();
  const { tunnel } = useSharedGeometries();

  // Create archetypal silhouettes
  const archetypes = useMemo(() => {
    const positions = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 4 + Math.random() * 2;
      positions.push({
        position: [
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 8,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        opacity: 0.1 + Math.random() * 0.3,
        scale: 0.5 + Math.random() * 0.5,
      });
    }
    return positions;
  }, []);

  useFrame((frameState) => {
    const time = frameState.clock.elapsedTime;
    
    // Update dissolve material
    if (dissolve) {
      dissolve.uniforms.uTime.value = time;
      // Gradually increase threshold to create dissolve effect
      dissolve.uniforms.uThreshold.value = Math.sin(time * 0.5) * 0.3 + 0.5;
    }
    
    // Tunnel rotation and pulse
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z = time * 0.1;
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      tunnelRef.current.scale.setScalar(pulse);
    }
    
    // Update archetype opacity based on proximity simulation
    materialsRef.current.forEach((material, index) => {
      if (material && material.uniforms) {
        const baseOpacity = archetypes[index].opacity;
        const proximity = Math.sin(time * 0.3 + index) * 0.2 + 0.8;
        material.uniforms.uOpacity = { value: baseOpacity * proximity };
      }
    });
  });

  return (
    <group>
      {/* Low-frequency ambient lighting */}
      <ambientLight intensity={0.1} color="#4B0082" />
      <pointLight position={[0, 0, 8]} intensity={0.3} color="#8A2BE2" />
      
      {/* Tunnel geometry */}
      <mesh ref={tunnelRef} geometry={tunnel}>
        <meshStandardMaterial
          color="#2D1B69"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Archetypal silhouettes */}
      {archetypes.map((archetype, index) => (
        <group key={index} position={archetype.position}>
          <mesh scale={archetype.scale}>
            <boxGeometry args={[1, 2, 0.1]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={archetype.opacity}
            />
          </mesh>
          
          {/* Subtle glow around archetypes */}
          <mesh scale={archetype.scale * 1.2}>
            <boxGeometry args={[1.2, 2.2, 0.1]} />
            <meshBasicMaterial
              color="#8A2BE2"
              transparent
              opacity={archetype.opacity * 0.3}
            />
          </mesh>
        </group>
      ))}
      
      {/* Radial pulse rings */}
      {[1, 2, 3].map((ring) => (
        <mesh key={ring} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring * 2, ring * 2 + 0.1, 32]} />
          <meshBasicMaterial
            color="#8A2BE2"
            transparent
            opacity={0.2 - ring * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Particle system for atmospheric depth */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(
              Array.from({ length: 200 }, () => [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
              ]).flat()
            )}
            count={200}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#4B0082"
          size={0.1}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </group>
  );
};