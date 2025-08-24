import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useLiberationState } from '../context/LiberationContext';

export const PostEffects: React.FC = () => {
  const { state } = useLiberationState();
  
  // Add null checks and default values to prevent "Cannot read properties of undefined" errors
  const comfortSettings = state?.context?.comfortSettings || {
    motionReduced: false,
    volumeLevel: 0.7,
    vignetteEnabled: true,
    fovClamped: false,
  };

  return (
    <EffectComposer>
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        height={300}
      />
      {comfortSettings.vignetteEnabled && (
        <Vignette
          offset={0.3}
          darkness={0.5}
        />
      )}
    </EffectComposer>
  );
};