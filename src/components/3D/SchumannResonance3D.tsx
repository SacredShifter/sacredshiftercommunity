import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, Globe, Activity, Play, Pause, Volume2, Satellite } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSchumannFrequency } from '@/hooks/useSchumannFrequency';
import { useSpaceWeather } from '@/hooks/useSpaceWeather';

interface ResonanceWave {
  frequency: number;
  amplitude: number;
  color: string;
  active: boolean;
}

const schumannFrequencies: ResonanceWave[] = [
  { frequency: 7.83, amplitude: 1.0, color: "#ff0000", active: true },   // Fundamental
  { frequency: 14.3, amplitude: 0.6, color: "#ff7f00", active: false },  // 2nd harmonic
  { frequency: 20.8, amplitude: 0.4, color: "#ffff00", active: false },  // 3rd harmonic
  { frequency: 27.3, amplitude: 0.3, color: "#00ff00", active: false },  // 4th harmonic
  { frequency: 33.8, amplitude: 0.2, color: "#0000ff", active: false },  // 5th harmonic
];

function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color="#4a90e2"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function IonosphereLayers() {
  const layersRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (layersRef.current) {
      layersRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={layersRef}>
      {[1.5, 2.0, 2.5].map((radius, index) => (
        <mesh key={index}>
          <sphereGeometry args={[radius, 32, 16]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.1}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

function ResonanceField({ waves }: { waves: ResonanceWave[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const waveRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    waves.forEach((wave, index) => {
      if (waveRefs.current[index] && wave.active) {
        const time = state.clock.elapsedTime;
        const scale = 1 + Math.sin(time * wave.frequency * 0.1) * wave.amplitude * 0.2;
        waveRefs.current[index].scale.setScalar(scale);
        
        // Rotate at frequency-based speed
        waveRefs.current[index].rotation.y = time * wave.frequency * 0.01;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {waves.map((wave, index) => (
        <mesh
          key={index}
          ref={(el) => { if (el) waveRefs.current[index] = el; }}
          visible={wave.active}
        >
          <torusGeometry args={[3 + index * 0.5, 0.02, 8, 32]} />
          <meshBasicMaterial
            color={wave.color}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

function LightningFlash() {
  const flashRef = useRef<THREE.PointLight>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useFrame((state) => {
    if (flashRef.current) {
      const time = state.clock.elapsedTime;
      
      // Random lightning flashes
      if (Math.sin(time * 10) > 0.98 && !isFlashing) {
        setIsFlashing(true);
        flashRef.current.intensity = 5;
        setTimeout(() => {
          setIsFlashing(false);
          if (flashRef.current) flashRef.current.intensity = 0;
        }, 100);
      }
    }
  });

  return (
    <pointLight
      ref={flashRef}
      position={[2, 1, 1]}
      color="#ffffff"
      intensity={0}
    />
  );
}

function BrainwaveParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      particlesRef.current.rotation.y = time * 0.05;
      
      // Pulse effect at 7.83 Hz (scaled for visibility)
      const pulse = Math.sin(time * 7.83 * 0.1) * 0.5 + 0.5;
      (particlesRef.current.material as THREE.PointsMaterial).opacity = 0.3 + pulse * 0.4;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#ff69b4" 
        size={0.05} 
        sizeAttenuation 
        transparent 
        opacity={0.5}
      />
    </points>
  );
}

export default function SchumannResonance3D() {
  const [activeWaves, setActiveWaves] = useState<ResonanceWave[]>(schumannFrequencies);
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(7.83);
  const [showSpaceWeather, setShowSpaceWeather] = useState(true);
  
  // Hooks for audio and space weather
  const { 
    isPlaying, 
    activeFrequencies, 
    toggleFrequency, 
    togglePlayback, 
    setSpaceWeatherImpact,
    frequencies: schumannAudioFreqs 
  } = useSchumannFrequency();
  
  const { 
    data: spaceWeatherData, 
    loading: spaceWeatherLoading, 
    error: spaceWeatherError,
    fetchGeomagneticStorms,
    fetchSolarFlares 
  } = useSpaceWeather();

  // Update space weather impact on audio frequencies
  useEffect(() => {
    if (spaceWeatherData?.events?.length > 0) {
      const highImpactEvents = spaceWeatherData.events.filter(event => 
        event.impact.toLowerCase().includes('high')
      );
      
      if (highImpactEvents.length > 0) {
        setSpaceWeatherImpact('high');
      } else if (spaceWeatherData.events.length > 2) {
        setSpaceWeatherImpact('moderate');
      } else {
        setSpaceWeatherImpact('low');
      }
    }
  }, [spaceWeatherData, setSpaceWeatherImpact]);

  const toggleWave = (frequency: number) => {
    setActiveWaves(prev => 
      prev.map(wave => 
        wave.frequency === frequency 
          ? { ...wave, active: !wave.active }
          : wave
      )
    );
  };

  const brainwaveCorrelations = {
    7.83: {
      name: "Alpha-Theta Bridge",
      state: "Meditation, Creativity",
      description: "The fundamental Schumann resonance aligns with the transition between alpha and theta brainwaves, promoting deep meditation and creative states."
    },
    14.3: {
      name: "Beta Resonance", 
      state: "Alert Awareness",
      description: "The second harmonic correlates with beta brainwaves, supporting focused attention and cognitive processing."
    },
    20.8: {
      name: "High Beta",
      state: "Analytical Thinking",
      description: "Higher harmonics correspond to enhanced analytical thinking and problem-solving capabilities."
    }
  };

  const resonanceInfo = {
    discovery: "Discovered by physicist Winfried Otto Schumann in 1952, these are electromagnetic resonances in the Earth-ionosphere cavity.",
    mechanism: "Global lightning activity (about 50 flashes per second) creates electromagnetic waves that resonate in the cavity between Earth's surface and the ionosphere.",
    biological: "These frequencies closely match human brainwave patterns, suggesting a deep evolutionary connection between human consciousness and Earth's electromagnetic field.",
    effects: ["Circadian rhythm regulation", "Stress reduction", "Enhanced meditation", "Improved sleep quality", "Emotional balance"]
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-blue-950/20 to-purple-950/20 relative overflow-hidden">
      {/* 3D Scene - Reduced height for better scrolling */}
      <div className="h-[70vh] relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <EarthSphere />
          <IonosphereLayers />
          <ResonanceField waves={activeWaves} />
          <LightningFlash />
          <BrainwaveParticles />
          
          <Html position={[0, 5, 0]} center>
            <div 
              className="font-bold pointer-events-none text-center"
              style={{ 
                color: "#ffffff",
                fontSize: '20px',
                textShadow: '0 0 8px rgba(0,0,0,0.8)'
              }}
            >
              Schumann Resonance Chamber
            </div>
          </Html>
          
          <OrbitControls enablePan={false} maxDistance={12} minDistance={4} />
        </Canvas>
      </div>

      {/* Enhanced Frequency Controls with Audio */}
      <div className="absolute top-16 left-6 z-10">
        <Card className="bg-background/80 backdrop-blur-sm border-primary/20 max-w-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Resonance Frequencies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Earth's heartbeat: electromagnetic frequencies that pulse around our planet
            </p>
            
            {/* Audio Control */}
            <div className="flex items-center gap-2 p-2 bg-muted rounded">
              <Button
                size="sm"
                onClick={togglePlayback}
                variant={isPlaying ? "default" : "outline"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Volume2 className="h-4 w-4" />
              <span className="text-xs">Play Frequencies</span>
            </div>
            
            <div className="space-y-2">
              {schumannFrequencies.map((wave) => {
                const isAudioActive = activeFrequencies.includes(wave.frequency);
                return (
                  <div key={wave.frequency} className="flex items-center justify-between">
                    <Button
                      variant={wave.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleWave(wave.frequency)}
                      className="flex-1 mr-2"
                      style={{ 
                        backgroundColor: wave.active ? wave.color : undefined,
                        borderColor: wave.color
                      }}
                    >
                      {wave.frequency} Hz
                      {isAudioActive && <Volume2 className="h-3 w-3 ml-1" />}
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFrequency(wave.frequency)}
                        className={isAudioActive ? "text-green-500" : ""}
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFrequency(
                          selectedFrequency === wave.frequency ? null : wave.frequency
                        )}
                      >
                        <Brain className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Space Weather Panel */}
      {showSpaceWeather && (
        <div className="absolute top-16 right-6 z-10 max-w-sm">
          <Card className="bg-background/80 backdrop-blur-sm border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-cyan-500" />
                Space Weather Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {spaceWeatherLoading && (
                <div className="text-xs text-muted-foreground">Loading space weather data...</div>
              )}
              
              {spaceWeatherError && (
                <div className="text-xs text-red-500">Failed to load space weather data</div>
              )}
              
              {spaceWeatherData && (
                <>
                  <div className="text-xs text-muted-foreground">
                    {spaceWeatherData.summary.resonanceContext}
                  </div>
                  
                  {spaceWeatherData.events.slice(0, 3).map((event, index) => (
                    <div key={index} className="p-2 bg-muted rounded text-xs">
                      <div className="font-medium">{event.eventType}</div>
                      <div className="text-muted-foreground">{event.impact}</div>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={fetchGeomagneticStorms}>
                      Update GST
                    </Button>
                    <Button size="sm" variant="outline" onClick={fetchSolarFlares}>
                      Solar Flares
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Frequency Information */}
      {selectedFrequency && brainwaveCorrelations[selectedFrequency as keyof typeof brainwaveCorrelations] && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-16 right-6 z-10 max-w-md"
        >
          <Card className="bg-background/90 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-500" />
                {selectedFrequency} Hz - {brainwaveCorrelations[selectedFrequency as keyof typeof brainwaveCorrelations].name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <Badge variant="outline" className="text-sm">
                  {brainwaveCorrelations[selectedFrequency as keyof typeof brainwaveCorrelations].state}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {brainwaveCorrelations[selectedFrequency as keyof typeof brainwaveCorrelations].description}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Educational Content Section - Now scrollable below 3D view */}
      <div className="p-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl font-sacred bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Schumann Resonance
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Earth's electromagnetic heartbeat — a natural frequency that synchronizes with our brainwaves, linking human consciousness to the living planet
          </p>
        </motion.div>

        {/* Core Understanding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="h-6 w-6 text-primary" />
                What It Is
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                <strong>Discovered by physicist Winfried Otto Schumann in 1952.</strong>
              </p>
              <p>
                It's Earth's <strong>"electromagnetic heartbeat"</strong> — standing waves trapped between the Earth's surface and the ionosphere.
              </p>
              <p>
                Generated by <strong>global lightning activity</strong> (around 50 flashes per second worldwide).
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-6 w-6 text-primary" />
                The Frequencies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed">
              <p>
                <strong>Fundamental = 7.83 Hz</strong> (the "Earth's heartbeat")
              </p>
              <p>
                <strong>Harmonics:</strong> 14.3 Hz, 20.8 Hz, 27.3 Hz, 33.8 Hz, etc.
              </p>
              <p>
                These correspond to <strong>human brainwave bands</strong>:
                <br />• 7.83 Hz ≈ Theta/Alpha (meditative, relaxed, creativity)
                <br />• 14.3 Hz ≈ Beta (alertness, concentration)
                <br />• Higher harmonics ≈ High Beta/Gamma (analytical problem-solving)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Biological Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="h-6 w-6 text-secondary" />
                Biological & Spiritual Connection
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Neural Entrainment</h4>
                    <p className="text-sm text-muted-foreground">
                      Human nervous systems and circadian rhythms naturally entrain to these frequencies.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">Wellness Effects</h4>
                    <p className="text-sm text-muted-foreground">
                      People often report deeper meditation, improved sleep, and reduced stress when in resonance with the fundamental frequency.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-accent mb-1">Gateway Frequency</h4>
                    <p className="text-sm text-muted-foreground">
                      Some traditions equate 7.83 Hz to the "gateway frequency" — the border between waking consciousness and deep meditation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Planetary Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      Shows humans are literally wired to Earth electromagnetically — a measurable bridge between physics and consciousness.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why It Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="border-2 border-accent/20 bg-gradient-to-br from-card to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-6 w-6 text-accent" />
                Why It Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 text-xs">1</Badge>
                  <div>
                    <strong>Electromagnetic Unity:</strong> Shows humans are literally wired to Earth electromagnetically.
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 text-xs">2</Badge>
                  <div>
                    <strong>Mood & Health:</strong> Variations in Schumann Resonance (e.g., during geomagnetic storms) can influence sleep, mood, and even collective coherence.
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 text-xs">3</Badge>
                  <div>
                    <strong>Science Meets Spirit:</strong> It's a bridge between physics and consciousness — measurable science that overlaps with ancient wisdom about planetary resonance.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-destructive/20 bg-gradient-to-br from-card to-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-6 w-6 text-destructive" />
                Space Weather Effects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50 border border-destructive/20">
                <h4 className="font-semibold text-destructive mb-2">Solar Influence:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Solar flares and coronal mass ejections affect the ionosphere</li>
                  <li>• Geomagnetic storms alter Schumann resonance patterns</li>
                  <li>• These changes can influence human biorhythms</li>
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Real-Time Connection:</h4>
                <p className="text-muted-foreground">
                  NASA's space weather data shows how solar activity ripples through Earth's electromagnetic field, 
                  affecting the very frequencies our consciousness resonates with.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive Features Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-primary">
                How to Use This Resonance Chamber
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 rounded-lg bg-background/50">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-semibold mb-2">Frequency Activation</h4>
                  <p className="text-muted-foreground">
                    Toggle each harmonic to visualize how Earth's electromagnetic field pulses at different frequencies.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-background/50">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-secondary" />
                  <h4 className="font-semibold mb-2">Brainwave Correlation</h4>
                  <p className="text-muted-foreground">
                    Click the brain icon to see how each frequency corresponds to human consciousness states.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-background/50">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <h4 className="font-semibold mb-2">Lightning Generation</h4>
                  <p className="text-muted-foreground">
                    Watch how global lightning activity creates these standing waves between Earth and sky.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-primary/20">
                <p className="text-lg font-medium text-foreground">
                  "The Schumann Resonance is Earth's electromagnetic heartbeat — 
                  a natural frequency that synchronizes with our brainwaves, linking human consciousness to the living planet."
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  — Scientific Research & Ancient Wisdom United
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}