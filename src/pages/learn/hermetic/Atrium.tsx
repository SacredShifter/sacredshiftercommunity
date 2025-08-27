// Hermetic Atrium - Central Hub
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Sphere, Box, Torus, Octahedron, Tetrahedron } from '@react-three/drei'
import * as THREE from 'three'
import { Slogan } from '@/components/ui/Slogan'

// Principle-specific gateway components
function MentalismGateway({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime()
      const pulse = (Math.sin(time * 2) + 1) / 2
      meshRef.current.scale.setScalar(0.8 + pulse * 0.2)
      meshRef.current.rotation.y = time * 0.5
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <shaderMaterial
          uniforms={{
            time: { value: 0 },
            color: { value: new THREE.Color("#8b5cf6") }
          }}
          vertexShader={`
            uniform float time;
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vec3 pos = position;
              pos += normal * sin(time * 2.0) * 0.1;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `}
          fragmentShader={`
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            void main() {
              float brain = sin(vUv.x * 10.0) * sin(vUv.y * 10.0);
              vec3 finalColor = color + brain * 0.3;
              gl_FragColor = vec4(finalColor, 1.0);
            }
          `}
        />
      </mesh>
      <Html center>
        <a href="/learn/hermetic/mentalism" className="px-3 py-1 bg-black/60 rounded text-white no-underline">Mentalism</a>
      </Html>
    </group>
  )
}

function CorrespondenceGateway({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
        <octahedronGeometry args={[0.8, 2]} />
        <meshBasicMaterial color="#10b981" wireframe transparent opacity={0.3} />
      </mesh>
      <Html center>
        <a href="/learn/hermetic/correspondence" className="px-3 py-1 bg-black/60 rounded text-white no-underline">Correspondence</a>
      </Html>
    </group>
  )
}

function VibrationGateway({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      groupRef.current.children.forEach((child, i) => {
        const wave = Math.sin(time * 3 + i * 0.5) * 0.3
        child.position.y = wave
      })
    }
  })

  return (
    <group position={position} ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[i * 0.3 - 0.6, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <Html center position={[0, -1.5, 0]}>
        <a href="/learn/hermetic/vibration" className="px-3 py-1 bg-black/60 rounded text-white no-underline">Vibration</a>
      </Html>
    </group>
  )
}

function PolarityGateway({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial 
          color="#ef4444" 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      <Html center>
        <a href="/learn/hermetic/polarity" className="px-3 py-1 bg-black/60 rounded text-white no-underline">Polarity</a>
      </Html>
    </group>
  )
}

function RhythmGateway({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      groupRef.current.rotation.z = Math.sin(time) * 0.3
    }
  })

  return (
    <group position={position} ref={groupRef}>
      <mesh>
        <torusGeometry args={[0.8, 0.3, 16, 100]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 16, 100]} />
        <meshStandardMaterial color="#fbbf24" transparent opacity={0.6} />
      </mesh>
      <Html center>
        <a href="/learn/hermetic/rhythm" className="px-3 py-1 bg-black/60 rounded text-white no-underline">Rhythm</a>
      </Html>
    </group>
  )
}

function CauseEffectGateway({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <tetrahedronGeometry args={[1]} />
        <meshStandardMaterial color="#8b5cf6" wireframe />
      </mesh>
      {[...Array(4)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI / 2) * 0.5,
          Math.sin(i * Math.PI / 2) * 0.5,
          0
        ]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={0.5} />
        </mesh>
      ))}
      <Html center>
        <a href="/learn/hermetic/cause-effect" className="px-3 py-1 bg-black/60 rounded text-white no-underline">Cause & Effect</a>
      </Html>
    </group>
  )
}

function GenderGateway({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null!)
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime()
      groupRef.current.children.forEach((child, i) => {
        child.rotation.y = time * (i % 2 === 0 ? 1 : -1)
      })
    }
  })

  return (
    <group position={position} ref={groupRef}>
      <mesh position={[-0.3, 0, 0]}>
        <coneGeometry args={[0.4, 1, 8]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.3, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.4, 1, 8]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} />
      </mesh>
      <Html center>
        <a href="/learn/hermetic/gender" className="px-3 py-1 bg-black/60 rounded text-white no-underline">Gender</a>
      </Html>
    </group>
  )
}

export default function HermeticAtrium(){
  const principles = [
    { key: 'mentalism', component: MentalismGateway },
    { key: 'correspondence', component: CorrespondenceGateway },
    { key: 'vibration', component: VibrationGateway },
    { key: 'polarity', component: PolarityGateway },
    { key: 'rhythm', component: RhythmGateway },
    { key: 'cause-effect', component: CauseEffectGateway },
    { key: 'gender', component: GenderGateway },
  ];

  const radius = 3.5;

  return (
    <div className="w-screen h-screen relative">
      <Slogan variant="watermark" />
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <color attach="background" args={["hsl(var(--background))"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} color="#ffffff" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#8b5cf6" />
        
        {principles.map((p, i) => {
          const angle = (i / principles.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);
          const Component = p.component;
          return <Component key={p.key} position={[x, 0, z]} />;
        })}
        
        <OrbitControls enablePan={false} maxDistance={12} minDistance={3} />
      </Canvas>
      
      <div className="absolute top-4 left-4 space-y-2 bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-border">
        <h1 className="text-2xl font-bold text-foreground">The Seven Hermetic Principles</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          "The Principles of Truth are Seven; he who knows these, understandingly, possesses the Magic Key 
          before whose touch all the Doors of the Temple fly open." - The Kybalion
        </p>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">Click any principle to explore its mysteries</p>
      </div>
    </div>
  )
}