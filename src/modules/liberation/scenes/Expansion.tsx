import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import { useLiberationState } from '../context/LiberationContext';
import * as THREE from 'three';

export const Expansion: React.FC = () => {
  const { state } = useLiberationState();
  const starsRef = useRef<THREE.Points>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  
  // Create starfield
  const starfield = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      // Distribute stars in sphere
      const radius = 40 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Star colors
      const starColor = new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.8, 0.9);
      colors[i * 3] = starColor.r;
      colors[i * 3 + 1] = starColor.g;
      colors[i * 3 + 2] = starColor.b;
    }
    
    return { positions, colors };
  }, []);
  
  // Waypoints for exploration
  const waypoints = useMemo(() => [
    { position: [10, 5, -10], message: "You are eternal consciousness" },
    { position: [-8, -3, 15], message: "Death is transformation, not ending" },
    { position: [5, -10, 8], message: "Fear dissolves in presence" },
    { position: [-12, 8, -5], message: "You are the witness of all experience" },
  ], []);

  useFrame((frameState) => {
    const time = frameState.clock.elapsedTime;
    
    // Gentle starfield rotation
    if (starsRef.current) {
      starsRef.current.rotation.y = time * 0.01;
      starsRef.current.rotation.x = Math.sin(time * 0.005) * 0.1;
    }
    
    // Earth breathing motion
    if (earthRef.current) {
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      earthRef.current.scale.setScalar(scale);
      earthRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group>
      {/* Soft ambient light */}
      <ambientLight intensity={0.3} color="#87CEEB" />
      <directionalLight position={[10, 10, 5]} intensity={0.4} color="#FFF8DC" />
      
      {/* Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={starfield.positions}
            count={2000}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={starfield.colors}
            count={2000}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.8}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          vertexColors
        />
      </points>
      
      {/* Earth as friend */}
      <Sphere ref={earthRef} args={[3, 32, 32]} position={[0, -15, -20]}>
        <meshStandardMaterial
          color="#4169E1"
          transparent
          opacity={0.8}
          emissive="#1E90FF"
          emissiveIntensity={0.2}
        />
      </Sphere>
      
      {/* Aurora-like volumes */}
      {[1, 2, 3].map((aurora) => (
        <mesh
          key={aurora}
          position={[
            Math.sin(aurora * 2) * 20,
            Math.cos(aurora * 3) * 15,
            -30 + aurora * 5
          ]}
          rotation={[Math.PI / 4, aurora, 0]}
        >
          <planeGeometry args={[15, 8]} />
          <meshBasicMaterial
            color={aurora === 1 ? "#00FF7F" : aurora === 2 ? "#FF69B4" : "#9370DB"}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      
      {/* Waypoints */}
      {waypoints.map((waypoint, index) => (
        <group key={index} position={waypoint.position as [number, number, number]}>
          <Sphere args={[0.5, 16, 16]}>
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.6}
            />
          </Sphere>
          <Text
            position={[0, 2, 0]}
            fontSize={0.4}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Regular.woff"
            maxWidth={8}
            textAlign="center"
          >
            {waypoint.message}
          </Text>
        </group>
      ))}
      
      {/* Main instruction */}
      <Text
        position={[0, 8, 0]}
        fontSize={0.8}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Medium.woff"
        maxWidth={15}
        textAlign="center"
      >
        Without fear of death, there is no fear of life.
        Explore.
      </Text>
    </group>
  );
};