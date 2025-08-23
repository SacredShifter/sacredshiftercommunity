import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { liberationMachine } from './machine';
import { LiberationProvider } from './context/LiberationContext';
import { SceneRouter } from './scenes/SceneRouter';
import { HUD } from './ui/HUD';
import { ComfortMenu } from './ui/ComfortMenu';
import { AudioEngine } from '@/modules/collective/audio/AudioEngine';
import { PerfGate } from './hooks/usePerformanceGate';
import { PostEffects } from './scenes/PostEffects';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function GateOfLiberation() {
  const [state, send] = useMachine(liberationMachine);

  return (
    <ErrorBoundary name="GateOfLiberation">
      <LiberationProvider value={{ state, send }}>
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
            <AudioEngine>
              <PerfGate>
                <PostEffects />
                <SceneRouter />
              </PerfGate>
            </AudioEngine>
          </Canvas>
          
          <HUD />
          <ComfortMenu />
        </div>
      </LiberationProvider>
    </ErrorBoundary>
  );
}