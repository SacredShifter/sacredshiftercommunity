import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uPhase;
  uniform float uProgress;
  uniform float uGlowIntensity;
  uniform float uHue;
  uniform float uCycleCount;
  varying vec2 vUv;
  varying vec3 vNormal;

  // Simplex noise function for organic patterns
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    // Fresnel for rim lighting
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0,0,1))), 3.0);

    // Fractal noise for aura
    float noise = 0.0;
    float freq = 2.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      noise += snoise(vNormal * freq + uTime * 0.2) * amp;
      freq *= 2.0;
      amp *= 0.5;
    }

    // Color and glow based on phase
    vec3 baseColor = hsv2rgb(vec3(uHue, 0.8, 1.0));
    vec3 glowColor = hsv2rgb(vec3(uHue + 0.1, 1.0, 1.0));

    // Final color composition
    vec3 finalColor = baseColor;
    finalColor += glowColor * fresnel * uGlowIntensity;
    finalColor += noise * 0.3;

    float alpha = fresnel * 0.8 + noise * 0.2;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface BreathOrbProps {
  isBreathing: boolean;
  currentPhase: 'inhale' | 'holdIn' | 'exhale' | 'holdOut';
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  cycleCount: number;
  phaseTime: number;
  phaseDuration: number;
}

export default function BreathOrb({ 
  isBreathing, 
  currentPhase, 
  trustSpeed, 
  cycleCount,
  phaseTime,
  phaseDuration
}: BreathOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const speedMultiplier = {
    gentle: 0.7,
    balanced: 1.0,
    bold: 1.3
  }[trustSpeed];

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPhase: { value: 0 },
    uProgress: { value: 0 },
    uGlowIntensity: { value: 1.0 },
    uHue: { value: 0.6 },
    uCycleCount: { value: 0 },
  }), []);

  useFrame((state, delta) => {
    if (!orbRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime * speedMultiplier;
    let targetScale = 1.0;
    let glowIntensity = 1.0;
    let hue = 0.6; // Default blue
    const progress = (phaseDuration > 0) ? Math.min(phaseTime / phaseDuration, 1.0) : 0;

    if (isBreathing) {
      switch (currentPhase) {
        case 'inhale':
          targetScale = 1.0 + 0.5 * progress;
          glowIntensity = 1.0 + 0.5 * progress;
          hue = 0.1; // Warm orange
          break;
        case 'holdIn':
          targetScale = 1.5;
          glowIntensity = 1.5;
          hue = 0.15; // Golden
          break;
        case 'exhale':
          targetScale = 1.5 - 0.7 * progress;
          glowIntensity = 1.5 - 1.0 * progress;
          hue = 0.6; // Cool blue
          break;
        case 'holdOut':
          targetScale = 0.8;

          glowIntensity = 0.5;
          hue = 0.7; // Deep blue
          break;
      }
    } else {
      // Gentle pulsing when idle
      targetScale = 1.0 + Math.sin(time * 0.5) * 0.05;
      glowIntensity = 1.0 + Math.sin(time * 0.5) * 0.1;
      hue = 0.5;
    }

    // Smoothly interpolate scale
    orbRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uGlowIntensity.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uGlowIntensity.value, glowIntensity, 0.1);
    materialRef.current.uniforms.uHue.value = THREE.MathUtils.lerp(materialRef.current.uniforms.uHue.value, hue, 0.1);
    materialRef.current.uniforms.uCycleCount.value = cycleCount;
    materialRef.current.uniforms.uProgress.value = progress;
    materialRef.current.uniforms.uPhase.value = currentPhase === 'inhale' ? 0 : currentPhase === 'holdIn' ? 1 : currentPhase === 'exhale' ? 2 : 3;
  });

  return (
    <mesh ref={orbRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}