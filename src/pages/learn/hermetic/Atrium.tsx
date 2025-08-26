import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { Link } from 'react-router-dom'

function Gateway({ to, label, position }: { to: string; label: string; position: [number, number, number] }){
  return (
    <group position={position}>
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
  const principles = [
    { key: 'mentalism', label: 'Mentalism' },
    { key: 'correspondence', label: 'Correspondence' },
    { key: 'vibration', label: 'Vibration' },
    { key: 'polarity', label: 'Polarity' },
    { key: 'rhythm', label: 'Rhythm' },
    { key: 'cause-effect', label: 'Cause & Effect' },
    { key: 'gender', label: 'Gender' },
  ];

  const radius = 3.5;

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <color attach="background" args={["#0b0c10"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />
        {principles.map((p, i) => {
          const angle = (i / principles.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle);
          const z = radius * Math.sin(angle);
          return <Gateway key={p.key} to={`/learn/hermetic/${p.key}`} label={p.label} position={[x, 0, z]} />;
        })}
        <OrbitControls enablePan={false} maxDistance={12} minDistance={3} />
      </Canvas>
    </div>
  )
}
