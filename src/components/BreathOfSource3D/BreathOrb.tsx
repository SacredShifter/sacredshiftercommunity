import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface BreathOrbProps {
  isBreathing: boolean;
  currentPhase: string;
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  cycleCount: number;
}

export default function BreathOrb({ 
  isBreathing, 
  currentPhase, 
  trustSpeed, 
  cycleCount 
}: BreathOrbProps) {
  const orbRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Trust speed multipliers
  const speedMultiplier = {
    gentle: 0.7,
    balanced: 1.0,
    bold: 1.3
  }[trustSpeed];

  // Particle system for life/death energy
  const particleCount = 200;
  const particles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const radius = Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Color variation (warm to cool spectrum)
      colors[i * 3] = Math.random() * 0.5 + 0.5; // R
      colors[i * 3 + 1] = Math.random() * 0.3 + 0.4; // G
      colors[i * 3 + 2] = Math.random() * 0.8 + 0.2; // B
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!orbRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime * speedMultiplier;
    
    // Always animate breathing - show continuous gentle breathing
    let targetScale = 1.0;
    let glowIntensity = 0.5;
    let hue = 0.6; // Default blue/cool
    
    // Always show breathing animation (gentle default if not actively breathing)
    if (isBreathing) {
      switch (currentPhase) {
        case 'inhale':
          targetScale = 1.0 + Math.sin(time * 2) * 0.3;
          glowIntensity = 0.8 + Math.sin(time * 2) * 0.2;
          hue = 0.1; // Warm orange (Life)
          break;
        case 'holdIn':
          targetScale = 1.3;
          glowIntensity = 1.0;
          hue = 0.15; // Golden (Receive)
          break;
        case 'exhale':
          targetScale = 1.0 - Math.cos(time * 2) * 0.2;
          glowIntensity = 0.6 - Math.cos(time * 2) * 0.2;
          hue = 0.6; // Cool blue (Death)
          break;
        case 'holdOut':
          targetScale = 0.8;
          glowIntensity = 0.3;
          hue = 0.7; // Deep blue (Surrender)
          break;
        default:
          targetScale = 1.0 + Math.sin(time * 0.5) * 0.15; // Gentle default breathing
          glowIntensity = 0.6 + Math.sin(time * 0.5) * 0.2;
          hue = 0.5;
      }
    } else {
      // Default gentle breathing animation when not actively practicing
      targetScale = 1.0 + Math.sin(time * 0.5) * 0.15;
      glowIntensity = 0.6 + Math.sin(time * 0.5) * 0.2;
      hue = 0.5;
    }

    // Smooth scale transition
    const currentScale = orbRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.05);
    orbRef.current.scale.setScalar(newScale);

    // Update shader uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uGlowIntensity.value = glowIntensity;
    materialRef.current.uniforms.uHue.value = hue;
    materialRef.current.uniforms.uCycleCount.value = cycleCount;
    materialRef.current.uniforms.uPhase.value = 
      currentPhase === 'inhale' ? 0 :
      currentPhase === 'holdIn' ? 1 :
      currentPhase === 'exhale' ? 2 : 3;

    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const offset = i * 3;
        // Breathing-based particle movement
        const breathScale = targetScale;
        positions[offset] = particles.positions[offset] * breathScale;
        positions[offset + 1] = particles.positions[offset + 1] * breathScale;
        positions[offset + 2] = particles.positions[offset + 2] * breathScale;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Main Breath Orb */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          transparent
          uniforms={{
            uTime: { value: 0 },
            uGlowIntensity: { value: 0.5 },
            uHue: { value: 0.6 },
            uCycleCount: { value: 0 },
            uPhase: { value: 0 }
          }}
          vertexShader={`
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform float uGlowIntensity;
            uniform float uHue;
            uniform float uCycleCount;
            uniform float uPhase;
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec2 vUv;
            
            vec3 hsv2rgb(vec3 c) {
              vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
              vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
              return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }
            
            void main() {
              // Sacred geometry patterns
              float pattern = sin(vPosition.x * 3.0 + uTime) * 
                            sin(vPosition.y * 3.0 + uTime) * 
                            sin(vPosition.z * 3.0 + uTime);
              pattern = pattern * 0.5 + 0.5;
              
              // Fresnel effect for outer glow
              float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
              
              // Color based on breath phase
              vec3 baseColor = hsv2rgb(vec3(uHue, 0.8, 1.0));
              vec3 glowColor = hsv2rgb(vec3(uHue + 0.1, 1.0, 1.0));
              
              // Final color mixing
              vec3 finalColor = mix(baseColor, glowColor, fresnel * uGlowIntensity);
              finalColor += pattern * 0.3;
              
              // Cycle-based intensity boost
              float cycleBoost = min(uCycleCount / 10.0, 1.0) * 0.2;
              finalColor += cycleBoost;
              
              float alpha = 0.8 + fresnel * 0.2;
              
              gl_FragColor = vec4(finalColor, alpha);
            }
          `}
        />
      </mesh>

      {/* Energy Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          transparent
          opacity={0.6}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Sacred Geometry Overlay (subtle) */}
      <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 8, 24]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}