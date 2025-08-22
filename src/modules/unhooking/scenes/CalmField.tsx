import React from 'react';
import { Text } from '@react-three/drei';
import { useUnhookingState } from '../context/UnhookingContext';

export const CalmField: React.FC = () => {
  const { send } = useUnhookingState();

  const handleComplete = () => {
    send({ type: 'COMPLETE' });
  };

  return (
    <group>
      {/* Calm, clear lighting */}
      <ambientLight intensity={0.6} color="#F0F8FF" />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#E6E6FA" />
      
      {/* Completion text */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.8}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
        textAlign="center"
      >
        Calm Field
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
        Rest in this clarity you have created.
        You now know the difference between
        your authentic concerns and inherited fears.
      </Text>
      
      {/* Complete button */}
      <mesh
        position={[0, -3, 0]}
        onClick={handleComplete}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <boxGeometry args={[4, 1.2, 0.2]} />
        <meshBasicMaterial color="#9370DB" />
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.4}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Complete Unhooking Process
        </Text>
      </mesh>
    </group>
  );
};