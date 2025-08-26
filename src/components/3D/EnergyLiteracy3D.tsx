import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Battery, Zap, AlertTriangle, CheckCircle, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// --- Data Structures with Explanations ---
const commonDrains = [
  { name: 'Social Media Scrolling', explanation: 'Endless scrolling provides excessive, often low-quality, stimulation. This can lead to dopamine dysregulation, comparison anxiety, and mental fatigue, draining your cognitive and emotional energy.' },
  { name: 'Overthinking', explanation: 'Ruminating on past events or worrying about the future creates cyclical thought patterns that consume significant mental energy without leading to productive outcomes. It\'s like spinning your wheels in the mud.' },
  { name: 'Poor Boundaries', explanation: 'Saying "yes" when you mean "no" or consistently over-extending yourself for others depletes your energy reserves. Healthy boundaries are essential for preserving your vital life force.' },
  { name: 'Shallow Breathing', explanation: 'Shallow, chest-level breathing is often linked to the stress response. It limits oxygen intake and can keep your nervous system in a state of high alert, which is energetically expensive.' },
  { name: 'Negative Self-Talk', explanation: 'Your inner critic acts as an internal energy vampire. Constantly criticizing yourself creates feelings of stress and shame, which are low-frequency emotions that drain your vitality.' },
  { name: 'Perfectionism', explanation: 'Striving for unattainable standards creates chronic stress and fear of failure. The immense energy spent on worrying about and "perfecting" minor details leads to burnout.' }
];

const commonRestorations = [
  { name: 'Deep Breathing', explanation: 'Deep, diaphragmatic breathing activates the parasympathetic nervous system (the "rest and digest" state). This calms your body, reduces stress hormones, and increases oxygen flow, effectively recharging your system.' },
  { name: 'Nature Connection', explanation: 'Spending time in nature, also known as "grounding" or "earthing," helps to reset your nervous system. The natural frequencies and sensory inputs of the earth have a calming and restorative effect on the human biofield.' },
  { name: 'Gentle Movement', explanation: 'Activities like stretching, yoga, or walking help to release stagnant energy and physical tension stored in the body. It improves circulation and promotes the flow of endorphins, boosting your mood and energy.' },
  { name: 'Boundary Setting', explanation: 'Clearly defining and communicating your limits is an act of self-respect. It prevents energy leaks by ensuring you are not giving away more energy than you can sustainably offer.' },
  { name: 'Rest', explanation: 'Rest is not laziness; it is essential for cellular repair, mental processing, and nervous system regulation. True rest, free from stimulation, allows your body and mind to fully recover and replenish energy.' },
  { name: 'Nourishing Food', explanation: 'Food is a primary source of physical energy. Eating whole, nutrient-dense foods provides your body with the high-quality fuel it needs to operate optimally, whereas processed foods can cause inflammation and lethargy.' }
];


// --- Modal Component for Explanations ---
const ExplanationModal = ({ content, onClose }: { content: { name: string, explanation: string }, onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0.9 }}
      className="bg-background border border-primary/20 rounded-lg p-6 max-w-md w-full relative"
      onClick={(e) => e.stopPropagation()}
    >
      <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}><X className="h-4 w-4" /></Button>
      <h3 className="text-lg font-bold text-primary mb-4">{content.name}</h3>
      <p className="text-muted-foreground">{content.explanation}</p>
    </motion.div>
  </motion.div>
);


function EnergyField({ energyLevel, drainSources, restorationActive, phase }: any) {
  const fieldRef = useRef<THREE.Group>(null);
  const drainRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (fieldRef.current) {
      const intensity = energyLevel / 10;
      fieldRef.current.rotation.y += 0.005 * intensity;
      fieldRef.current.scale.setScalar(0.5 + intensity * 0.8);
    }
    if (drainRef.current && drainSources.length > 0) {
      drainRef.current.rotation.x += 0.02;
      drainRef.current.rotation.z -= 0.01;
    }
  });

  const fieldColor = energyLevel > 7 ? '#10b981' : energyLevel > 4 ? '#fbbf24' : '#ef4444';
  const fieldOpacity = Math.max(energyLevel / 10 * 0.6, 0.2);

  return (
    <group>
      <group ref={fieldRef}>
        <mesh><sphereGeometry args={[2, 32, 32]} /><meshStandardMaterial color={fieldColor} transparent opacity={fieldOpacity} emissive={fieldColor} emissiveIntensity={0.3} /></mesh>
        {[3, 4, 5].map((radius, index) => (<mesh key={index}><sphereGeometry args={[radius, 16, 16]} /><meshStandardMaterial color={fieldColor} transparent opacity={0.1 * (energyLevel / 10)} wireframe /></mesh>))}
      </group>
      <group ref={drainRef}>
        {drainSources.map((_: any, index: number) => (<mesh key={index} position={[Math.cos(index * Math.PI * 0.4) * 6, Math.sin(index * Math.PI * 0.3) * 3, Math.sin(index * Math.PI * 0.4) * 6]}><sphereGeometry args={[0.3, 8, 8]} /><meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} /></mesh>))}
      </group>
      {restorationActive && (<group>{[0, 1, 2, 3, 4, 5].map((index) => (<mesh key={index} position={[Math.cos(index * Math.PI / 3) * 7, Math.sin(index * Math.PI / 6) * 2, Math.sin(index * Math.PI / 3) * 7]}><sphereGeometry args={[0.1, 8, 8]} /><meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.8} /></mesh>))}</group>)}
      <Text position={[0, 6, 0]} fontSize={0.8} color={fieldColor} anchorX="center" anchorY="middle">{phase.toUpperCase()}</Text>
    </group>
  );
}

export default function EnergyLiteracy3D() {
  const [currentPhase, setCurrentPhase] = useState<'scan' | 'identify' | 'correct' | 'recheck'>('scan');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [drainSources, setDrainSources] = useState<string[]>([]);
  const [restorationMethods, setRestorationMethods] = useState<string[]>([]);
  const [bodyAwareness, setBodyAwareness] = useState(3);
  const [modalContent, setModalContent] = useState<{ name: string, explanation: string } | null>(null);

  const handlePhaseProgression = () => {
    const phases = ['scan', 'identify', 'correct', 'recheck'] as const;
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) setCurrentPhase(phases[currentIndex + 1]);
    else setCurrentPhase('scan');
  };

  const handleScanBody = () => {
    setBodyAwareness(prev => Math.min(prev + 1, 10));
    if (currentPhase === 'scan') handlePhaseProgression();
  };

  const handleIdentifyDrain = (drain: string) => {
    if (!drainSources.includes(drain)) {
      setDrainSources(prev => [...prev, drain]);
      setEnergyLevel(prev => Math.max(prev - 1, 1));
    }
  };

  const handleApplyCorrection = (method: string) => {
    if (!restorationMethods.includes(method)) {
      setRestorationMethods(prev => [...prev, method]);
      setEnergyLevel(prev => Math.min(prev + 2, 10));
    }
  };

  const getPhaseInstructions = () => {
    switch (currentPhase) {
      case 'scan': return 'Scan your body. Notice where energy feels depleted or heavy.';
      case 'identify': return 'Name the drain. What is taking your energy right now?';
      case 'correct': return 'Apply one correction. Choose a restoration method.';
      case 'recheck': return 'Check again. Has your energy improved? Repeat if needed.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black relative">
      <AnimatePresence>
        {modalContent && <ExplanationModal content={modalContent} onClose={() => setModalContent(null)} />}
      </AnimatePresence>

      <div className="absolute top-4 left-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader><CardTitle className="flex items-center gap-2 text-primary"><Battery className="h-5 w-5" />Energy Literacy Scanner</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2"><span>Energy Level</span><Badge variant="outline">{energyLevel}/10</Badge></div>
              <Progress value={energyLevel * 10} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>Phase:</span><Badge variant="outline">{currentPhase}</Badge></div>
              <div className="flex justify-between text-sm"><span>Body Awareness:</span><Badge variant="outline">{bodyAwareness}/10</Badge></div>
              <div className="flex justify-between text-sm"><span>Drains Identified:</span><Badge variant="outline">{drainSources.length}</Badge></div>
            </div>
            <div className="space-y-2">
              <Button onClick={handleScanBody} className="w-full" variant="outline"><Zap className="h-4 w-4 mr-2" />Scan Body</Button>
              <Button onClick={handlePhaseProgression} className="w-full">{currentPhase === 'recheck' ? 'Complete Cycle' : 'Next Phase'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute top-4 right-4 z-10 w-80">
        <Card className="bg-black/30 backdrop-blur-md border-primary/20">
          <CardHeader><CardTitle className="text-sm">{getPhaseInstructions()}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {currentPhase === 'identify' && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Common Energy Drains:</p>
                <div className="grid grid-cols-1 gap-1">
                  {commonDrains.map((drain) => (
                    <div key={drain.name} className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleIdentifyDrain(drain.name)} className="flex-grow justify-start text-xs h-8" disabled={drainSources.includes(drain.name)}>
                        {drainSources.includes(drain.name) ? <CheckCircle className="h-3 w-3 mr-2" /> : <AlertTriangle className="h-3 w-3 mr-2" />}
                        {drain.name}
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setModalContent(drain)}><HelpCircle className="h-3 w-3" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentPhase === 'correct' && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Restoration Methods:</p>
                <div className="grid grid-cols-1 gap-1">
                  {commonRestorations.map((method) => (
                     <div key={method.name} className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleApplyCorrection(method.name)} className="flex-grow justify-start text-xs h-8" disabled={restorationMethods.includes(method.name)}>
                          {restorationMethods.includes(method.name) ? <CheckCircle className="h-3 w-3 mr-2" /> : <Zap className="h-3 w-3 mr-2" />}
                          {method.name}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setModalContent(method)}><HelpCircle className="h-3 w-3" /></Button>
                      </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 text-xs text-muted-foreground"><p><strong>Remember:</strong> Small changes compound. One correction at a time.</p></div>
          </CardContent>
        </Card>
      </div>

      <Canvas camera={{ position: [10, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <EnergyField energyLevel={energyLevel} drainSources={drainSources} restorationActive={restorationMethods.length > 0} phase={currentPhase} />
        <OrbitControls enablePan={false} maxDistance={15} minDistance={5} />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-black/40 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/20 max-w-2xl">
          <p className="text-center text-primary font-medium">Energy literacy is sovereignty in action. Know where you leak, seal what you can control.</p>
        </motion.div>
      </div>
    </div>
  );
}