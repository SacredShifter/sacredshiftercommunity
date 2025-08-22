import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WheelVisualizationProps {
  isActive: boolean;
  cycleCount: number;
  showExit: boolean;
}

export default function WheelVisualization({ 
  isActive, 
  cycleCount, 
  showExit 
}: WheelVisualizationProps) {
  const wheelRef = useRef<THREE.Group>(null);
  const exitMarkerRef = useRef<THREE.Mesh>(null);
  const particleRingRef = useRef<THREE.Points>(null);

  // Create orbital particles for the wheel
  const particleCount = 60;
  const ringParticles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 2.5;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
      
      // Gradient colors around the wheel
      const hue = (i / particleCount) * 0.3 + 0.5; // Blue to purple range
      colors[i * 3] = Math.sin(hue * Math.PI * 2) * 0.5 + 0.5;
      colors[i * 3 + 1] = Math.cos(hue * Math.PI * 2) * 0.3 + 0.4;
      colors[i * 3 + 2] = 0.8;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!isActive || !wheelRef.current) return;

    const time = state.clock.elapsedTime;
    
    // Rotate the wheel slowly
    wheelRef.current.rotation.z = time * 0.2;
    
    // Animate orbital particles
    if (particleRingRef.current) {
      const positions = particleRingRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const offset = i * 3;
        const baseAngle = (i / particleCount) * Math.PI * 2;
        const angle = baseAngle + time * 0.3;
        const radius = 2.5 + Math.sin(time + i * 0.1) * 0.1;
        
        positions[offset] = Math.cos(angle) * radius;
        positions[offset + 1] = Math.sin(angle) * radius;
        positions[offset + 2] = Math.sin(time * 2 + i * 0.2) * 0.1;
      }
      particleRingRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Exit marker animation
    if (exitMarkerRef.current && showExit) {
      exitMarkerRef.current.visible = true;
      (exitMarkerRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(time * 3) * 0.3 + 0.7;
      exitMarkerRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.1);
    } else if (exitMarkerRef.current) {
      exitMarkerRef.current.visible = false;
    }
  });

  if (!isActive) return null;

  return (
    <group ref={wheelRef} position={[0, 0, 0]}>
      {/* Main wheel ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5, 0.05, 8, 64]} />
        <meshBasicMaterial 
          color="#4a90e2" 
          transparent 
          opacity={0.6}
        />
      </mesh>

      {/* Secondary inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.02, 6, 32]} />
        <meshBasicMaterial 
          color="#60a5fa" 
          transparent 
          opacity={0.4}
          wireframe
        />
      </mesh>

      {/* Orbital particles */}
      <points ref={particleRingRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={ringParticles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={ringParticles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          transparent
          opacity={0.8}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Exit marker - appears after sufficient cycles */}
      {showExit && (
        <mesh 
          ref={exitMarkerRef}
          position={[3, 0, 0]}
          rotation={[0, 0, Math.PI / 4]}
        >
          <cylinderGeometry args={[0.02, 0.02, 0.6]} />
          <meshBasicMaterial 
            color="#ffd700" 
            transparent 
            opacity={0.7}
          />
        </mesh>
      )}

      {/* Radial lines showing choice points */}
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <mesh 
          key={index}
          position={[
            Math.cos(index * Math.PI / 3) * 1.5,
            Math.sin(index * Math.PI / 3) * 1.5,
            0
          ]}
          rotation={[0, 0, index * Math.PI / 3]}
        >
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshBasicMaterial 
            color="#64b5f6" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      ))}

      {/* Sacred symbols at cardinal points */}
      {showExit && (
        <>
          {/* North - Liberation symbol */}
          <mesh position={[0, 2.8, 0]}>
            <torusGeometry args={[0.1, 0.02, 6, 12]} />
            <meshBasicMaterial 
              color="#ffd700" 
              transparent 
              opacity={0.8}
            />
          </mesh>
          
          {/* Sacred text hint */}
          <mesh position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.9}
            />
          </mesh>
        </>
      )}
    </group>
  );
}