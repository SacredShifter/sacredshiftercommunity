import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'

const PolarityObject = ({ value }: { value: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const { geometry, materialProps } = useMemo(() => {
    const isYin = value < 0.5
    return {
      geometry: isYin ?
        new THREE.TorusGeometry(1, 0.3, 16, 50) :
        new THREE.IcosahedronGeometry(1, 2),
      materialProps: {
        color: isYin ? '#f0f0ff' : '#101010',
        emissive: isYin ? '#4080ff' : '#ff4040',
        emissiveIntensity: hovered ? 1 : 0.5,
        metalness: 0.8,
        roughness: isYin ? 0.4 : 0.8,
        transparent: true,
        opacity: 0.9
      }
    }
  }, [value, hovered])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.005
      meshRef.current.scale.lerp(
        new THREE.Vector3(hovered ? 1.2 : 1, hovered ? 1.2 : 1, hovered ? 1.2 : 1),
        0.1
      )
    }
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial {...materialProps} />
    </mesh>
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
