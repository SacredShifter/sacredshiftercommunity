import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function Lattice({ coherence }: { coherence: number }){
  const ref = useRef<THREE.Points>(null)
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const N = 2000
    const pos = new Float32Array(N*3)
    for(let i=0;i<N;i++){
      const r = 1.2 + Math.random()*0.2
      const t = Math.random()*Math.PI*2
      const p = Math.acos(2*Math.random()-1)
      pos[i*3+0] = r*Math.sin(p)*Math.cos(t)
      pos[i*3+1] = r*Math.sin(p)*Math.sin(t)
      pos[i*3+2] = r*Math.cos(p)
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3))
    return g
  },[])
  useFrame(({clock})=>{
    const t = clock.getElapsedTime()
    const s = 0.02*(1-coherence)
    if(ref.current){
      const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
      for(let i=0;i<pos.count;i++){
        pos.setX(i, pos.getX(i) + (Math.sin(t+i)*s))
      }
      pos.needsUpdate = true
    }
  })
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.02} color="#93c5fd" />
    </points>
  )
}

export default function Mentalism(){
  const [coherence, setCoherence] = useState(0.5)
  const [thought, setThought] = useState('I move with clarity.')
  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position:[0,0,4] }}>
        <color attach="background" args={["#0b0c10"]} />
        <ambientLight intensity={0.6}/>
        <Lattice coherence={coherence} />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-3 rounded">
        <input className="w-80 px-2 py-1 bg-black/60 border border-white/10 rounded"
          value={thought} onChange={e=>setThought(e.target.value)} />
        <label className="block text-sm">Intent Coherence: {Math.round(coherence*100)}%</label>
        <input type="range" min={0} max={1} step={0.01} value={coherence} onChange={e=>setCoherence(parseFloat(e.target.value))} />
        <p className="text-xs opacity-80">Hold a single calm sentence. As coherence increases, the lattice stabilizes.</p>
      </div>
    </div>
  )
}
