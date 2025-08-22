import React, { Suspense } from 'react';
import { useCollectiveState } from '../context/CollectiveContext';

export const SceneRouter: React.FC = () => {
  const { state } = useCollectiveState();
  const currentScene = state.context.currentScene;

  return (
    <Suspense fallback={<mesh><sphereGeometry args={[1]} /><meshBasicMaterial color="#9370DB" wireframe /></mesh>}>
      <group>
        <ambientLight intensity={0.3} color="#8A2BE2" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#9370DB" />
        {/* Circle geometry */}
        <mesh position={[0, 0, 0]} onClick={() => state.send?.({ type: 'JOIN_CIRCLE' })}>
          <ringGeometry args={[3, 3.5, 32]} />
          <meshBasicMaterial color="#9370DB" transparent opacity={0.6} />
        </mesh>
        <text position={[0, 4, 0]} color="#FFFFFF">Collective Circle - {currentScene}</text>
      </group>
    </Suspense>
  );
};