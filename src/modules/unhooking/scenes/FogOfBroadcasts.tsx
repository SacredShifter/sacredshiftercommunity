import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useUnhookingState } from '../context/UnhookingContext';
import * as THREE from 'three';

const fearBroadcasts = [
  "You're not safe",
  "The world is ending",
  "You can't trust anyone",
  "Everything is falling apart",
  "You're not enough",
  "There's no hope",
  "You're in danger",
  "Everyone is out to get you"
];

export const FogOfBroadcasts: React.FC = () => {
  const { state, send } = useUnhookingState();
  const fogRef = useRef<THREE.Points>(null);
  const fragmentsRef = useRef<THREE.Group>(null);
  const { fragmentsCleared, totalFragments, fogIntensity } = state.context;

  // Generate floating text fragments
  const fragments = useMemo(() => {
    return fearBroadcasts.map((text, i) => ({
      id: i,
      text,
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10
      ] as [number, number, number],
      cleared: i < fragmentsCleared
    }));
  }, [fragmentsCleared]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate fog
    if (fogRef.current) {
      fogRef.current.rotation.y = time * 0.01;
      const material = fogRef.current.material as THREE.PointsMaterial;
      material.opacity = fogIntensity * 0.8;
    }
    
    // Float fragments
    if (fragmentsRef.current) {
      fragmentsRef.current.children.forEach((child, i) => {
        child.position.y += Math.sin(time + i) * 0.01;
        child.rotation.y = time * 0.1 + i;
      });
    }
  });

  const handleFragmentClick = (fragmentId: number) => {
    if (fragmentId >= fragmentsCleared) {
      send({ type: 'CLEAR_FRAGMENT' });
    }
  };

  const handleNext = () => {
    if (fragmentsCleared >= totalFragments) {
      send({ type: 'NEXT' });
    }
  };

  return (
    <group>
      {/* Dark, oppressive lighting */}
      <ambientLight intensity={0.1} color="#800000" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#FF4500" />
      
      {/* Fog particles */}
      <points ref={fogRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={1000}
            array={new Float32Array(
              Array.from({ length: 3000 }, () => (Math.random() - 0.5) * 50)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#696969"
          transparent
          opacity={fogIntensity * 0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Floating text fragments */}
      <group ref={fragmentsRef}>
        {fragments.map((fragment) => (
          <group key={fragment.id} position={fragment.position}>
            {!fragment.cleared && (
              <>
                <mesh
                  onClick={() => handleFragmentClick(fragment.id)}
                  onPointerOver={() => document.body.style.cursor = 'pointer'}
                  onPointerOut={() => document.body.style.cursor = 'default'}
                >
                  <planeGeometry args={[4, 1]} />
                  <meshBasicMaterial
                    color="#FF6B6B"
                    transparent
                    opacity={0.3}
                    side={THREE.DoubleSide}
                  />
                </mesh>
                <Text
                  position={[0, 0, 0.1]}
                  fontSize={0.3}
                  color="#FFFFFF"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={4}
                  textAlign="center"
                >
                  {fragment.text}
                </Text>
              </>
            )}
          </group>
        ))}
      </group>
      
      {/* Progress indicator */}
      <Text
        position={[0, 7, 0]}
        fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={16}
        textAlign="center"
      >
        Identify what is "not yours" - Click to dismiss: {fragmentsCleared}/{totalFragments}
      </Text>
      
      {/* Next button when ready */}
      {fragmentsCleared >= totalFragments && (
        <mesh
          position={[0, -5, 0]}
          onClick={handleNext}
          onPointerOver={() => document.body.style.cursor = 'pointer'}
          onPointerOut={() => document.body.style.cursor = 'default'}
        >
          <boxGeometry args={[3, 1, 0.2]} />
          <meshBasicMaterial color="#32CD32" />
          <Text
            position={[0, 0, 0.2]}
            fontSize={0.4}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            Continue to Recognition
          </Text>
        </mesh>
      )}
    </group>
  );
};