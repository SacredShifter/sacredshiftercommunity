import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface BiometricData {
  mouseMovement: { x: number; y: number; timestamp: number }[];
  keyboardTiming: { key: string; downTime: number; upTime: number }[];
  scrollPattern: { deltaY: number; timestamp: number }[];
  clickPattern: { x: number; y: number; timestamp: number; duration: number }[];
}

interface PersonalSignature {
  id: string;
  temperament: 'contemplative' | 'dynamic' | 'rhythmic' | 'intuitive';
  interactionStyle: 'deliberate' | 'flowing' | 'precise' | 'exploratory';
  cognitivePattern: 'linear' | 'spiral' | 'fractal' | 'quantum';
  energeticFrequency: number; // 0-1
  coherenceIndex: number; // 0-1
  biometricFingerprint: string;
  preferences: {
    visualComplexity: number;
    interactionSpeed: number;
    informationDensity: number;
    contemplationDepth: number;
  };
  adaptations: {
    uiElements: Record<string, any>;
    contentFiltering: string[];
    responsePatterns: string[];
  };
}

export function usePersonalSignature() {
  const { user } = useAuth();
  const [signature, setSignature] = useState<PersonalSignature | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [biometricData, setBiometricData] = useState<BiometricData>({
    mouseMovement: [],
    keyboardTiming: [],
    scrollPattern: [],
    clickPattern: []
  });

  // Collect biometric data
  useEffect(() => {
    if (!user) return;

    const handleMouseMove = (e: MouseEvent) => {
      setBiometricData(prev => ({
        ...prev,
        mouseMovement: [
          ...prev.mouseMovement.slice(-50), // Keep last 50 movements
          { x: e.clientX, y: e.clientY, timestamp: Date.now() }
        ]
      }));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const downTime = Date.now();
      
      const handleKeyUp = (upEvent: KeyboardEvent) => {
        if (upEvent.key === e.key) {
          setBiometricData(prev => ({
            ...prev,
            keyboardTiming: [
              ...prev.keyboardTiming.slice(-20),
              { key: e.key, downTime, upTime: Date.now() }
            ]
          }));
          document.removeEventListener('keyup', handleKeyUp);
        }
      };
      
      document.addEventListener('keyup', handleKeyUp);
    };

    const handleScroll = (e: WheelEvent) => {
      setBiometricData(prev => ({
        ...prev,
        scrollPattern: [
          ...prev.scrollPattern.slice(-30),
          { deltaY: e.deltaY, timestamp: Date.now() }
        ]
      }));
    };

    const handleClick = (e: MouseEvent) => {
      const startTime = Date.now();
      
      const handleMouseUp = () => {
        setBiometricData(prev => ({
          ...prev,
          clickPattern: [
            ...prev.clickPattern.slice(-20),
            { 
              x: e.clientX, 
              y: e.clientY, 
              timestamp: startTime, 
              duration: Date.now() - startTime 
            }
          ]
        }));
        document.removeEventListener('mouseup', handleMouseUp);
      };
      
      document.addEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('wheel', handleScroll);
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('wheel', handleScroll);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [user]);

  // Analyze biometric data and generate signature
  const analyzeSignature = useCallback(async () => {
    if (!user || !biometricData.mouseMovement.length) return;

    setIsAnalyzing(true);
    
    try {
      // Analyze mouse movement patterns
      const movements = biometricData.mouseMovement;
      const speeds = movements.slice(1).map((move, i) => {
        const prev = movements[i];
        const distance = Math.sqrt(
          Math.pow(move.x - prev.x, 2) + Math.pow(move.y - prev.y, 2)
        );
        const time = move.timestamp - prev.timestamp;
        return distance / time;
      });

      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      const speedVariance = speeds.reduce((acc, speed) => acc + Math.pow(speed - avgSpeed, 2), 0) / speeds.length;

      // Analyze keyboard timing
      const keyTimes = biometricData.keyboardTiming.map(k => k.upTime - k.downTime);
      const avgKeyTime = keyTimes.reduce((a, b) => a + b, 0) / keyTimes.length || 0;

      // Analyze scroll patterns
      const scrollSpeeds = biometricData.scrollPattern.map(s => Math.abs(s.deltaY));
      const avgScrollSpeed = scrollSpeeds.reduce((a, b) => a + b, 0) / scrollSpeeds.length || 0;

      // Analyze click patterns
      const clickDurations = biometricData.clickPattern.map(c => c.duration);
      const avgClickDuration = clickDurations.reduce((a, b) => a + b, 0) / clickDurations.length || 0;

      // Determine temperament
      let temperament: PersonalSignature['temperament'] = 'contemplative';
      if (avgSpeed > 0.5 && speedVariance > 0.1) temperament = 'dynamic';
      else if (avgScrollSpeed > 100) temperament = 'rhythmic';
      else if (speedVariance < 0.05) temperament = 'intuitive';

      // Determine interaction style
      let interactionStyle: PersonalSignature['interactionStyle'] = 'deliberate';
      if (avgKeyTime < 50) interactionStyle = 'flowing';
      else if (speedVariance < 0.02) interactionStyle = 'precise';
      else if (avgSpeed > 0.8) interactionStyle = 'exploratory';

      // Determine cognitive pattern
      let cognitivePattern: PersonalSignature['cognitivePattern'] = 'linear';
      if (speedVariance > 0.2) cognitivePattern = 'spiral';
      else if (movements.length > 30 && avgSpeed > 0.3) cognitivePattern = 'fractal';
      else if (avgClickDuration < 100 && avgKeyTime < 80) cognitivePattern = 'quantum';

      // Calculate energetic frequency (0-1)
      const energeticFrequency = Math.min(1, (avgSpeed * 2 + avgScrollSpeed / 200) / 2);

      // Calculate coherence index
      const coherenceIndex = Math.max(0, 1 - speedVariance);

      // Generate biometric fingerprint
      const fingerprint = btoa(JSON.stringify({
        speeds: speeds.slice(0, 10),
        keyTimes: keyTimes.slice(0, 5),
        scrollPattern: scrollSpeeds.slice(0, 5)
      }));

      const newSignature: PersonalSignature = {
        id: `signature-${user.id}-${Date.now()}`,
        temperament,
        interactionStyle,
        cognitivePattern,
        energeticFrequency,
        coherenceIndex,
        biometricFingerprint: fingerprint,
        preferences: {
          visualComplexity: temperament === 'dynamic' ? 0.8 : 0.4,
          interactionSpeed: interactionStyle === 'flowing' ? 0.9 : 0.5,
          informationDensity: cognitivePattern === 'fractal' ? 0.9 : 0.6,
          contemplationDepth: temperament === 'contemplative' ? 0.9 : 0.4
        },
        adaptations: {
          uiElements: {
            animationSpeed: interactionStyle === 'flowing' ? 'fast' : 'normal',
            density: cognitivePattern === 'linear' ? 'compact' : 'spacious',
            complexity: temperament === 'dynamic' ? 'high' : 'moderate'
          },
          contentFiltering: [
            temperament === 'contemplative' ? 'depth' : 'breadth',
            cognitivePattern === 'spiral' ? 'nonlinear' : 'structured'
          ],
          responsePatterns: [
            interactionStyle === 'precise' ? 'detailed' : 'intuitive',
            temperament === 'rhythmic' ? 'patterned' : 'fluid'
          ]
        }
      };

      setSignature(newSignature);

      // Store in database
      await supabase.from('akashic_records').insert({
        type: 'personal_signature',
        data: newSignature as any,
        metadata: {
          userId: user.id,
          analysisVersion: '1.0',
          dataPoints: {
            mouseMovements: movements.length,
            keyStrokes: keyTimes.length,
            scrollEvents: scrollSpeeds.length,
            clicks: clickDurations.length
          }
        } as any
      });

    } catch (error) {
      console.error('Error analyzing signature:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, biometricData]);

  // Load existing signature
  useEffect(() => {
    if (!user) return;

    const loadSignature = async () => {
      try {
        const { data, error } = await supabase
          .from('akashic_records')
          .select('*')
          .eq('type', 'personal_signature')
          .eq('metadata->>userId', user.id)
          .order('timestamp', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          setSignature(data[0].data as any as PersonalSignature);
        }
      } catch (error) {
        console.error('Error loading signature:', error);
      }
    };

    loadSignature();
  }, [user]);

  // Auto-analyze after sufficient data collection
  useEffect(() => {
    if (biometricData.mouseMovement.length > 20 && 
        biometricData.keyboardTiming.length > 5 && 
        !signature && 
        !isAnalyzing) {
      analyzeSignature();
    }
  }, [biometricData, signature, isAnalyzing, analyzeSignature]);

  const getPersonalizedContent = useCallback((baseContent: any, type: string) => {
    if (!signature) return baseContent;

    const { preferences, adaptations } = signature;

    switch (type) {
      case 'ui_speed':
        return preferences.interactionSpeed > 0.7 ? 'fast' : 'normal';
      
      case 'content_depth':
        return preferences.contemplationDepth > 0.7 ? 'deep' : 'surface';
      
      case 'visual_complexity':
        return preferences.visualComplexity > 0.6 ? 'complex' : 'simple';
      
      case 'information_density':
        return preferences.informationDensity > 0.7 ? 'dense' : 'sparse';
      
      default:
        return baseContent;
    }
  }, [signature]);

  const getResonanceWithContent = useCallback((content: any) => {
    if (!signature) return 0.5;

    let resonance = 0.5;

    // Adjust based on cognitive pattern alignment
    if (content.structure === 'linear' && signature.cognitivePattern === 'linear') {
      resonance += 0.2;
    } else if (content.structure === 'spiral' && signature.cognitivePattern === 'spiral') {
      resonance += 0.2;
    }

    // Adjust based on temperament
    if (content.pace === 'contemplative' && signature.temperament === 'contemplative') {
      resonance += 0.15;
    } else if (content.pace === 'dynamic' && signature.temperament === 'dynamic') {
      resonance += 0.15;
    }

    // Adjust based on interaction style preference
    if (content.interactionType === signature.interactionStyle) {
      resonance += 0.1;
    }

    return Math.min(1, Math.max(0, resonance));
  }, [signature]);

  return {
    signature,
    isAnalyzing,
    biometricDataPoints: {
      mouse: biometricData.mouseMovement.length,
      keyboard: biometricData.keyboardTiming.length,
      scroll: biometricData.scrollPattern.length,
      clicks: biometricData.clickPattern.length
    },
    analyzeSignature,
    getPersonalizedContent,
    getResonanceWithContent
  };
}