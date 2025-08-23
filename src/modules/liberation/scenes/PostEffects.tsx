import React, { useRef, useEffect } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useLiberationState } from '../context/LiberationContext';
import { useAudioAnalyser } from '@/modules/collective/audio/AudioEngine';
import { useFrame } from '@react-three/fiber';
import { MathUtils } from 'three';

export const PostEffects: React.FC = () => {
  const { state } = useLiberationState();
  const comfortSettings = state.context.comfortSettings;
  const { analyser } = useAudioAnalyser();
  const bloomRef = useRef<any>(null);

  useFrame(() => {
    if (analyser && bloomRef.current) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

      const targetIntensity = MathUtils.mapLinear(average, 0, 128, 0.3, 0.8);
      bloomRef.current.intensity = MathUtils.damp(
        bloomRef.current.intensity,
        targetIntensity,
        0.1, // smoothing factor
        0.01 // delta time (useFrame provides this)
      );
    }
  });

  return (
    <EffectComposer>
      <Bloom
        ref={bloomRef}
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