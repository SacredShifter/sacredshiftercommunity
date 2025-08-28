import React, { useState, useEffect } from 'react';
import BreathingVisualization from './BreathingVisualization';
import SimpleMeditationVisual from './SimpleMeditationVisual';
// Temporarily using simplified visuals to avoid Three.js errors
// import LovingKindnessVisualization from './LovingKindnessVisualization';
// import ChakraVisualization from './ChakraVisualization';
// import MindfulnessVisualization from './MindfulnessVisualization';
// import BodyScanVisualization from './BodyScanVisualization';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface MeditationVisualizationManagerProps {
  type: MeditationType;
  isActive: boolean;
  sessionProgress: number; // 0-100
  duration: number; // in minutes
}

export default function MeditationVisualizationManager({ 
  type, 
  isActive, 
  sessionProgress, 
  duration 
}: MeditationVisualizationManagerProps) {
  // Breathing meditation state
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [breathProgress, setBreathProgress] = useState(0);
  
  // Loving-kindness meditation state
  const [kindnessStage, setKindnessStage] = useState<'self' | 'loved-ones' | 'neutral' | 'difficult' | 'all-beings'>('self');
  
  // Chakra meditation state
  const [currentChakra, setCurrentChakra] = useState(0);
  
  // Mindfulness meditation state
  const [thoughtCount, setThoughtCount] = useState(5);
  const [awareness, setAwareness] = useState(0.5);
  
  // Body scan meditation state
  const [currentBodyPart, setCurrentBodyPart] = useState('Toes');
  const [scanProgress, setScanProgress] = useState(0);
  const [relaxationLevel, setRelaxationLevel] = useState(0.3);

  // Breathing pattern simulation
  useEffect(() => {
    if (!isActive || type !== 'breathing') return;
    
    const breathCycle = () => {
      const cycleTime = 16000; // 16 seconds total cycle
      const phases = [
        { phase: 'inhale', duration: 4000 },
        { phase: 'hold1', duration: 4000 },
        { phase: 'exhale', duration: 4000 },
        { phase: 'hold2', duration: 4000 }
      ];
      
      let currentTime = 0;
      
      const updatePhase = () => {
        const elapsed = currentTime % cycleTime;
        let accumulatedTime = 0;
        
        for (const { phase, duration } of phases) {
          if (elapsed >= accumulatedTime && elapsed < accumulatedTime + duration) {
            setBreathPhase(phase as any);
            setBreathProgress((elapsed - accumulatedTime) / duration);
            break;
          }
          accumulatedTime += duration;
        }
        
        currentTime += 100;
      };
      
      return setInterval(updatePhase, 100);
    };
    
    const interval = breathCycle();
    return () => clearInterval(interval);
  }, [isActive, type]);

  // Loving-kindness stage progression
  useEffect(() => {
    if (!isActive || type !== 'loving-kindness') return;
    
    const stageInterval = (duration * 60000) / 5; // Divide session into 5 stages
    const stages: Array<'self' | 'loved-ones' | 'neutral' | 'difficult' | 'all-beings'> = 
      ['self', 'loved-ones', 'neutral', 'difficult', 'all-beings'];
    
    const interval = setInterval(() => {
      const currentStageIndex = Math.floor((sessionProgress / 100) * stages.length);
      setKindnessStage(stages[Math.min(currentStageIndex, stages.length - 1)]);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive, type, sessionProgress, duration]);

  // Chakra progression
  useEffect(() => {
    if (!isActive || type !== 'chakra') return;
    
    const chakraInterval = setInterval(() => {
      const chakraIndex = Math.floor((sessionProgress / 100) * 7);
      setCurrentChakra(Math.min(chakraIndex, 6));
    }, 1000);
    
    return () => clearInterval(chakraInterval);
  }, [isActive, type, sessionProgress]);

  // Mindfulness simulation
  useEffect(() => {
    if (!isActive || type !== 'mindfulness') return;
    
    const mindfulnessInterval = setInterval(() => {
      // Simulate varying thought patterns and awareness
      setThoughtCount(Math.floor(Math.random() * 15) + 1);
      setAwareness(0.3 + (sessionProgress / 100) * 0.6); // Awareness increases over time
    }, 2000);
    
    return () => clearInterval(mindfulnessInterval);
  }, [isActive, type, sessionProgress]);

  // Body scan progression
  useEffect(() => {
    if (!isActive || type !== 'body-scan') return;
    
    const bodyParts = ['Toes', 'Feet', 'Ankles', 'Calves', 'Knees', 'Thighs', 'Hips', 
                      'Abdomen', 'Chest', 'Shoulders', 'Arms', 'Neck', 'Face', 'Head'];
    
    const bodyScanInterval = setInterval(() => {
      const partIndex = Math.floor((sessionProgress / 100) * bodyParts.length);
      setCurrentBodyPart(bodyParts[Math.min(partIndex, bodyParts.length - 1)]);
      setScanProgress(sessionProgress / 100);
      setRelaxationLevel(0.2 + (sessionProgress / 100) * 0.7); // Relaxation increases over time
    }, 1000);
    
    return () => clearInterval(bodyScanInterval);
  }, [isActive, type, sessionProgress]);

  const renderVisualization = () => {
    // Try the breathing visualization first, fallback to simple visual for others
    try {
      switch (type) {
        case 'breathing':
          return (
            <BreathingVisualization
              isActive={isActive}
              phase={breathPhase}
              progress={breathProgress}
              intensity={0.6}
            />
          );
        
        default:
          // Use simplified visuals for other meditation types
          return (
            <SimpleMeditationVisual
              type={type}
              isActive={isActive}
              phase={undefined}
              progress={sessionProgress}
            />
          );
      }
    } catch (error) {
      console.error('Visualization error:', error);
      // Fallback to simple visual
      return (
        <SimpleMeditationVisual
          type={type}
          isActive={isActive}
          progress={sessionProgress}
        />
      );
    }
  };

  return (
    <div className="w-full">
      {renderVisualization()}
    </div>
  );
}