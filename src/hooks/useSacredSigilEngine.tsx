import { useState, useCallback, useEffect } from 'react';
import { SACRED_SIGIL_CODEX, getSigilById, transformEmojiToSigil } from '@/data/sacredSigilCodex';
import { SacredSigil, MessageWithSigils, SigilMetadata } from '@/types/sacredSigils';
import { useAuth } from '@/hooks/useAuth';

interface ConsciousnessState {
  coherence: number;
  resonanceFrequency: number;
  intentionalClarity: number;
  breathingRate: number;
  heartRate: number;
  stressLevel: number;
}

export const useSacredSigilEngine = () => {
  const { user } = useAuth();
  const [consciousness, setConsciousness] = useState<ConsciousnessState>({
    coherence: 0.7,
    resonanceFrequency: 7.83, // Schumann resonance base
    intentionalClarity: 0.8,
    breathingRate: 12,
    heartRate: 70,
    stressLevel: 0.3
  });
  const [activeSigils, setActiveSigils] = useState<string[]>([]);
  const [sigilResonance, setSigilResonance] = useState<Map<string, number>>(new Map());

  // Simulate biometric consciousness tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setConsciousness(prev => ({
        ...prev,
        coherence: Math.max(0, Math.min(1, prev.coherence + (Math.random() - 0.5) * 0.1)),
        resonanceFrequency: 7.83 + (Math.random() - 0.5) * 2,
        intentionalClarity: Math.max(0, Math.min(1, prev.intentionalClarity + (Math.random() - 0.5) * 0.05)),
        breathingRate: Math.max(8, Math.min(20, prev.breathingRate + (Math.random() - 0.5) * 2)),
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 5)),
        stressLevel: Math.max(0, Math.min(1, prev.stressLevel + (Math.random() - 0.5) * 0.1))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Get recommended sigils based on consciousness state
  const getRecommendedSigils = useCallback((): SacredSigil[] => {
    const recommendations: SacredSigil[] = [];

    // High stress → Healing sigil
    if (consciousness.stressLevel > 0.7) {
      const healingSigil = getSigilById('healing');
      if (healingSigil) recommendations.push(healingSigil);
    }

    // Low coherence → Unity sigil
    if (consciousness.coherence < 0.5) {
      const unitySigil = getSigilById('unity');
      if (unitySigil) recommendations.push(unitySigil);
    }

    // High clarity → Truth sigil
    if (consciousness.intentionalClarity > 0.8) {
      const truthSigil = getSigilById('truth');
      if (truthSigil) recommendations.push(truthSigil);
    }

    // Fast breathing → Release sigil
    if (consciousness.breathingRate > 16) {
      const releaseSigil = getSigilById('release');
      if (releaseSigil) recommendations.push(releaseSigil);
    }

    // High coherence + clarity → Manifestation
    if (consciousness.coherence > 0.8 && consciousness.intentionalClarity > 0.8) {
      const manifestSigil = getSigilById('manifest');
      if (manifestSigil) recommendations.push(manifestSigil);
    }

    return recommendations.slice(0, 3); // Limit to top 3 recommendations
  }, [consciousness]);

  // Transform emoji text to include sigils
  const alchemizeMessage = useCallback((content: string): { content: string; sigils: string[] } => {
    let alchemizedContent = content;
    const extractedSigils: string[] = [];

    // Common emoji pattern
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
    
    alchemizedContent = alchemizedContent.replace(emojiRegex, (emoji) => {
      const sacredSigil = transformEmojiToSigil(emoji);
      if (sacredSigil) {
        extractedSigils.push(sacredSigil.id);
        return sacredSigil.symbol;
      }
      return emoji;
    });

    return { content: alchemizedContent, sigils: extractedSigils };
  }, []);

  // Embed sigil in message
  const embedSigil = useCallback((sigilId: string): string => {
    const sigil = getSigilById(sigilId);
    if (!sigil) return '';
    
    // Add to active sigils
    setActiveSigils(prev => [...new Set([...prev, sigilId])]);
    
    // Update resonance tracking
    setSigilResonance(prev => {
      const newMap = new Map(prev);
      const currentResonance = newMap.get(sigilId) || 0;
      newMap.set(sigilId, currentResonance + consciousness.coherence);
      return newMap;
    });

    return sigil.symbol;
  }, [consciousness.coherence]);

  // Create message with sigil metadata
  const createSacredMessage = useCallback((content: string, selectedSigils: string[] = []): MessageWithSigils => {
    const { content: alchemizedContent, sigils: autoSigils } = alchemizeMessage(content);
    const allSigils = [...new Set([...autoSigils, ...selectedSigils])];
    
    const sigilMetadata: SigilMetadata[] = allSigils.map(sigilId => {
      const sigil = getSigilById(sigilId);
      return sigil?.metadata || {
        energeticProperty: 'harmonizing',
        consciousnessState: 'unity'
      };
    });

    return {
      content: alchemizedContent,
      sigils: allSigils,
      sigilMetadata,
      consciousnessSignature: {
        coherence: consciousness.coherence,
        resonanceFrequency: consciousness.resonanceFrequency,
        intentionalClarity: consciousness.intentionalClarity
      }
    };
  }, [alchemizeMessage, consciousness]);

  // Calculate collective sigil resonance
  const calculateSigilResonance = useCallback((sigilId: string): number => {
    return sigilResonance.get(sigilId) || 0;
  }, [sigilResonance]);

  // Detect synchronicity through sigil patterns
  const detectSynchronicity = useCallback((messages: MessageWithSigils[]): string[] => {
    const sigilFrequency = new Map<string, number>();
    
    messages.forEach(message => {
      message.sigils.forEach(sigilId => {
        sigilFrequency.set(sigilId, (sigilFrequency.get(sigilId) || 0) + 1);
      });
    });

    // Return sigils that appear in multiple messages (synchronicity)
    return Array.from(sigilFrequency.entries())
      .filter(([_, count]) => count > 1)
      .map(([sigilId]) => sigilId);
  }, []);

  return {
    consciousness,
    activeSigils,
    sigilCodex: SACRED_SIGIL_CODEX,
    getRecommendedSigils,
    alchemizeMessage,
    embedSigil,
    createSacredMessage,
    calculateSigilResonance,
    detectSynchronicity,
    getSigilById
  };
};