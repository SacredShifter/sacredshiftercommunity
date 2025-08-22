// Sacred Sigil System Types
export interface SacredSigil {
  id: string;
  name: string;
  symbol: string; // Unicode or SVG path
  intent: string;
  category: SigilCategory;
  resonanceFrequency: number; // Hz for consciousness alignment
  metadata: SigilMetadata;
}

export interface SigilMetadata {
  energeticProperty: 'anchoring' | 'flowing' | 'catalyzing' | 'harmonizing';
  consciousnessState: 'clarity' | 'release' | 'manifestation' | 'unity' | 'healing';
  sacredGeometry?: string; // Associated geometry pattern
  auraColor?: string; // HSL color that resonates with this sigil
  biometricTrigger?: 'coherence' | 'breathing' | 'heartrate' | 'stress';
}

export type SigilCategory = 
  | 'core_field_anchors'
  | 'emotional_energetic_flow' 
  | 'consciousness_catalysts'
  | 'collective_resonance_keys';

export interface MessageWithSigils {
  content: string;
  sigils: string[]; // Array of sigil IDs embedded in message
  sigilMetadata: SigilMetadata[];
  consciousnessSignature: {
    coherence: number;
    resonanceFrequency: number;
    intentionalClarity: number;
  };
}

export interface EmojiAlchemyMapping {
  emoji: string;
  targetSigil: string;
  transformationRule: string;
}