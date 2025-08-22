import React from 'react';
import { Text } from '@react-three/drei';
import { useUnhookingState } from '../context/UnhookingContext';

export const Recognition: React.FC = () => {
  const { send } = useUnhookingState();

  const handleNext = () => {
    send({ type: 'NEXT' });
  };

  return (
    <group>
      {/* Clearer lighting */}
      <ambientLight intensity={0.4} color="#FFD700" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#FFA500" />
      
      {/* Recognition text */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.6}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={14}
        textAlign="center"
      >
        Recognition Phase
      </Text>
      
      <Text
        position={[0, 0, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={16}
        textAlign="center"
      >
        Notice how much lighter you feel.
        Those fears never belonged to you.
        They were broadcasts from the collective unconscious.
      </Text>
      
      {/* Continue button */}
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
          Continue to Clearing
        </Text>
      </mesh>
    </group>
  );
};