import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TreePine, BookOpen, Sparkles, Volume2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sephiroth, pathConnections, SephirahData, PathData } from '@/data/kabbalahTreeOfLife';

// Tone generation hook
function useKabbalahFrequency() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [playingFrequency, setPlayingFrequency] = useState<number | null>(null);

  const initializeAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const playTone = async (frequency: number) => {
    if (playingFrequency === frequency) {
      // If the same frequency is playing, stop it
      stopTone();
      return;
    }

    stopTone(); // Stop any previous tone

    const audioContext = await initializeAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setPlayingFrequency(frequency);
  };

  const stopTone = () => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.2);
      oscillatorRef.current.stop(audioContextRef.current.currentTime + 0.2);
    }
    oscillatorRef.current = null;
    gainNodeRef.current = null;
    setPlayingFrequency(null);
  };

  useEffect(() => {
    return () => {
      stopTone();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { playTone, stopTone, playingFrequency };
}


function Sephirah({ sephirah, isSelected, onSelect, playingFrequency }: { sephirah: SephirahData; isSelected: boolean; onSelect: () => void; playingFrequency: number | null; }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current && materialRef.current) {
      const baseScale = isSelected ? 1.3 : 1;
      const pulse = Math.sin(clock.getElapsedTime() * (sephirah.frequencyHz / 200)) * 0.1;
      meshRef.current.scale.setScalar(baseScale + pulse);

      const isPlaying = playingFrequency === sephirah.frequencyHz;
      materialRef.current.emissiveIntensity = isPlaying ? 2.5 : (isSelected ? 1.5 : 0.8);
    }
  });

  return (
    <group position={sephirah.position}>
      <mesh ref={meshRef} onClick={onSelect}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          ref={materialRef}
          color={sephirah.color}
          emissive={sephirah.color}
          toneMapped={false}
        />
      </mesh>
      
      <Html position={[0, -0.6, 0]} center>
        <div className="font-semibold pointer-events-none text-center text-white text-sm" style={{ textShadow: '0 0 4px rgba(0,0,0,1)' }}>
          {sephirah.name}
        </div>
      </Html>
      
      <Html position={[0, -0.8, 0]} center>
        <div className="font-medium pointer-events-none text-center text-gray-300 text-xs" style={{ textShadow: '0 0 4px rgba(0,0,0,1)' }}>
          {sephirah.hebrew}
        </div>
      </Html>
    </group>
  );
}

function TreePaths({ onPathSelect }: { onPathSelect: (path: PathData | null) => void }) {
  return (
    <group>
      {pathConnections.map((path, index) => {
        const fromSeph = sephiroth.find(s => s.id === path.from);
        const toSeph = sephiroth.find(s => s.id === path.to);
        if (!fromSeph || !toSeph) return null;

        return (
          <Line
            key={index}
            points={[fromSeph.position, toSeph.position]}
            color="#ffffff"
            lineWidth={1}
            transparent
            opacity={0.2}
            onPointerOver={() => onPathSelect(path)}
            onPointerOut={() => onPathSelect(null)}
          />
        );
      })}
    </group>
  );
}

function SacredGeometryBackground() {
  const grid = useMemo(() => {
    const size = 20;
    const divisions = 20;
    return <gridHelper args={[size, divisions, '#444', '#888']} rotation={[Math.PI / 2, 0, 0]} />;
  }, []);
  return grid;
}

export default function KabbalahTreeOfLife3D() {
  const [selectedSephirah, setSelectedSephirah] = useState<SephirahData | null>(null);
  const [selectedPath, setSelectedPath] = useState<PathData | null>(null);
  const [showPaths, setShowPaths] = useState(true);
  const { playTone, playingFrequency } = useKabbalahFrequency();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        
        {showPaths && <TreePaths onPathSelect={setSelectedPath} />}
        
        {sephiroth.map((sephirah) => (
          <Sephirah
            key={sephirah.id}
            sephirah={sephirah}
            isSelected={selectedSephirah?.id === sephirah.id}
            onSelect={() => setSelectedSephirah(selectedSephirah?.id === sephirah.id ? null : sephirah)}
            playingFrequency={playingFrequency}
          />
        ))}
        
        <Html position={[0, 5.5, 0]} center>
          <div className="font-bold pointer-events-none text-center text-white text-2xl" style={{ textShadow: '0 0 8px rgba(128,0,128,0.8)' }}>
            Kabbalah: Tree of Life
          </div>
        </Html>

        <SacredGeometryBackground />
        
        <OrbitControls enablePan={true} enableDamping={true} dampingFactor={0.05} maxDistance={15} minDistance={3} />
        {/* <EffectComposer>
          <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        </EffectComposer> */}
      </Canvas>

      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30 text-white max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-300">
              <TreePine /> Tree Explorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setShowPaths(!showPaths)} className="w-full bg-transparent text-white hover:bg-purple-500/20">
              {showPaths ? 'Hide Paths' : 'Show Paths'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {selectedSephirah && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute top-4 right-4 z-10 max-w-md"
          >
            <Card className="bg-black/70 backdrop-blur-md border-yellow-300/30 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-yellow-300">
                  {selectedSephirah.name} ({selectedSephirah.hebrew})
                  <Button size="icon" variant="ghost" onClick={() => playTone(selectedSephirah.frequencyHz)} className="text-yellow-300 hover:bg-yellow-300/20">
                    <Volume2 className={playingFrequency === selectedSephirah.frequencyHz ? 'animate-pulse' : ''} />
                  </Button>
                </CardTitle>
                <p className="text-sm text-yellow-200/80">{selectedSephirah.meaning} - {selectedSephirah.attribute}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{selectedSephirah.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><strong>Planet:</strong> {selectedSephirah.planet}</div>
                  <div><strong>Archangel:</strong> {selectedSephirah.archangel}</div>
                  <div><strong>Divine Name:</strong> {selectedSephirah.divineName}</div>
                  <div><strong>Chakra:</strong> {selectedSephirah.chakra}</div>
                  <div><strong>Frequency:</strong> {selectedSephirah.frequencyHz} Hz</div>
                </div>
                {selectedSephirah.name === 'Netzach' && (
                  <div className="p-2 border border-green-300/30 bg-green-500/10 rounded-lg text-xs">
                    <p className="font-bold text-green-300">New Research Integration:</p>
                    <p>683 Hz is a hypothesised resonance filling a gap in the Sephiroth frequency ladder — bridging harmony and eternity.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <Card className="bg-black/70 backdrop-blur-md border-blue-300/30 text-white p-4 rounded-xl text-center">
              <p>Path: <strong>{selectedPath.hebrewLetter}</strong></p>
              <p>Tarot: <strong>{selectedPath.tarotCard}</strong></p>
              <p>Astrology: <strong>{selectedPath.astrologicalAttribution}</strong></p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 z-10 max-w-md">
        <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-300">
              <Sparkles /> Sacred Wisdom
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <p>The Tree of Life is a divine blueprint of creation, showing consciousness descending from unity to manifestation through ten Sephiroth (spheres) connected by 22 paths.</p>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-4 left-4 z-10 text-white/50 text-xs">
        Click a Sephirah to explore • Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}