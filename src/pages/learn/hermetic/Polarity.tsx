import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

const PolarityObject = ({ value }: { value: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  const { color, opacity, roughness, wireframe } = useMemo(() => {
    if (value < 0.33) { // Ice
      return { color: new THREE.Color("#aaddff"), opacity: 1, roughness: 0.8, wireframe: false }
    } else if (value < 0.66) { // Water
      return { color: new THREE.Color("#88aaff"), opacity: 0.6, roughness: 0.1, wireframe: false }
    } else { // Vapor
      return { color: new THREE.Color("#ffffff"), opacity: 0.2, roughness: 0.5, wireframe: true }
    }
  }, [value])

  useFrame(() => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial
      material.color.lerp(color, 0.1)
      material.opacity = THREE.MathUtils.lerp(material.opacity, opacity, 0.1)
      material.roughness = THREE.MathUtils.lerp(material.roughness, roughness, 0.1)
      material.wireframe = wireframe
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <Box ref={meshRef} args={[2, 2, 2]}>
      <meshStandardMaterial transparent />
    </Box>
  )
}

const SceneContent = ({ value }: { value: number }) => {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[1, 2, 3]} intensity={1.5} />
            <PolarityObject value={value} />
        </>
    )
}

export default function Polarity() {
  const [value, setValue] = useState(0)

  const stateLabel = useMemo(() => {
    if (value < 0.33) return "Ice (Solid)"
    if (value < 0.66) return "Water (Liquid)"
    return "Vapor (Gas)"
  }, [value])

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={["#0b0c10"]} />
        <SceneContent value={value} />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-3 rounded w-96">
        <h2 className="text-xl text-white">The Principle of Polarity</h2>
        <p className="text-xs opacity-80 text-white">"Everything is dual; everything has poles; everything has its pair of opposites."</p>
        <div className="pt-4">
          <label className="text-white block pb-2">Continuum: {stateLabel}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
