import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Torus, TorusKnot } from '@react-three/drei'
import * as THREE from 'three'

const GenderScene = ({ will, receptivity }: { will: number, receptivity: number }) => {
  const masculineRef = useRef<THREE.Mesh>(null!)
  const feminineRef = useRef<THREE.Mesh>(null!)
  const creationRef = useRef<THREE.Mesh>(null!)

  const coherence = 1 - Math.abs(will - receptivity);

  useFrame(() => {
    if (masculineRef.current) {
      masculineRef.current.rotation.x += 0.01 * will;
      masculineRef.current.rotation.y += 0.015 * will;
    }
    if (feminineRef.current) {
      feminineRef.current.rotation.x -= 0.01 * receptivity;
      feminineRef.current.rotation.y -= 0.015 * receptivity;
    }
    if(creationRef.current) {
        const scale = THREE.MathUtils.lerp(0, 1, coherence * 2 - 1);
        creationRef.current.scale.set(scale, scale, scale);
        creationRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Masculine / Projective */}
      <Torus ref={masculineRef} args={[1.5, 0.05, 16, 100]} position={[-0.5, 0, 0]}>
        <meshStandardMaterial color="skyblue" emissive="blue" emissiveIntensity={will * 2} wireframe />
      </Torus>
      {/* Feminine / Receptive */}
      <Torus ref={feminineRef} args={[1.5, 0.05, 16, 100]} position={[0.5, 0, 0]}>
        <meshStandardMaterial color="pink" emissive="red" emissiveIntensity={receptivity * 2} wireframe />
      </Torus>
      {/* Creation */}
      <TorusKnot ref={creationRef} args={[0.5, 0.1, 100, 16]} scale={0}>
          <meshStandardMaterial color="white" emissive="purple" emissiveIntensity={coherence > 0.95 ? 2 : 0} />
      </TorusKnot>
    </group>
  );
};

const SceneContent = ({ will, receptivity }: { will: number, receptivity: number }) => {
    return (
        <>
            <ambientLight intensity={0.2} />
            <directionalLight position={[1, 1, 5]} intensity={1} />
            <GenderScene will={will} receptivity={receptivity} />
        </>
    )
}

export default function Gender() {
  const [will, setWill] = useState(0.5);
  const [receptivity, setReceptivity] = useState(0.5);

  const coherence = 1 - Math.abs(will - receptivity);

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={["#0b0c10"]} />
        <SceneContent will={will} receptivity={receptivity} />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-3 rounded w-96">
        <h2 className="text-xl text-white">The Principle of Gender</h2>
        <p className="text-xs opacity-80 text-white">"Gender is in everything; everything has its masculine and feminine principles."</p>
        <div className="pt-4 space-y-4">
          <div>
            <label className="text-white block pb-1">Will (Projective)</label>
            <input type="range" min="0" max="1" step="0.01" value={will} onChange={e => setWill(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="text-white block pb-1">Receptivity (Formative)</label>
            <input type="range" min="0" max="1" step="0.01" value={receptivity} onChange={e => setReceptivity(parseFloat(e.target.value))} className="w-full" />
          </div>
          <div className="pt-2">
            <label className="text-white">Coherence: {Math.round(coherence * 100)}%</label>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
              <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${coherence * 100}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
