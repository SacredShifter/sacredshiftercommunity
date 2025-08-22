import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useBreathOfSourceModule } from '@/hooks/useBreathOfSourceModule';
import BreathOrb from '@/components/BreathOfSource3D/BreathOrb';
import WheelVisualization from '@/components/BreathOfSource3D/WheelVisualization';
import HUDInterface from '@/components/BreathOfSource3D/HUDInterface';
import TrustSpeedControls from '@/components/BreathOfSource3D/TrustSpeedControls';
import SovereigntyAnchor from '@/components/BreathOfSource3D/SovereigntyAnchor';
import ReflectionPanel from '@/components/BreathOfSource3D/ReflectionPanel';
import BreathAudio from '@/components/BreathOfSource3D/BreathAudio';
import LessonContent from '@/components/BreathOfSource3D/LessonContent';
import BiofeedbackDisplay from '@/components/BreathOfSource3D/BiofeedbackDisplay';
import * as THREE from 'three';

// Sacred geometry background
function SacredBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]} scale={[20, 20, 1]}>
      <planeGeometry args={[1, 1, 32, 32]} />
      <shaderMaterial
        transparent
        uniforms={{
          uTime: { value: 0 },
          uOpacity: { value: 0.1 }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uOpacity;
          varying vec2 vUv;
          
          void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            
            // Sacred geometry patterns
            float pattern = sin(dist * 20.0 - uTime) * 0.5 + 0.5;
            pattern *= sin(vUv.x * 10.0) * sin(vUv.y * 10.0);
            
            vec3 color = vec3(0.4, 0.7, 1.0) * pattern;
            gl_FragColor = vec4(color, uOpacity * pattern);
          }
        `}
      />
    </mesh>
  );
}

// Dynamic lighting system
function DynamicLighting({ breathPhase, trustSpeed }: { breathPhase: string; trustSpeed: string }) {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  
  useFrame((state) => {
    if (lightRef.current && ambientRef.current) {
      const time = state.clock.elapsedTime;
      const speedMultiplier = trustSpeed === 'gentle' ? 0.7 : trustSpeed === 'bold' ? 1.3 : 1.0;
      
      // Breathing-based lighting intensity
      const breathIntensity = breathPhase === 'inhale' ? 
        Math.sin(time * speedMultiplier) * 0.3 + 0.7 :
        Math.cos(time * speedMultiplier) * 0.2 + 0.5;
      
      lightRef.current.intensity = breathIntensity;
      ambientRef.current.intensity = breathIntensity * 0.3;
      
      // Color temperature shift
      const hue = breathPhase === 'inhale' ? 0.1 : 0.6; // warm to cool
      lightRef.current.color.setHSL(hue, 0.3, 1.0);
    }
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[0, 5, 2]}
        intensity={0.7}
        color="#ffffff"
        castShadow
      />
      <ambientLight ref={ambientRef} intensity={0.2} color="#4a90e2" />
      <hemisphereLight
        args={["#87ceeb", "#1a1a2e", 0.3]}
      />
    </>
  );
}

// Main scene component
function BreathScene() {
  const {
    currentLesson,
    lessonTitle,
    isBreathing,
    currentPhase,
    context,
    startLesson,
    completeLesson,
    nextLesson,
    prevLesson,
    setTrustSpeed,
    submitReflection,
    showSovereigntyAnchor
  } = useBreathOfSourceModule();

  return (
    <>
      <DynamicLighting breathPhase={currentPhase} trustSpeed={context.trustSpeed} />
      <SacredBackground />
      
      {/* Central Breath Orb */}
      <BreathOrb 
        isBreathing={isBreathing}
        currentPhase={currentPhase}
        trustSpeed={context.trustSpeed}
        cycleCount={context.cycleCount}
      />
      
      {/* Wheel/Exit Metaphor Visualization */}
      <WheelVisualization 
        isActive={currentLesson >= 3}
        cycleCount={context.cycleCount}
        showExit={context.cycleCount >= 10}
      />
      
      {/* Biofeedback Display (L6+) */}
      {currentLesson >= 6 && (
        <BiofeedbackDisplay 
          currentPhase={currentPhase}
          coherenceLevel={0.7}
          heartRate={72}
        />
      )}
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxDistance={10}
        minDistance={3}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate={false}
      />
      <PerspectiveCamera makeDefault position={[0, 2, 5]} />
    </>
  );
}

export default function BreathOfSource3D() {
  const {
    currentLesson,
    lessonTitle,
    lessonDescription,
    isLessonComplete,
    context,
    startLesson,
    completeLesson,
    nextLesson,
    prevLesson,
    setTrustSpeed,
    submitReflection,
    showSovereigntyAnchor
  } = useBreathOfSourceModule();

  return (
    <div className="relative h-screen w-full bg-silence overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ErrorBoundary name="BreathOfSource3D-Scene">
            <BreathScene />
          </ErrorBoundary>
        </Suspense>
        <Environment preset="night" />
      </Canvas>

      {/* Audio System */}
      <BreathAudio 
        isActive={currentLesson >= 1}
        currentPhase={context.breathPreset === 'liberation' ? 'inhale' : 'exhale'}
        trustSpeed={context.trustSpeed}
        preset={context.breathPreset}
      />

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Trust Speed Controls */}
        {currentLesson === 0 && (
          <div className="pointer-events-auto">
            <TrustSpeedControls 
              currentSpeed={context.trustSpeed}
              onSpeedChange={setTrustSpeed}
            />
          </div>
        )}

        {/* HUD Interface */}
        <div className="pointer-events-auto">
          <HUDInterface 
            currentLesson={currentLesson}
            lessonTitle={lessonTitle}
            lessonDescription={lessonDescription}
            isLessonComplete={isLessonComplete}
            cycleCount={context.cycleCount}
            onStartLesson={startLesson}
            onCompleteLesson={completeLesson}
            onNextLesson={nextLesson}
            onPrevLesson={prevLesson}
          />
        </div>

        {/* Lesson Content */}
        <div className="pointer-events-auto">
          <LessonContent 
            currentLesson={currentLesson}
            trustSpeed={context.trustSpeed}
          />
        </div>

        {/* Sovereignty Anchors */}
        {context.sovereigntyAnchors && (
          <SovereigntyAnchor 
            trustSpeed={context.trustSpeed}
            onAcknowledge={showSovereigntyAnchor}
          />
        )}

        {/* Reflection Panel (L2+) */}
        {currentLesson >= 2 && (
          <div className="pointer-events-auto">
            <ReflectionPanel 
              reflections={context.reflections}
              onSubmitReflection={submitReflection}
            />
          </div>
        )}
      </div>

      {/* Loading Fallback */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-sacred">
              Initializing Sacred Breath Practice...
            </p>
          </div>
        </div>
      }>
        {/* Main scene renders here */}
      </Suspense>
    </div>
  );
}