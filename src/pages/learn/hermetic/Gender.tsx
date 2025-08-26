import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'

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
      <mesh ref={masculineRef} position={[-0.5, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="skyblue" emissive="blue" emissiveIntensity={will * 2} wireframe />
      </mesh>
      <mesh ref={feminineRef} position={[0.5, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="pink" emissive="red" emissiveIntensity={receptivity * 2} wireframe />
      </mesh>
      <mesh ref={creationRef} scale={0}>
        <torusKnotGeometry args={[0.5, 0.1, 100, 16]} />
        <meshStandardMaterial color="white" emissive="purple" emissiveIntensity={coherence > 0.95 ? 2 : 0} />
      </mesh>
    </group>
  );
};

const SceneContent = ({ will, receptivity }: { will: number, receptivity: number }) => (
    <>
        <ambientLight intensity={0.2} />
        <directionalLight position={[1, 1, 5]} intensity={1} />
        <GenderScene will={will} receptivity={receptivity} />
    </>
)

export default function Gender() {
  const [will, setWill] = useState(0.5);
  const [receptivity, setReceptivity] = useState(0.5);
  const [showInfo, setShowInfo] = useState(false)
  const coherence = 1 - Math.abs(will - receptivity);

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <color attach="background" args={["#0b0c10"]} />
        <SceneContent will={will} receptivity={receptivity} />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-4 rounded-lg w-96 border border-white/10">
        <h2 className="text-xl text-white font-bold">The Principle of Gender</h2>
        <p className="text-xs opacity-80 pb-2">"Gender is in everything; everything has its masculine and feminine principles."</p>
        <div className="pt-2 space-y-4">
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
        <Button onClick={() => setShowInfo(!showInfo)} variant="outline" size="sm" className="w-full mt-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn More
            <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showInfo ? 'rotate-180' : ''}`} />
        </Button>
        <AnimatePresence>
        {showInfo && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-4 mt-4 border-t border-white/10 text-sm text-white/90 space-y-3">
                    <p>This principle explains that Gender is manifested in everything. The Masculine principle is projective, giving out or expressing. The Feminine principle is receptive, taking in and generating new forms. Both are required for any creation to take place, on any plane.</p>
                    <p><strong className="text-purple-300">Application:</strong> In any project, there is a time for assertive action (Masculine) and a time for gestation and planning (Feminine). True creation happens when these two forces are balanced in coherence, as shown by the sliders.</p>
                    <p><strong className="text-purple-300">Reflection:</strong> In my life, do I tend to favor the Masculine (action) or Feminine (receptivity) principle more? How can I better balance them to create what I desire?</p>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
}
