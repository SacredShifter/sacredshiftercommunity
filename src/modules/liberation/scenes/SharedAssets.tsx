import React, { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Shared geometries
export const useSharedGeometries = () => {
  return useMemo(() => ({
    tunnel: new THREE.CylinderGeometry(5, 5, 20, 32, 1, true),
    threshold: new THREE.PlaneGeometry(10, 10),
    particle: new THREE.SphereGeometry(0.1, 8, 8),
    breathOrb: new THREE.SphereGeometry(1, 32, 32),
  }), []);
};

// Shared materials
export const useSharedMaterials = () => {
  return useMemo(() => ({
    dissolve: new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uThreshold: { value: 0 },
        uColor: { value: new THREE.Color('#8A2BE2') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uThreshold;
        uniform vec3 uColor;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Simple noise function
        float noise(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 54.53))) * 43758.5453);
        }
        
        void main() {
          float n = noise(vPosition * 2.0 + uTime * 0.1);
          float alpha = smoothstep(uThreshold, uThreshold + 0.1, n);
          
          if (alpha < 0.01) discard;
          
          gl_FragColor = vec4(uColor, alpha * 0.8);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    }),
    
    starfield: new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1.0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          
          // Subtle twinkling
          float twinkle = sin(uTime * 2.0 + gl_FragCoord.x * 0.01) * 0.5 + 0.5;
          alpha *= mix(0.7, 1.0, twinkle);
          
          gl_FragColor = vec4(vColor, alpha * uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    }),
  }), []);
};

// Particle system for transitions
export const ParticleSystem: React.FC<{
  count?: number;
  spread?: number;
  color?: string;
}> = ({ 
  count = 1000, 
  spread = 20,
  color = '#8A2BE2'
}) => {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return pos;
  }, [count, spread]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.1}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};