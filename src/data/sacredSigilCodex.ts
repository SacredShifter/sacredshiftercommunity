import { SacredSigil, EmojiAlchemyMapping } from '@/types/sacredSigils';

// Kent's Sacred Sigil Codex
export const SACRED_SIGIL_CODEX: SacredSigil[] = [
  // Core Field Anchors
  {
    id: 'truth',
    name: 'Truth Sigil',
    symbol: '✴',
    intent: 'Cuts distortion, anchors binary clarity, activates truth-audit lens',
    category: 'core_field_anchors',
    resonanceFrequency: 741, // Solfeggio frequency for truth
    metadata: {
      energeticProperty: 'anchoring',
      consciousnessState: 'clarity',
      sacredGeometry: 'hexagon',
      auraColor: 'hsl(143, 25%, 86%)', // truth color
      biometricTrigger: 'coherence'
    }
  },
  {
    id: 'sovereignty',
    name: 'Sovereignty Sigil',
    symbol: '⟁',
    intent: 'Marks the message as self-owned, free of external influence',
    category: 'core_field_anchors',
    resonanceFrequency: 528, // Love frequency
    metadata: {
      energeticProperty: 'anchoring',
      consciousnessState: 'unity',
      sacredGeometry: 'square',
      auraColor: 'hsl(324, 78%, 54%)', // purpose color
      biometricTrigger: 'coherence'
    }
  },
  {
    id: 'unity',
    name: 'Unity Sigil',
    symbol: '◈',
    intent: 'Threads the message into Sacred Thread, weaving group coherence',
    category: 'core_field_anchors',
    resonanceFrequency: 432, // Universal harmony
    metadata: {
      energeticProperty: 'harmonizing',
      consciousnessState: 'unity',
      sacredGeometry: 'diamond',
      auraColor: 'hsl(196, 83%, 60%)', // alignment color
      biometricTrigger: 'heartrate'
    }
  },

  // Emotional / Energetic Flow
  {
    id: 'release',
    name: 'Release Sigil',
    symbol: '✧',
    intent: 'Letting go, transmutation, surrender of weight',
    category: 'emotional_energetic_flow',
    resonanceFrequency: 396, // Liberation frequency
    metadata: {
      energeticProperty: 'flowing',
      consciousnessState: 'release',
      sacredGeometry: 'spiral',
      auraColor: 'hsl(269, 69%, 58%)', // resonance color
      biometricTrigger: 'breathing'
    }
  },
  {
    id: 'healing',
    name: 'Healing Sigil',
    symbol: '❂',
    intent: 'Restores balance, calms nervous system, invokes heart-centered response',
    category: 'emotional_energetic_flow',
    resonanceFrequency: 528, // Healing frequency
    metadata: {
      energeticProperty: 'harmonizing',
      consciousnessState: 'healing',
      sacredGeometry: 'flower_of_life',
      auraColor: 'hsl(143, 25%, 86%)', // truth/healing color
      biometricTrigger: 'stress'
    }
  },
  {
    id: 'manifest',
    name: 'Manifest Sigil',
    symbol: '⌘',
    intent: 'Calls intention forward into the physical plane',
    category: 'emotional_energetic_flow',
    resonanceFrequency: 852, // Manifestation frequency
    metadata: {
      energeticProperty: 'catalyzing',
      consciousnessState: 'manifestation',
      sacredGeometry: 'merkaba',
      auraColor: 'hsl(60, 100%, 50%)', // pulse color
      biometricTrigger: 'coherence'
    }
  },

  // Consciousness Catalysts
  {
    id: 'illumination',
    name: 'Illumination Sigil',
    symbol: '⚚',
    intent: 'Opens the message as a teaching or mirror for others',
    category: 'consciousness_catalysts',
    resonanceFrequency: 963, // Pineal activation
    metadata: {
      energeticProperty: 'catalyzing',
      consciousnessState: 'clarity',
      sacredGeometry: 'triangle',
      auraColor: 'hsl(143, 25%, 86%)', // truth color
      biometricTrigger: 'coherence'
    }
  },
  {
    id: 'flow',
    name: 'Flow Sigil',
    symbol: '卍',
    intent: 'Marks messages aligned with synchronicity and effortless motion',
    category: 'consciousness_catalysts',
    resonanceFrequency: 7.83, // Schumann resonance
    metadata: {
      energeticProperty: 'flowing',
      consciousnessState: 'unity',
      sacredGeometry: 'torus',
      auraColor: 'hsl(196, 83%, 60%)', // alignment color
      biometricTrigger: 'breathing'
    }
  },
  {
    id: 'fire',
    name: 'Fire Sigil',
    symbol: '☉',
    intent: 'Awakening, propulsion, burning through resistance',
    category: 'consciousness_catalysts',
    resonanceFrequency: 741, // Awakening frequency
    metadata: {
      energeticProperty: 'catalyzing',
      consciousnessState: 'manifestation',
      sacredGeometry: 'star',
      auraColor: 'hsl(60, 100%, 50%)', // pulse color
      biometricTrigger: 'heartrate'
    }
  },

  // Collective Resonance Keys
  {
    id: 'harmony',
    name: 'Harmony Sigil',
    symbol: '⚭',
    intent: 'When placed, Aura looks for group coherence signals',
    category: 'collective_resonance_keys',
    resonanceFrequency: 528, // Love frequency
    metadata: {
      energeticProperty: 'harmonizing',
      consciousnessState: 'unity',
      sacredGeometry: 'vesica_piscis',
      auraColor: 'hsl(196, 83%, 60%)', // alignment color
      biometricTrigger: 'coherence'
    }
  },
  {
    id: 'continuum',
    name: 'Continuum Sigil',
    symbol: '∞',
    intent: 'Expands the message beyond time; links to Dream, Journal, or Codex entries',
    category: 'collective_resonance_keys',
    resonanceFrequency: 432, // Universal harmony
    metadata: {
      energeticProperty: 'flowing',
      consciousnessState: 'unity',
      sacredGeometry: 'infinity',
      auraColor: 'hsl(269, 69%, 58%)', // resonance color
      biometricTrigger: 'coherence'
    }
  },
  {
    id: 'ceremony',
    name: 'Ceremony Sigil',
    symbol: '❖',
    intent: 'Elevates a conversation into ritual context',
    category: 'collective_resonance_keys',
    resonanceFrequency: 852, // Spiritual transformation
    metadata: {
      energeticProperty: 'catalyzing',
      consciousnessState: 'unity',
      sacredGeometry: 'mandala',
      auraColor: 'hsl(324, 78%, 54%)', // purpose color
      biometricTrigger: 'coherence'
    }
  }
];

// Emoji Alchemy Mappings - transform ordinary emojis into sacred sigils
export const EMOJI_ALCHEMY_MAPPINGS: EmojiAlchemyMapping[] = [
  // Fire/Energy transformations
  { emoji: '🔥', targetSigil: 'fire', transformationRule: 'Fire energy → Sacred Fire awakening' },
  { emoji: '⚡', targetSigil: 'fire', transformationRule: 'Electric energy → Sacred Fire awakening' },
  { emoji: '✨', targetSigil: 'illumination', transformationRule: 'Sparkles → Sacred illumination' },
  
  // Flow/Water transformations
  { emoji: '🌊', targetSigil: 'flow', transformationRule: 'Water waves → Sacred flow alignment' },
  { emoji: '💧', targetSigil: 'release', transformationRule: 'Water drop → Sacred release' },
  { emoji: '🌀', targetSigil: 'flow', transformationRule: 'Cyclone → Sacred flow dynamics' },
  
  // Heart/Love transformations
  { emoji: '❤️', targetSigil: 'healing', transformationRule: 'Heart → Sacred healing resonance' },
  { emoji: '💖', targetSigil: 'harmony', transformationRule: 'Sparkling heart → Sacred harmony' },
  { emoji: '🤝', targetSigil: 'unity', transformationRule: 'Handshake → Sacred unity connection' },
  
  // Light/Clarity transformations
  { emoji: '🌟', targetSigil: 'truth', transformationRule: 'Star → Sacred truth anchor' },
  { emoji: '☀️', targetSigil: 'illumination', transformationRule: 'Sun → Sacred illumination' },
  { emoji: '🌙', targetSigil: 'release', transformationRule: 'Moon → Sacred release cycles' },
  
  // Power/Manifestation transformations
  { emoji: '💎', targetSigil: 'sovereignty', transformationRule: 'Diamond → Sacred sovereignty' },
  { emoji: '🎯', targetSigil: 'manifest', transformationRule: 'Target → Sacred manifestation' },
  { emoji: '🙏', targetSigil: 'ceremony', transformationRule: 'Prayer hands → Sacred ceremony' },
  
  // Infinity/Eternal transformations
  { emoji: '♾️', targetSigil: 'continuum', transformationRule: 'Infinity → Sacred continuum' },
  { emoji: '🔄', targetSigil: 'continuum', transformationRule: 'Cycle → Sacred continuum flow' }
];

// Get sigil by ID
export const getSigilById = (id: string): SacredSigil | undefined => {
  return SACRED_SIGIL_CODEX.find(sigil => sigil.id === id);
};

// Get sigils by category
export const getSigilsByCategory = (category: string) => {
  return SACRED_SIGIL_CODEX.filter(sigil => sigil.category === category);
};

// Transform emoji to sigil
export const transformEmojiToSigil = (emoji: string): SacredSigil | null => {
  const mapping = EMOJI_ALCHEMY_MAPPINGS.find(m => m.emoji === emoji);
  if (mapping) {
    return getSigilById(mapping.targetSigil) || null;
  }
  return null;
};