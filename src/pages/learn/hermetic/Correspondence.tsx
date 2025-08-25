import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'

const Scene = ({ progress }: { progress: number }) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 5, -10),
      new THREE.Vector3(-5, -5, -20),
      new THREE.Vector3(0, 0, -30),
    ])
  }, [])

  const stages = useMemo(() => [
    { position: curve.points[0], text: "Carbon Lattice" },
    { position: curve.points[1], text: "Leaf Venation" },
    { position: curve.points[2], text: "River Delta" },
    { position: curve.points[3], text: "Galaxy Spiral" },
  ], [curve])

  useFrame(() => {
    const position = curve.getPointAt(progress)
    const tangent = curve.getTangentAt(progress)

    if (cameraRef.current) {
      cameraRef.current.position.copy(position)
      cameraRef.current.lookAt(position.clone().add(tangent))
    }
  })

  return (
    <>
      <perspectiveCamera ref={cameraRef} makeDefault fov={60} />
      {stages.map((stage, index) => (
        <mesh key={index} position={stage.position}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshNormalMaterial />
          <Html center>
            <div className="text-white bg-black/50 p-2 rounded">{stage.text}</div>
          </Html>
        </mesh>
      ))}
    </>
  )
}

export default function Correspondence() {
  const [progress, setProgress] = useState(0)

  return (
    <div className="w-screen h-screen relative">
      <Canvas>
        <color attach="background" args={["#0b0c10"]} />
        <ambientLight intensity={0.6} />
        <Scene progress={progress} />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-3 rounded w-96">
        <h1 className="text-2xl font-bold text-white">The Principle of Correspondence</h1>
        <p className="text-white">"As above, so below; as below, so above."</p>
        <div className="pt-4">
          <label htmlFor="progress" className="text-white block pb-2">Scrub Timeline</label>
          <input
            id="progress"
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={(e) => setProgress(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="pt-4">
          <h3 className="text-lg font-bold text-white">Overlays</h3>
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm">Toggle Phi</Button>
            <Button variant="outline" size="sm">Toggle Branching Angle</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
