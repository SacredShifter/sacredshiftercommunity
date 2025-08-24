import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useLiberationState } from '../context/LiberationContext';

export const PostEffects: React.FC = () => {
  const { state } = useLiberationState();
  
  // Add comprehensive null checks and default values
  const comfortSettings = state?.context?.comfortSettings || {
    motionReduced: false,
    volumeLevel: 0.7,
    vignetteEnabled: true,
    fovClamped: false,
  };

  // Only render if we have valid state
  if (!state?.context) {
    return null;
  }

  return (
    <EffectComposer>
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        height={300}
      />
      {comfortSettings?.vignetteEnabled && (
        <Vignette
          offset={0.3}
          darkness={0.5}
        />
      )}
    </EffectComposer>
  );
};