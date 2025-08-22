import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { unhookingMachine } from './machine';
import { UnhookingProvider } from './context/UnhookingContext';
import { SceneRouter } from './scenes/SceneRouter';
import { HUD } from './ui/HUD';
import { AudioEngine } from './audio/AudioEngine';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface UnhookingFromFearBroadcastsProps {
  onExit: () => void;
}

export default function UnhookingFromFearBroadcasts({ onExit }: UnhookingFromFearBroadcastsProps) {
  const [state, send] = useMachine(unhookingMachine);

  return (
    <ErrorBoundary name="UnhookingFromFearBroadcasts">
      <UnhookingProvider value={{ state, send, onExit }}>
        <div className="fixed inset-0 bg-black">
          <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ 
              position: [0, 0, 8], 
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
      </UnhookingProvider>
    </ErrorBoundary>
  );
}