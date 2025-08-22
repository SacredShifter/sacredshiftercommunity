import React, { Suspense } from 'react';
import { useUnhookingState } from '../context/UnhookingContext';
import { Intro } from './Intro';
import { FogOfBroadcasts } from './FogOfBroadcasts';
import { Recognition } from './Recognition';
import { Clearing } from './Clearing';
import { CalmField } from './CalmField';

export const SceneRouter: React.FC = () => {
  const { state } = useUnhookingState();
  const currentScene = state.context.currentScene;

  const renderScene = () => {
    switch (currentScene) {
      case 'intro':
        return <Intro />;
      case 'fog':
        return <FogOfBroadcasts />;
      case 'recognition':
        return <Recognition />;
      case 'clearing':
        return <Clearing />;
      case 'calm':
        return <CalmField />;
      default:
        return <Intro />;
    }
  };

  return (
    <Suspense fallback={<LoadingScene />}>
      {renderScene()}
    </Suspense>
  );
};

const LoadingScene: React.FC = () => (
  <group>
    <ambientLight intensity={0.2} />
    <pointLight position={[10, 10, 10]} />
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#FF6B6B" wireframe />
    </mesh>
  </group>
);