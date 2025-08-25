import React, { Suspense } from 'react';
import { Text } from '@react-three/drei';
import { useEarthState } from '../context/EarthContext';
import GaiaScene from './GaiaScene';

export const SceneRouter: React.FC = () => {
  const { state } = useEarthState();
  const currentScene = state.value;

  const renderScene = () => {
    switch (currentScene) {
      case 'breathing':
        return <GaiaScene />;
      default:
        return (
          <group>
            <ambientLight intensity={0.4} color="#90EE90" />
            <pointLight position={[0, 5, 0]} intensity={0.6} color="#32CD32" />
            <mesh position={[0, -2, 0]} onClick={() => state.send?.({ type: 'STEP_IN' })}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            <Text position={[0, 2, 0]} color="#FFFFFF" fontSize={0.5} anchorX="center" anchorY="middle">
              Earth Module - {currentScene.toString()}
            </Text>
          </group>
        );
    }
  };

  return (
    <Suspense fallback={<mesh><sphereGeometry args={[1]} /><meshBasicMaterial color="#228B22" wireframe /></mesh>}>
      {renderScene()}
    </Suspense>
  );
};