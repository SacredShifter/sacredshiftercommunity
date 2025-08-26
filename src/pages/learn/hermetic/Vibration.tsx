import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const vertexShader = `
  uniform float u_time;
  uniform float u_amp;
  uniform float u_freq;

  void main() {
    vec3 pos = position;
    // The wave now incorporates frequency, making it visually faster/slower
    float wave = sin(u_time * (u_freq / 200.0) + pos.x * 1.2 + pos.y * 1.3 + pos.z * 1.4);
    // The displacement is controlled by amplitude
    pos.y += wave * 0.05 * u_amp;

    vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
    gl_PointSize = 3.0;
  }
`

const fragmentShader = `
  void main() {
    gl_FragColor = vec4(0.65, 0.95, 0.81, 1.0); // #a7f3d0
  }
`

function Particles({ amp, freq }: { amp: number, freq: number }){
  const pointsRef = useRef<THREE.Points>(null!)

  const [geometry, material] = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const N = 1500
    const pos = new Float32Array(N*3)
    for(let i=0;i<N;i++){
      pos[i*3+0]=(Math.random()-0.5)*3
      pos[i*3+1]=(Math.random()-0.5)*3
      pos[i*3+2]=(Math.random()-0.5)*3
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3))

    const m = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
        u_amp: { value: amp },
        u_freq: { value: freq },
      },
      vertexShader,
      fragmentShader,
    })

    return [g, m]
  }, [])

  useFrame(({clock})=>{
    if (material) {
      material.uniforms.u_time.value = clock.getElapsedTime()
      material.uniforms.u_amp.value = amp
      material.uniforms.u_freq.value = freq
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  )
}

export default function Vibration(){
  const [freq, setFreq] = useState(440)
  const [amp, setAmp] = useState(0.3)
  const audio = useRef<{
    ctx: AudioContext,
    osc: OscillatorNode,
    gain: GainNode
  } | null>(null);

  // Efficiently manage the Web Audio API context
  useEffect(() => {
    // Initialize audio context on first render
    if (!audio.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      audio.current = { ctx, osc, gain };
    }

    // Update frequency and amplitude without recreating the context
    if (audio.current) {
      audio.current.osc.frequency.setValueAtTime(freq, audio.current.ctx.currentTime);
      audio.current.gain.gain.setValueAtTime(amp * 0.05, audio.current.ctx.currentTime);
    }

    // Cleanup on unmount
    return () => {
      if (audio.current) {
        audio.current.osc.stop();
        audio.current.ctx.close();
        audio.current = null;
      }
    }
  }, [freq, amp])

  return (
    <div className="w-screen h-screen relative">
      <Canvas camera={{ position:[0,0,5] }}>
        <color attach="background" args={["#0b0c10"]} />
        <ambientLight intensity={0.6} />
        <Particles amp={amp} freq={freq} />
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
