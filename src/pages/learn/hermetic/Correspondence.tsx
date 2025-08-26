import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'

// New component for the Phi spiral overlay
const PhiSpiral = () => {
  const points = useMemo(() => {
    const pts = [];
    const a = 0.1;
    const b = 0.175; // Controls the tightness of the spiral
    for (let i = 0; i < 200; i++) {
      const theta = i * 0.1;
      const x = a * Math.exp(b * theta) * Math.cos(theta);
      const y = a * Math.exp(b * theta) * Math.sin(theta);
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, []);

  return <Line points={points} color="gold" lineWidth={3} />;
};

// New component for the branching pattern overlay
const BranchingPattern = () => {
  const angle = Math.PI / 6; // 30 degrees
  const length = 1.5;
  return (
    <group>
      <Line points={[new THREE.Vector3(0, -length/2, 0), new THREE.Vector3(0, 0, 0)]} color="lightgreen" lineWidth={3} />
      <Line
        points={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.sin(angle) * length, Math.cos(angle) * length, 0)
        ]}
        color="lightgreen"
        lineWidth={3}
      />
      <Line
        points={[
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(Math.sin(-angle) * length, Math.cos(-angle) * length, 0)
        ]}
        color="lightgreen"
        lineWidth={3}
      />
    </group>
  )
}

const Scene = ({ progress, showPhi, showBranching }: { progress: number, showPhi: boolean, showBranching: boolean }) => {
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
      <perspectiveCamera ref={cameraRef} fov={60} />
      {stages.map((stage, index) => (
        <group key={index} position={stage.position}>
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshNormalMaterial />
            <Html center>
              <div className="text-white bg-black/50 p-2 rounded">{stage.text}</div>
            </Html>
          </mesh>

          {/* Render overlays at the "Leaf Venation" stage */}
          {stage.text === "Leaf Venation" && (
            <group scale={0.5}>
              {showPhi && <PhiSpiral />}
              {showBranching && <BranchingPattern />}
            </group>
          )}
        </group>
      ))}
    </>
  )
}

export default function Correspondence() {
  const [progress, setProgress] = useState(0)
  const [showPhi, setShowPhi] = useState(false)
  const [showBranching, setShowBranching] = useState(false)

  return (
    <div className="w-screen h-screen relative">
      <Canvas>
        <color attach="background" args={["#0b0c10"]} />
        <ambientLight intensity={0.6} />
        <Scene progress={progress} showPhi={showPhi} showBranching={showBranching} />
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
            <Button variant={showPhi ? 'default' : 'outline'} size="sm" onClick={() => setShowPhi(!showPhi)}>
              Toggle Phi
            </Button>
            <Button variant={showBranching ? 'default' : 'outline'} size="sm" onClick={() => setShowBranching(!showBranching)}>
              Toggle Branching Angle
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
