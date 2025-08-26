import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const vertexShader = `
  uniform float u_time;
  uniform float u_coherence;
  attribute float pindex;

  void main() {
    vec3 pos = position;
    float s = 0.02 * (1.0 - u_coherence);
    // The original logic displaced on X, but Y looks more like a 'lattice'
    pos.y += sin(u_time + pindex) * s;

    vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
    gl_PointSize = 2.0;
  }
`

const fragmentShader = `
  void main() {
    gl_FragColor = vec4(0.576, 0.772, 0.992, 1.0); // #93c5fd
  }
`

function Lattice({ coherence }: { coherence: number }){
  const pointsRef = useRef<THREE.Points>(null!)

  // Memoize geometry and material to prevent recreation on every render
  const [geometry, material] = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const N = 2000
    const pos = new Float32Array(N*3)
    const pindex = new Float32Array(N)

    for(let i=0; i<N; i++){
      const r = 1.2 + Math.random()*0.2
      const t = Math.random()*Math.PI*2
      const p = Math.acos(2*Math.random()-1)
      pos[i*3+0] = r*Math.sin(p)*Math.cos(t)
      pos[i*3+1] = r*Math.sin(p)*Math.sin(t)
      pos[i*3+2] = r*Math.cos(p)
      pindex[i] = i
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3))
    g.setAttribute('pindex', new THREE.BufferAttribute(pindex, 1))

    const m = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_coherence: { value: 0.5 },
      },
      vertexShader,
      fragmentShader,
    })

    return [g, m]
  },[])

  useFrame(({clock})=>{
    if(material){
      material.uniforms.u_time.value = clock.getElapsedTime()
      material.uniforms.u_coherence.value = coherence
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
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
