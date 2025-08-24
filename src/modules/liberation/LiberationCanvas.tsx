import React, { useRef, useEffect } from 'react';
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
import { useLiberationProgress } from '@/hooks/useLiberationProgress';
import { LoadingState } from '@/components/ui/loading-state';

export default function GateOfLiberation() {
  const [state, send] = useMachine(liberationMachine);
  const expansionRef = useRef<ExpansionHandles>(null);
  const sessionId = `lib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const { 
    currentSession, 
    loading, 
    saveProgress, 
    completePhase, 
    updateComfortSettings,
    updateArousalLevel 
  } = useLiberationProgress(sessionId);

  const handleWaypointClick = (index: number) => {
    if (expansionRef.current) {
      expansionRef.current.focusOnWaypoint(index);
    }
  };

  // Sync state machine with persisted progress
  useEffect(() => {
    if (currentSession && state.context.currentScene !== currentSession.current_scene) {
      // Restore session state if needed
      saveProgress({
        current_scene: state.context.currentScene,
        arousal_level: state.context.arousalLevel,
        comfort_settings: state.context.comfortSettings,
      });
    }
  }, [state.context, currentSession]);

  // Handle scene completion
  useEffect(() => {
    const currentScene = state.context.currentScene;
    if (currentScene !== 'intro' && currentSession) {
      completePhase(currentScene);
    }
  }, [state.context.currentScene]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <LoadingState message="Preparing your liberation journey..." />
      </div>
    );
  }

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