import React, { Suspense, forwardRef } from 'react';
import { useLiberationState } from '../context/LiberationContext';
import { Intro } from './Intro';
import { Hall } from './Hall';
import { Crossing } from './Crossing';
import { Expansion, ExpansionHandles } from './Expansion';
import { Integration } from './Integration';

interface SceneRouterProps {
  expansionRef: React.Ref<ExpansionHandles>;
}

export const SceneRouter = forwardRef<any, SceneRouterProps>(({ expansionRef }, ref) => {
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
        return <Expansion ref={expansionRef} />;
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
});

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