import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useUnhookingState } from '../context/UnhookingContext';
import * as THREE from 'three';

export const Clearing: React.FC = () => {
  const { state, send } = useUnhookingState();
  const breathRef = useRef<THREE.Mesh>(null);
  const fogIntensity = state.context.fogIntensity;

  useFrame((state) => {
    if (breathRef.current) {
      const time = state.clock.elapsedTime;
      const breathScale = 1 + Math.sin(time * 0.8) * 0.3;
      breathRef.current.scale.setScalar(breathScale);
    }
  });

  const handleBreathClear = () => {
    send({ type: 'BREATH_CLEAR' });
  };

  const handleNext = () => {
    if (fogIntensity <= 0.1) {
      send({ type: 'NEXT' });
    }
  };

  return (
    <group>
      {/* Clearing lighting */}
      <ambientLight intensity={0.5} color="#87CEEB" />
      <pointLight position={[0, 0, 5]} intensity={0.7} color="#00CED1" />
      
      {/* Breath circle */}
      <mesh ref={breathRef} position={[0, 0, 0]} onClick={handleBreathClear}>
        <ringGeometry args={[1, 1.5, 32]} />
        <meshBasicMaterial
          color="#00CED1"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Remaining fog */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={new Float32Array(
              Array.from({ length: 1500 }, () => (Math.random() - 0.5) * 20)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#696969"
          transparent
          opacity={fogIntensity * 0.5}
          sizeAttenuation
        />
      </points>
      
      {/* Instructions */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={14}
        textAlign="center"
      >
        Use your breath to clear the remaining fog.
        Fog intensity: {Math.round(fogIntensity * 100)}%
      </Text>
      
      {/* Next button when ready */}
      {fogIntensity <= 0.1 && (
        <mesh
          position={[0, -3, 0]}
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
            Enter the Calm Field
          </Text>
        </mesh>
      )}
    </group>
  );
};