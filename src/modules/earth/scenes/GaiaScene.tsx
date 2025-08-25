import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Wind, Leaf, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

import { BreathingMode } from '../machine';

interface BreathingEarth {
  isBreathing: boolean;
  breathRate: number;
  breathingMode: BreathingMode;
}

function Earth({ isBreathing, breathRate, breathingMode, onBreath }: {
  isBreathing: boolean;
  breathRate: number;
  breathingMode: BreathingMode;
  onBreath: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  const [earthTexture, cloudsTexture] = useTexture([
    'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
    'https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg',
  ]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      if (isBreathing) {
        const breathCycle = Math.sin(time * breathRate) * 0.05;
        const scale = 1 + breathCycle;
        meshRef.current.scale.setScalar(scale);
      }
      if (meshRef.current.material.uniforms) {
        meshRef.current.material.uniforms.time.value = time;
      }
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
      if (isBreathing) {
        const atmosphereScale = 1 + Math.sin(time * breathRate * 0.8) * 0.03;
        atmosphereRef.current.scale.setScalar(atmosphereScale);
      }
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group>
      {/* Earth Core */}
      <mesh ref={meshRef} onClick={onBreath}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <shaderMaterial
          uniforms={{
            earthTexture: { value: earthTexture },
            breathingMode: { value: breathingMode === 'forest' ? 1.0 : (breathingMode === 'ocean' ? 2.0 : 0.0) },
            time: { value: 0.0 },
          }}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vWorldPos;
            void main() {
              vUv = uv;
              vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform sampler2D earthTexture;
            uniform float breathingMode;
            uniform float time;
            varying vec2 vUv;
            varying vec3 vWorldPos;

            void main() {
              vec4 texColor = texture2D(earthTexture, vUv);
              float green = texColor.g - (texColor.r + texColor.b) * 0.5;
              float glow = 0.0;

              if (breathingMode > 0.5 && breathingMode < 1.5 && green > 0.1) { // Forest
                glow = (sin(time * 2.0) * 0.5 + 0.5) * 0.5;
                gl_FragColor = texColor + vec4(0.0, glow, 0.0, 1.0);
              } else if (breathingMode > 1.5 && texColor.b > (texColor.r + texColor.g)) { // Ocean
                float moonX = 4.0 * cos(time * 0.5);
                float moonZ = 4.0 * sin(time * 0.5);
                vec3 moonPos = vec3(moonX, 0.0, moonZ);
                float distToMoon = distance(vWorldPos, moonPos);
                glow = (1.0 - smoothstep(2.0, 4.0, distToMoon)) * 0.5;
                gl_FragColor = texColor + vec4(0.0, 0.0, glow, 1.0);
              } else {
                gl_FragColor = texColor;
              }
            }
          `}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshStandardMaterial map={cloudsTexture} transparent opacity={0.4} />
      </mesh>

      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial
          color="#87ceeb"
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Atmospheric Glow */}
      <mesh scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <shaderMaterial
          uniforms={{
            glowColor: { value: new THREE.Color(0x87ceeb) },
          }}
          vertexShader={`
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 glowColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(glowColor, 1.0) * intensity;
            }
          `}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          transparent
        />
      </mesh>
    </group>
  );
}

function Aurora({ isActive }: { isActive: boolean }) {
  const auroraRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (auroraRef.current && isActive) {
      auroraRef.current.material.uniforms.time.value = clock.getElapsedTime();
    }
  });

  if (!isActive) return null;

  return (
    <mesh ref={auroraRef} scale={[1.1, 1.3, 1.1]}>
      <sphereGeometry args={[1.8, 32, 32]} />
      <shaderMaterial
        uniforms={{
          time: { value: 0.0 },
          glowColor: { value: new THREE.Color(0x00ff00) },
        }}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          uniform vec3 glowColor;
          varying vec3 vNormal;
          varying vec3 vPosition;

          float noise(vec3 p) {
            return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
          }

          void main() {
            float intensity = 0.0;
            if (abs(vPosition.y) > 1.2) {
              float noiseVal = noise(vPosition * 5.0 + time * 0.5);
              intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0) * noiseVal;
            }
            gl_FragColor = vec4(glowColor, 1.0) * intensity;
          }
        `}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
      />
    </mesh>
  );
}

function JetStream({ isActive }: { isActive: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 1000;

  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const radius = 2.0;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      positions[i * 3] = radius * Math.cos(angle);
      positions[i * 3 + 1] = Math.sin(angle * 5) * 0.2; // Add some wave
      positions[i * 3 + 2] = radius * Math.sin(angle);
    }
    return positions;
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current && isActive) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  if (!isActive) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.02} transparent opacity={0.5} />
    </points>
  );
}

const Moon = React.forwardRef<THREE.Mesh>((props, ref) => {
  useFrame(({ clock }) => {
    if (ref && 'current' in ref && ref.current) {
      const time = clock.getElapsedTime();
      ref.current.position.x = 4 * Math.cos(time * 0.5);
      ref.current.position.z = 4 * Math.sin(time * 0.5);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial color="grey" />
    </mesh>
  );
});

import { useEarthState } from '../context/EarthContext';

export default function GaiaScene() {
  const { state, send } = useEarthState();
  const [isBreathing, setIsBreathing] = useState(true);
  const [breathRate, setBreathRate] = useState(0.3);
  const lastBreathTime = useRef(0);
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const time = state.context.celestialTime ?? clock.getElapsedTime();

    if (sunRef.current) {
      sunRef.current.position.x = 10 * Math.cos(time * 0.1);
      sunRef.current.position.z = 10 * Math.sin(time * 0.1);

      if (state.context.celestialTime === null) {
        if (sunRef.current.position.z > 9.9) {
          send({ type: 'SET_CELESTIAL_BODY', body: 'sun' });
        } else if (sunRef.current.position.z < -9.9) {
          send({ type: 'SET_CELESTIAL_BODY', body: null });
        }
      }
    }

    if (moonRef.current) {
      moonRef.current.position.x = 4 * Math.cos(time * 0.5);
      moonRef.current.position.z = 4 * Math.sin(time * 0.5);

      if (state.context.celestialTime === null) {
        if (moonRef.current.position.z > 3.9) {
          send({ type: 'SET_CELESTIAL_BODY', body: 'moon' });
        } else if (moonRef.current.position.z < -3.9) {
          send({ type: 'SET_CELESTIAL_BODY', body: null });
        }
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight ref={sunRef} intensity={1.5} position={[10, 0, 0]} />

      <Moon ref={moonRef} />
      <Earth
        isBreathing={isBreathing}
        breathRate={breathRate}
        breathingMode={state.context.breathingMode}
        onBreath={() => {
          if (state.matches('breathing.syncing')) {
            const now = Date.now();
            if (lastBreathTime.current > 0) {
              const delta = (now - lastBreathTime.current) / 1000; // in seconds
              setBreathRate(1 / delta);
            }
            lastBreathTime.current = now;
          }
        }}
      />
      <JetStream isActive={state.context.breathingMode === 'atmosphere'} />
      <Aurora isActive={state.context.breathingMode === 'magnetic'} />

      <Html position={[0, 4, 0]} center>
        <div
          className="font-bold pointer-events-none text-center"
          style={{
            color: '#ffffff',
            fontSize: '20px',
            textShadow: '0 0 8px rgba(0,0,0,0.8)',
          }}
        >
          Gaia's Living Breath
        </div>
      </Html>

      <OrbitControls enablePan={false} maxDistance={10} minDistance={3} />
    </>
  );
}