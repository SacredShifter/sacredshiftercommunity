import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { collectiveMachine } from './machine';
import { CollectiveProvider } from './context/CollectiveContext';
import { SceneRouter } from './scenes/SceneRouter';
import { HUD } from './ui/HUD';
import { AudioEngine } from './audio/AudioEngine';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface CollectiveCoherenceCircleProps {
  onExit: () => void;
}

export default function CollectiveCoherenceCircle({ onExit }: CollectiveCoherenceCircleProps) {
  const [state, send] = useMachine(collectiveMachine);

  return (
    <ErrorBoundary name="CollectiveCoherenceCircle">
      <CollectiveProvider value={{ state, send, onExit }}>
        <div className="fixed inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
          <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ 
              position: [0, 5, 12], 
              fov: 60,
              near: 0.1,
              far: 1000 
            }}
            gl={{ 
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance'
            }}
          >
            <SceneRouter />
          </Canvas>
          
          <HUD />
          <AudioEngine />
        </div>
      </CollectiveProvider>
    </ErrorBoundary>
  );
}