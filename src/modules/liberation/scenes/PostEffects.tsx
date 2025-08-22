import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useLiberationState } from '../context/LiberationContext';

export const PostEffects: React.FC = () => {
  const { state } = useLiberationState();
  const comfortSettings = state.context.comfortSettings;

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