import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMachine } from '@xstate/react';
import { earthMachine } from './machine';
import { EarthProvider } from './context/EarthContext';
import GaiaScene from './scenes/GaiaScene';
import { HUD } from './ui/HUD';
import { AudioEngine } from './audio/AudioEngine';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface ReconnectionWithLivingEarthProps {
  onExit: () => void;
}

export default function ReconnectionWithLivingEarth({ onExit }: ReconnectionWithLivingEarthProps) {
  const [state, send] = useMachine(earthMachine);

  useEffect(() => {
    send({ type: 'START' });
  }, [send]);

  return (
    <ErrorBoundary name="ReconnectionWithLivingEarth">
      <EarthProvider value={{ state, send, onExit }}>
        <div className="fixed inset-0 bg-gradient-to-b from-green-900 to-brown-900">
          <Canvas
            dpr={[1, 2]}
            shadows
            camera={{ 
              position: [0, 2, 8], 
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
            <GaiaScene />
          </Canvas>
          
          <HUD />
          <AudioEngine />
        </div>
      </EarthProvider>
    </ErrorBoundary>
  );
}