import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'

const PolarityObject = ({ value }: { value: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const { geometry, materialProps } = useMemo(() => {
    const isYin = value < 0.5
    return {
      geometry: isYin ? new THREE.TorusGeometry(1, 0.3, 16, 50) : new THREE.IcosahedronGeometry(1, 1),
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
      meshRef.current.scale.lerp(new THREE.Vector3(hovered ? 1.2 : 1, hovered ? 1.2 : 1, hovered ? 1.2 : 1), 0.1)
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <meshStandardMaterial {...materialProps} />
    </mesh>
  )
}

const SceneContent = ({ value }: { value: number }) => (
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[1, 2, 3]} intensity={1.5} />
    <PolarityObject value={value} />
  </>
)

export default function Polarity() {
  const [value, setValue] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const stateLabel = useMemo(() => {
    if (value < 0.33) return "Cold / Contraction"
    if (value < 0.66) return "Temperate / Balance"
    return "Hot / Expansion"
  }, [value])

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={["#0b0c10"]} />
        <SceneContent value={value} />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-4 rounded-lg w-96 border border-white/10">
        <h2 className="text-xl text-white font-bold">The Principle of Polarity</h2>
        <p className="text-xs opacity-80 pb-2">"Everything is dual; everything has poles; everything has its pair of opposites."</p>
        <div className="pt-2">
          <label className="text-white block pb-2 text-sm">Continuum: {stateLabel}</label>
          <input type="range" min="0" max="1" step="0.01" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} className="w-full" />
        </div>

        <Button onClick={() => setShowInfo(!showInfo)} variant="outline" size="sm" className="w-full mt-2">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn More
            <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showInfo ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
        {showInfo && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-4 mt-4 border-t border-white/10 text-sm text-white/90 space-y-3">
                    <p>This principle states that opposites are merely two extremes of the same thing. For example, heat and cold are not different things, but different degrees of temperature. The same applies to love and hate, courage and fear, light and darkness.</p>
                    <p><strong className="text-purple-300">Application:</strong> You can transmute one mental state into another along the same line of polarity. You can "raise your vibration" from fear to courage by consciously choosing to focus on the pole of courage, knowing they are fundamentally the same energy.</p>
                    <p><strong className="text-purple-300">Reflection:</strong> What is a pair of opposites in my life that I can see as two sides of the same coin? How can I move from a negative pole to a positive one in a current situation?</p>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  )
}
