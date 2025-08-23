import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { liberationMachine } from './machine';
import { LiberationProvider } from './context/LiberationContext';
import { SceneRouter } from './scenes/SceneRouter';
import { HUD } from './ui/HUD';
import { ComfortMenu } from './ui/ComfortMenu';
import { AudioEngine } from './audio/AudioEngine';
import { PerfGate } from './hooks/usePerformanceGate';
import { PostEffects } from './scenes/PostEffects';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ExpansionHandles } from './scenes/Expansion';

export default function GateOfLiberation() {
  const [state, send] = useMachine(liberationMachine);
  const expansionRef = useRef<ExpansionHandles>(null);

  const handleWaypointClick = (index: number) => {
    if (expansionRef.current) {
      expansionRef.current.focusOnWaypoint(index);
    }
  };

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
              <SceneRouter expansionRef={expansionRef} />
            </PerfGate>
          </Canvas>
          
          <HUD
            waypoints={expansionRef.current?.waypoints || []}
            onWaypointClick={handleWaypointClick}
          />
          <ComfortMenu />
          <AudioEngine />
        </div>
      </LiberationProvider>
    </ErrorBoundary>
  );
}