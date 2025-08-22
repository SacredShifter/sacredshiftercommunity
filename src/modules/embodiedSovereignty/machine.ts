import { createMachine, assign, setup } from 'xstate';

export interface EmbodiedSovereigntyContext {
  currentPractice: 'stance' | 'breath' | 'voice' | 'boundary';
  spineAlignment: number; // 1-10 scale
  breathDepth: number; // 1-10 scale
  voiceClarity: number; // 1-10 scale
  boundaryStrength: number; // 1-10 scale
  practiceLevel: 'low-stakes' | 'real-conversation';
  sessionId: string;
  startTime: number;
  completedBoundaries: number;
  reflections: {
    whereHeldCenter: string;
    boundaryHonoured: string;
  };
  centeringPractices: string[];
}

export type EmbodiedSovereigntyEvent =
  | { type: 'START' }
  | { type: 'PRACTICE_STANCE' }
  | { type: 'PRACTICE_BREATH' }
  | { type: 'PRACTICE_VOICE' }
  | { type: 'PRACTICE_BOUNDARY' }
  | { type: 'SET_STAKES'; level: 'low-stakes' | 'real-conversation' }
  | { type: 'COMPLETE_BOUNDARY' }
  | { type: 'ADD_PRACTICE'; practice: string }
  | { type: 'SUBMIT_REFLECTION'; reflection: Partial<EmbodiedSovereigntyContext['reflections']> }
  | { type: 'RESET' };

export const embodiedSovereigntyMachine = setup({
  types: {
    context: {} as EmbodiedSovereigntyContext,
    events: {} as EmbodiedSovereigntyEvent,
  },
  guards: {
    stanceReady: ({ context }) => context.spineAlignment >= 6,
    breathReady: ({ context }) => context.breathDepth >= 6,
    voiceReady: ({ context }) => context.voiceClarity >= 6,
    readyForRealConversation: ({ context }) => 
      context.spineAlignment >= 7 && 
      context.breathDepth >= 7 && 
      context.voiceClarity >= 7,
  },
  actions: {
    logEvent: ({ context, event }) => {
      console.log(`EmbodiedSovereignty: ${event.type} - Practice ${context.currentPractice}`);
    },
    initializeSession: assign({
      sessionId: () => `embodied_sovereignty_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: () => Date.now(),
      spineAlignment: () => 3,
      breathDepth: () => 3,
      voiceClarity: () => 3,
      boundaryStrength: () => 3,
    }),
    improveStance: assign({
      spineAlignment: ({ context }) => Math.min(context.spineAlignment + 1, 10),
      currentPractice: () => 'stance' as const,
    }),
    improveBreath: assign({
      breathDepth: ({ context }) => Math.min(context.breathDepth + 1, 10),
      currentPractice: () => 'breath' as const,
    }),
    improveVoice: assign({
      voiceClarity: ({ context }) => Math.min(context.voiceClarity + 1, 10),
      currentPractice: () => 'voice' as const,
    }),
    improveBoundary: assign({
      boundaryStrength: ({ context }) => Math.min(context.boundaryStrength + 1, 10),
      currentPractice: () => 'boundary' as const,
      completedBoundaries: ({ context }) => context.completedBoundaries + 1,
    }),
    setStakesLevel: assign({
      practiceLevel: ({ event }) => {
        if (event.type === 'SET_STAKES') {
          return event.level;
        }
        return 'low-stakes';
      },
    }),
    addCenteringPractice: assign({
      centeringPractices: ({ context, event }) => {
        if (event.type === 'ADD_PRACTICE') {
          return [...context.centeringPractices, event.practice];
        }
        return context.centeringPractices;
      },
    }),
    updateReflection: assign({
      reflections: ({ context, event }) => {
        if (event.type === 'SUBMIT_REFLECTION') {
          return { ...context.reflections, ...event.reflection };
        }
        return context.reflections;
      },
    }),
  },
}).createMachine({
  id: 'embodiedSovereignty',
  initial: 'orientation',
  context: {
    currentPractice: 'stance',
    spineAlignment: 3,
    breathDepth: 3,
    voiceClarity: 3,
    boundaryStrength: 3,
    practiceLevel: 'low-stakes',
    sessionId: '',
    startTime: 0,
    completedBoundaries: 0,
    reflections: {
      whereHeldCenter: '',
      boundaryHonoured: '',
    },
    centeringPractices: [],
  },
  states: {
    orientation: {
      entry: ['logEvent', 'initializeSession'],
      on: {
        START: {
          target: 'practicing',
          actions: 'logEvent',
        },
      },
    },
    practicing: {
      entry: ['logEvent'],
      on: {
        PRACTICE_STANCE: {
          actions: 'improveStance',
        },
        PRACTICE_BREATH: {
          actions: 'improveBreath',
        },
        PRACTICE_VOICE: {
          actions: 'improveVoice',
        },
        PRACTICE_BOUNDARY: {
          actions: 'improveBoundary',
        },
        SET_STAKES: {
          actions: 'setStakesLevel',
        },
        ADD_PRACTICE: {
          actions: 'addCenteringPractice',
        },
        COMPLETE_BOUNDARY: {
          target: 'reflecting',
          guard: 'readyForRealConversation',
          actions: 'logEvent',
        },
      },
    },
    reflecting: {
      entry: ['logEvent'],
      on: {
        SUBMIT_REFLECTION: {
          target: 'complete',
          actions: ['updateReflection', 'logEvent'],
        },
      },
    },
    complete: {
      on: {
        RESET: {
          target: 'orientation',
        },
        PRACTICE_BOUNDARY: {
          target: 'practicing',
          actions: 'improveBoundary',
        },
      },
    },
  },
  history: 'shallow',
});