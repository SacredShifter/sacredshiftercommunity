import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { fromPromise } from 'xstate';
import { useAuraPlatformIntegration } from '@/hooks/useAuraPlatformIntegration';
import { liberationMachine } from './machine';
import { LiberationProvider } from './context/LiberationContext';
import { SceneRouter } from './scenes/SceneRouter';
import { HUD } from './ui/HUD';
import { ComfortMenu } from './ui/ComfortMenu';
import { AudioEngine } from './audio/AudioEngine';
import { PerfGate } from './hooks/usePerformanceGate';
import { PostEffects } from './scenes/PostEffects';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function GateOfLiberation() {
  const { recordShiftEvent } = useAuraPlatformIntegration();
  const [state, send] = useMachine(liberationMachine, {
    actors: {
      recordShiftEvent: fromPromise(async ({ input }: { input: any }) => {
        await recordShiftEvent(input.action, input.payload);
      }),
    },
  });

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
            <PerfGate>
              <PostEffects />
              <SceneRouter />
            </PerfGate>
          </Canvas>
          
          <HUD />
          <ComfortMenu />
          <AudioEngine />
        </div>
      </LiberationProvider>
    </ErrorBoundary>
  );
}