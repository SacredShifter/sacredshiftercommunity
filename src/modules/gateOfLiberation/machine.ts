import { createMachine, assign, setup } from 'xstate';

export interface GateOfLiberationContext {
  currentScene: 'hall' | 'crossing' | 'expansion' | 'integration';
  fearLevel: number; // 1-10 scale
  breathCycles: number;
  crossingComplete: boolean;
  arousalLevel: number; // 1-10 scale
  sessionId: string;
  startTime: number;
  reflections: {
    whatChanged: string;
    saferNow: string;
  };
  comfortMode: boolean;
}

export type GateOfLiberationEvent =
  | { type: 'START' }
  | { type: 'ENTER_CROSSING' }
  | { type: 'STEP_THROUGH' }
  | { type: 'COMPLETE_SCENE' }
  | { type: 'BREATH_CYCLE' }
  | { type: 'AROUSAL_RISE' }
  | { type: 'AROUSAL_DROP' }
  | { type: 'COMFORT_MODE'; enabled: boolean }
  | { type: 'SUBMIT_REFLECTION'; reflection: Partial<GateOfLiberationContext['reflections']> }
  | { type: 'RESET' };

export const gateOfLiberationMachine = setup({
  types: {
    context: {} as GateOfLiberationContext,
    events: {} as GateOfLiberationEvent,
  },
  guards: {
    readyToCross: ({ context }) => context.fearLevel <= 5 && context.breathCycles >= 3,
    arousalManageable: ({ context }) => context.arousalLevel <= 7,
    crossingComplete: ({ context }) => context.crossingComplete,
  },
  actions: {
    logEvent: ({ context, event }) => {
      console.log(`GateOfLiberation: ${event.type} - Scene ${context.currentScene}`);
    },
    initializeSession: assign({
      sessionId: () => `gate_liberation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: () => Date.now(),
      breathCycles: () => 0,
      fearLevel: () => 7,
    }),
    incrementBreath: assign({
      breathCycles: ({ context }) => context.breathCycles + 1,
    }),
    reduceFear: assign({
      fearLevel: ({ context }) => Math.max(context.fearLevel - 1, 1),
    }),
    increaseArousal: assign({
      arousalLevel: ({ context }) => Math.min(context.arousalLevel + 2, 10),
    }),
    manageArousal: assign({
      arousalLevel: ({ context }) => Math.max(context.arousalLevel - 1, 1),
    }),
    completeCrossing: assign({
      crossingComplete: () => true,
    }),
    updateReflection: assign({
      reflections: ({ context, event }) => {
        if (event.type === 'SUBMIT_REFLECTION') {
          return { ...context.reflections, ...event.reflection };
        }
        return context.reflections;
      },
    }),
    setComfortMode: assign({
      comfortMode: ({ event }) => {
        if (event.type === 'COMFORT_MODE') {
          return event.enabled;
        }
        return false;
      },
    }),
    moveToNextScene: assign({
      currentScene: ({ context }) => {
        const scenes = ['hall', 'crossing', 'expansion', 'integration'] as const;
        const currentIndex = scenes.indexOf(context.currentScene);
        return scenes[Math.min(currentIndex + 1, scenes.length - 1)];
      },
    }),
  },
}).createMachine({
  id: 'gateOfLiberation',
  initial: 'orientation',
  context: {
    currentScene: 'hall',
    fearLevel: 7,
    breathCycles: 0,
    crossingComplete: false,
    arousalLevel: 3,
    sessionId: '',
    startTime: 0,
    reflections: {
      whatChanged: '',
      saferNow: '',
    },
    comfortMode: true,
  },
  states: {
    orientation: {
      entry: ['logEvent', 'initializeSession'],
      on: {
        START: {
          target: 'hallOfFear',
          actions: 'logEvent',
        },
        COMFORT_MODE: {
          actions: 'setComfortMode',
        },
      },
    },
    hallOfFear: {
      entry: ['logEvent'],
      on: {
        BREATH_CYCLE: {
          actions: ['incrementBreath', 'reduceFear'],
        },
        ENTER_CROSSING: {
          target: 'crossing',
          guard: 'readyToCross',
          actions: ['logEvent', 'moveToNextScene'],
        },
        AROUSAL_RISE: {
          actions: 'increaseArousal',
        },
      },
    },
    crossing: {
      entry: ['logEvent'],
      on: {
        STEP_THROUGH: {
          target: 'expansion',
          actions: ['completeCrossing', 'moveToNextScene', 'logEvent'],
        },
        AROUSAL_RISE: {
          actions: ['increaseArousal', 'manageArousal'],
        },
        BREATH_CYCLE: {
          actions: ['incrementBreath', 'manageArousal'],
        },
      },
    },
    expansion: {
      entry: ['logEvent'],
      on: {
        BREATH_CYCLE: {
          actions: 'incrementBreath',
        },
        COMPLETE_SCENE: {
          target: 'integration',
          actions: ['logEvent', 'moveToNextScene'],
        },
      },
    },
    integration: {
      entry: ['logEvent'],
      on: {
        SUBMIT_REFLECTION: {
          actions: 'updateReflection',
        },
        COMPLETE_SCENE: {
          target: 'complete',
          actions: 'logEvent',
        },
      },
    },
    complete: {
      type: 'final',
      entry: ['logEvent'],
    },
  },
  history: 'shallow',
});