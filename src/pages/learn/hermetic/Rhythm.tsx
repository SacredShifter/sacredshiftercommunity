import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const Pendulum = () => {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const angle = Math.sin(t) * 0.8 // Swing angle
    groupRef.current.rotation.z = angle
  })

  return (
    <group ref={groupRef} position={[0, 2.5, 0]}>
      {/* Pivot Point */}
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Pendulum Arm */}
      <Line points={[[0, 0, 0], [0, -2, 0]]} color="white" lineWidth={3} />
      {/* Pendulum Bob */}
      <mesh position={[0, -2.2, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="white" emissive="purple" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

const SceneContent = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Day-night cycle
    const lightIntensity = (Math.sin(t * 0.2) + 1) / 2 * 1.5 + 0.5
    if (lightRef.current) {
      lightRef.current.intensity = lightIntensity
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight ref={lightRef} position={[5, 5, 5]} intensity={1.5} />
      <Pendulum />
    </>
  )
}

export default function Rhythm() {
  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 1, 8] }}>
        <color attach="background" args={["#0b0c10"]} />
        <SceneContent />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-3 rounded w-96">
        <h2 className="text-xl text-white">The Principle of Rhythm</h2>
        <p className="text-xs opacity-80 text-white">"Everything flows, out and in; everything has its tides."</p>
      </div>
    </div>
  )
}
