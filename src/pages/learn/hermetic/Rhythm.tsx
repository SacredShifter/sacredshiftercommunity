import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'

const PendulumWave = ({ count = 15 }) => {
  const pendulums = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const length = 2 + i * 0.15;
      const period = 2 * Math.PI * Math.sqrt(length / 9.8);
      arr.push({ length, period });
    }
    return arr;
  }, [count]);

  return (
    <group>
      {pendulums.map((p, i) => (
        <Pendulum key={i} length={p.length} period={p.period} position-z={(-count / 2 + i) * 0.5} />
      ))}
    </group>
  );
};

const Pendulum = ({ length, period, ...props }: { length: number, period: number } & JSX.IntrinsicElements['group']) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = Math.sin(t * (2 * Math.PI / period)) * 0.8;
    if (groupRef.current) groupRef.current.rotation.z = angle;
  });

  return (
    <group ref={groupRef} {...props}>
      <mesh position={[0, length, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <Line points={[[0, 0, 0], [0, length, 0]]} color="white" lineWidth={3} />
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="white" emissive="purple" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

const SceneContent = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const lightIntensity = (Math.sin(t * 0.2) + 1) / 2 * 1.5 + 0.5
    if (lightRef.current) lightRef.current.intensity = lightIntensity
  })
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight ref={lightRef} position={[5, 5, 5]} intensity={1.5} />
      <PendulumWave />
    </>
  )
}

export default function Rhythm() {
  const [showInfo, setShowInfo] = useState(false)
  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position: [0, 1, 8] }}>
        <color attach="background" args={["#0b0c10"]} />
        <SceneContent />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-4 rounded-lg w-96 border border-white/10">
        <h2 className="text-xl text-white font-bold">The Principle of Rhythm</h2>
        <p className="text-xs opacity-80 pb-2">"Everything flows, out and in; everything has its tides."</p>

        <Button onClick={() => setShowInfo(!showInfo)} variant="outline" size="sm" className="w-full mt-2">
            <BookOpen className="h-4 w-4 mr-2" />
            Learn More
            <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${showInfo ? 'rotate-180' : ''}`} />
        </Button>

        <AnimatePresence>
        {showInfo && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-4 mt-4 border-t border-white/10 text-sm text-white/90 space-y-3">
                    <p>This principle explains that in everything there is a measured motion, a to and fro, a flow and inflow. This swing is seen in the cycles of life, death, and rebirth, the rise and fall of nations, and our own emotional and mental states.</p>
                    <p><strong className="text-purple-300">Application:</strong> By understanding this principle, you can learn to neutralize its effects. When you feel a negative swing (e.g., sadness), do not get attached. Know that the pendulum will swing back to the positive side. You can rise above the swing by polarizing yourself at the desired pole.</p>
                    <p><strong className="text-purple-300">Reflection:</strong> What are the major rhythms in my life? How can I use the law of rhythm to my advantage instead of being a victim of its swing?</p>
                </div>
            </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  )
}
