export interface ChakraData {
  id: string;
  name: string;
  sanskrit: string;
  position: [number, number, number];
  color: string;
  frequency: string;
  element: string;
  description: string;
  qualities: string[];
  affirmation: string;
  crystals: string[];
  oils: string[];
}

export const chakraData: ChakraData[] = [
  {
    id: 'crown',
    name: 'Crown Chakra',
    sanskrit: 'Sahasrara',
    position: [0, 3.5, 0],
    color: '#9966CC',
    frequency: '963 Hz',
    element: 'Thought/Light',
    description: 'The seventh chakra, located at the crown of the head, connects us to divine consciousness and spiritual enlightenment.',
    qualities: ['Spiritual Connection', 'Divine Wisdom', 'Enlightenment', 'Universal Consciousness'],
    affirmation: 'I am one with divine consciousness',
    crystals: ['Amethyst', 'Clear Quartz', 'Selenite'],
    oils: ['Frankincense', 'Lavender', 'Rosewood']
  },
  {
    id: 'third-eye',
    name: 'Third Eye Chakra',
    sanskrit: 'Ajna',
    position: [0, 2.8, 0.2],
    color: '#4B0082',
    frequency: '852 Hz',
    element: 'Light',
    description: 'The sixth chakra, located between the eyebrows, governs intuition, psychic abilities, and inner wisdom.',
    qualities: ['Intuition', 'Psychic Abilities', 'Wisdom', 'Clarity'],
    affirmation: 'I see clearly and trust my inner wisdom',
    crystals: ['Lapis Lazuli', 'Amethyst', 'Sodalite'],
    oils: ['Clary Sage', 'Juniper', 'Peppermint']
  },
  {
    id: 'throat',
    name: 'Throat Chakra',
    sanskrit: 'Vishuddha',
    position: [0, 2.2, 0],
    color: '#00BFFF',
    frequency: '741 Hz',
    element: 'Sound/Ether',
    description: 'The fifth chakra, located at the throat, governs communication, self-expression, and truth.',
    qualities: ['Communication', 'Expression', 'Truth', 'Creativity'],
    affirmation: 'I speak my truth with confidence and clarity',
    crystals: ['Blue Lace Agate', 'Turquoise', 'Aquamarine'],
    oils: ['Eucalyptus', 'Tea Tree', 'Chamomile']
  },
  {
    id: 'heart',
    name: 'Heart Chakra',
    sanskrit: 'Anahata',
    position: [0, 1.5, 0],
    color: '#32CD32',
    frequency: '639 Hz',
    element: 'Air',
    description: 'The fourth chakra, located at the center of the chest, governs love, compassion, and emotional balance.',
    qualities: ['Love', 'Compassion', 'Forgiveness', 'Connection'],
    affirmation: 'I give and receive love freely and unconditionally',
    crystals: ['Rose Quartz', 'Green Aventurine', 'Emerald'],
    oils: ['Rose', 'Bergamot', 'Ylang Ylang']
  },
  {
    id: 'solar-plexus',
    name: 'Solar Plexus Chakra',
    sanskrit: 'Manipura',
    position: [0, 0.8, 0],
    color: '#FFD700',
    frequency: '528 Hz',
    element: 'Fire',
    description: 'The third chakra, located above the navel, governs personal power, confidence, and self-esteem.',
    qualities: ['Personal Power', 'Confidence', 'Will', 'Transformation'],
    affirmation: 'I am confident and empowered to create my reality',
    crystals: ['Citrine', 'Tiger\'s Eye', 'Amber'],
    oils: ['Lemon', 'Ginger', 'Peppermint']
  },
  {
    id: 'sacral',
    name: 'Sacral Chakra',
    sanskrit: 'Svadhisthana',
    position: [0, 0.2, 0],
    color: '#FF6347',
    frequency: '417 Hz',
    element: 'Water',
    description: 'The second chakra, located below the navel, governs creativity, sexuality, and emotional well-being.',
    qualities: ['Creativity', 'Sexuality', 'Emotions', 'Pleasure'],
    affirmation: 'I embrace my creative and sensual nature',
    crystals: ['Carnelian', 'Orange Calcite', 'Moonstone'],
    oils: ['Sweet Orange', 'Sandalwood', 'Jasmine']
  },
  {
    id: 'root',
    name: 'Root Chakra',
    sanskrit: 'Muladhara',
    position: [0, -0.5, 0],
    color: '#DC143C',
    frequency: '396 Hz',
    element: 'Earth',
    description: 'The first chakra, located at the base of the spine, governs survival, grounding, and stability.',
    qualities: ['Grounding', 'Stability', 'Security', 'Survival'],
    affirmation: 'I am safe, secure, and grounded in my being',
    crystals: ['Red Jasper', 'Hematite', 'Garnet'],
    oils: ['Patchouli', 'Cedarwood', 'Vetiver']
  }
];
