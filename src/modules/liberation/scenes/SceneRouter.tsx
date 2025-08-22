import React, { Suspense } from 'react';
import { useLiberationState } from '../context/LiberationContext';
import { Intro } from './Intro';
import { Hall } from './Hall';
import { Crossing } from './Crossing';
import { Expansion } from './Expansion';
import { Integration } from './Integration';
import { Loader2 } from 'lucide-react';

export const SceneRouter: React.FC = () => {
  const { state } = useLiberationState();
  const currentScene = state.context.currentScene;

  const renderScene = () => {
    switch (currentScene) {
      case 'intro':
        return <Intro />;
      case 'fear':
        return <Hall />;
      case 'crossing':
        return <Crossing />;
      case 'expansion':
        return <Expansion />;
      case 'integration':
        return <Integration />;
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
      <meshStandardMaterial color="#8A2BE2" wireframe />
    </mesh>
  </group>
);