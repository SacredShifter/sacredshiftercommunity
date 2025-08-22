import { createMachine, assign, setup } from 'xstate';

export interface SovereignLoveContext {
  currentPractice: 'morning' | 'midday' | 'evening';
  heartOpenness: number; // 1-10 scale
  spineClarity: number; // 1-10 scale
  boundariesSet: number;
  selfCareBalance: number; // 1-10 scale
  sessionId: string;
  startTime: number;
  dailyBoundary: string;
  reflections: {
    whereOvergave: string;
    tradedPeaceForApproval: string;
    boundaryKeepsLoveClean: string;
    chosenExperience: string;
    releasedOnExhale: string;
  };
  mantras: string[];
  microRituals: string[];
}

export type SovereignLoveEvent =
  | { type: 'START' }
  | { type: 'MORNING_RITUAL' }
  | { type: 'MIDDAY_CHECK' }
  | { type: 'EVENING_RELEASE' }
  | { type: 'SET_BOUNDARY'; boundary: string }
  | { type: 'PRACTICE_MANTRA'; mantra: string }
  | { type: 'BREATH_CYCLE' }
  | { type: 'SUBMIT_REFLECTION'; reflection: Partial<SovereignLoveContext['reflections']> }
  | { type: 'ADD_RITUAL'; ritual: string }
  | { type: 'RESET' };

export const sovereignLoveMachine = setup({
  types: {
    context: {} as SovereignLoveContext,
    events: {} as SovereignLoveEvent,
  },
  guards: {
    heartAndSpineReady: ({ context }) => 
      context.heartOpenness >= 6 && context.spineClarity >= 6,
    boundarySet: ({ context }) => context.dailyBoundary.length > 0,
    balanced: ({ context }) => context.selfCareBalance >= 7,
  },
  actions: {
    logEvent: ({ context, event }) => {
      console.log(`SovereignLove: ${event.type} - Practice ${context.currentPractice}`);
    },
    initializeSession: assign({
      sessionId: () => `sovereign_love_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: () => Date.now(),
      heartOpenness: () => 5,
      spineClarity: () => 5,
      selfCareBalance: () => 5,
      mantras: () => [
        'I love you and I will not leave myself',
        'My no protects my yes',
        'Care never requires self harm',
        'Compassion with a spine',
        'Clarity is kindness'
      ],
    }),
    morningRitual: assign({
      currentPractice: () => 'morning' as const,
      heartOpenness: ({ context }) => Math.min(context.heartOpenness + 1, 10),
    }),
    middayCheck: assign({
      currentPractice: () => 'midday' as const,
      spineClarity: ({ context }) => Math.min(context.spineClarity + 1, 10),
    }),
    eveningRelease: assign({
      currentPractice: () => 'evening' as const,
      selfCareBalance: ({ context }) => Math.min(context.selfCareBalance + 2, 10),
    }),
    setBoundary: assign({
      dailyBoundary: ({ event }) => {
        if (event.type === 'SET_BOUNDARY') {
          return event.boundary;
        }
        return '';
      },
      boundariesSet: ({ context }) => context.boundariesSet + 1,
    }),
    addRitual: assign({
      microRituals: ({ context, event }) => {
        if (event.type === 'ADD_RITUAL') {
          return [...context.microRituals, event.ritual];
        }
        return context.microRituals;
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
    strengthenHeartSpine: assign({
      heartOpenness: ({ context }) => Math.min(context.heartOpenness + 1, 10),
      spineClarity: ({ context }) => Math.min(context.spineClarity + 1, 10),
    }),
  },
}).createMachine({
  id: 'sovereignLove',
  initial: 'orientation',
  context: {
    currentPractice: 'morning',
    heartOpenness: 5,
    spineClarity: 5,
    boundariesSet: 0,
    selfCareBalance: 5,
    sessionId: '',
    startTime: 0,
    dailyBoundary: '',
    reflections: {
      whereOvergave: '',
      tradedPeaceForApproval: '',
      boundaryKeepsLoveClean: '',
      chosenExperience: '',
      releasedOnExhale: '',
    },
    mantras: [],
    microRituals: [],
  },
  states: {
    orientation: {
      entry: ['logEvent', 'initializeSession'],
      on: {
        START: {
          target: 'dailyPractice',
          actions: 'logEvent',
        },
      },
    },
    dailyPractice: {
      entry: ['logEvent'],
      on: {
        MORNING_RITUAL: {
          actions: 'morningRitual',
        },
        MIDDAY_CHECK: {
          actions: 'middayCheck',
        },
        EVENING_RELEASE: {
          actions: 'eveningRelease',
        },
        SET_BOUNDARY: {
          actions: 'setBoundary',
        },
        BREATH_CYCLE: {
          actions: 'strengthenHeartSpine',
        },
        ADD_RITUAL: {
          actions: 'addRitual',
        },
        SUBMIT_REFLECTION: {
          target: 'reflecting',
          actions: 'updateReflection',
        },
      },
    },
    reflecting: {
      entry: ['logEvent'],
      on: {
        SUBMIT_REFLECTION: {
          actions: 'updateReflection',
        },
        RESET: {
          target: 'complete',
          guard: 'balanced',
          actions: 'logEvent',
        },
      },
    },
    complete: {
      on: {
        RESET: {
          target: 'orientation',
        },
        MORNING_RITUAL: {
          target: 'dailyPractice',
          actions: 'morningRitual',
        },
      },
    },
  },
  history: 'shallow',
});