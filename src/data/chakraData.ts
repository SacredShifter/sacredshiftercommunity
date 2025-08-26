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
  meditation: string;
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
    oils: ['Frankincense', 'Lavender', 'Rosewood'],
    meditation: 'Visualize a brilliant, violet or white light pouring into the crown of your head, filling your entire being with divine wisdom and connecting you to the infinite.'
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
    oils: ['Clary Sage', 'Juniper', 'Peppermint'],
    meditation: 'Focus on the point between your eyebrows. Imagine a deep indigo sphere of light gently pulsing there, opening your inner eye to clarity and intuition.'
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
    oils: ['Eucalyptus', 'Tea Tree', 'Chamomile'],
    meditation: 'Bring your awareness to the hollow of your throat. See a vibrant, sky-blue light spinning there, dissolving all blockages to clear communication and self-expression.'
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
    oils: ['Rose', 'Bergamot', 'Ylang Ylang'],
    meditation: 'Breathe into your heart center. With each inhale, feel a warm, emerald green light expand from your heart, filling you with compassion, love, and healing energy.'
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
    oils: ['Lemon', 'Ginger', 'Peppermint'],
    meditation: 'Focus on the area just above your navel. Imagine a brilliant, golden sun radiating warmth and energy, burning away self-doubt and filling you with confidence.'
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
    oils: ['Sweet Orange', 'Sandalwood', 'Jasmine'],
    meditation: 'Bring your focus to your lower abdomen. Visualize a gentle, swirling orange light, warming the waters of your emotions and unlocking your creative flow.'
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
    oils: ['Patchouli', 'Cedarwood', 'Vetiver'],
    meditation: 'Focus on the base of your spine. Feel roots growing down from you deep into the earth, anchoring you. Draw up a ruby red energy, filling you with stability and security.'
  }
];
