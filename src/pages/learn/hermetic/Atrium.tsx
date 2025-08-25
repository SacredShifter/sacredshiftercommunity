import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { Link } from 'react-router-dom'

function Gateway({ to, label, x }: { to: string; label: string; x: number }){
  return (
    <group position={[x,0,0]}>
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial emissive="#8b5cf6" color="#1f2937" />
      </mesh>
      <Html center>
        <a href={to} className="px-3 py-1 bg-black/60 rounded text-white no-underline">{label}</a>
      </Html>
    </group>
  )
}

export default function HermeticAtrium(){
  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0,2,6], fov: 60 }}>
        <color attach="background" args={["#0b0c10"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3,5,2]} intensity={1.2} />
        <Gateway to="/learn/hermetic/mentalism" label="Mentalism" x={-2.2} />
        <Gateway to="/learn/hermetic/vibration" label="Vibration" x={2.2} />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  )
}
