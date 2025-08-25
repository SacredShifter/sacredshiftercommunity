import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function Particles({ amp }: { amp: number }){
  const ref = useRef<THREE.Points>(null)
  const geom = useMemo(()=>{
    const g = new THREE.BufferGeometry()
    const N = 1500
    const pos = new Float32Array(N*3)
    for(let i=0;i<N;i++){
      pos[i*3+0]=(Math.random()-0.5)*3
      pos[i*3+1]=(Math.random()-0.5)*3
      pos[i*3+2]=(Math.random()-0.5)*3
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3))
    return g
  },[])
  useFrame(({clock})=>{
    const t = clock.getElapsedTime()
    if(!ref.current) return
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute
    for(let i=0;i<pos.count;i++){
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
      const d = Math.sin(t + x*1.2 + y*1.3 + z*1.4)
      pos.setY(i, y + d*0.001*amp)
    }
    pos.needsUpdate = true
  })
  return (
    <points ref={ref} geometry={geom}>
      <pointsMaterial size={0.03} color="#a7f3d0" />
    </points>
  )
}

export default function Vibration(){
  const [freq, setFreq] = useState(440)
  const [amp, setAmp] = useState(0.3)
  useEffect(()=>{
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine';
    osc.frequency.value = freq
    gain.gain.value = amp*0.05
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    return ()=>{ osc.stop(); ctx.close() }
  },[freq, amp])

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position:[0,0,5] }}>
        <color attach="background" args={["#0b0c10"]} />
        <ambientLight intensity={0.6} />
        <Particles amp={amp} />
      </Canvas>
      <div className="absolute top-4 left-4 space-y-2 bg-black/50 p-3 rounded w-80">
        <label className="block text-sm">Frequency: {freq.toFixed(0)} Hz</label>
        <input type="range" min={110} max={880} step={1} value={freq} onChange={e=>setFreq(parseFloat(e.target.value))} />
        <label className="block text-sm">Amplitude</label>
        <input type="range" min={0} max={1} step={0.01} value={amp} onChange={e=>setAmp(parseFloat(e.target.value))} />
        <p className="text-xs opacity-80">Vibration shapes form. Tune frequency & amplitude and watch the field respond.</p>
      </div>
    </div>
  )
}
