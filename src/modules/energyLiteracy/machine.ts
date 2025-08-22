import { createMachine, assign, setup } from 'xstate';

export interface EnergyLiteracyContext {
  currentPhase: 'scan' | 'identify' | 'correct' | 'recheck';
  energyLevel: number; // 1-10 scale
  drainSources: string[];
  restorationMethods: string[];
  sessionId: string;
  startTime: number;
  dailyCheckins: number;
  reflections: {
    whatLeaked: string;
    whatRestored: string;
  };
  microPractices: string[];
  bodyAwareness: number; // 1-10 scale
}

export type EnergyLiteracyEvent =
  | { type: 'START' }
  | { type: 'SCAN_BODY' }
  | { type: 'IDENTIFY_DRAIN'; source: string }
  | { type: 'APPLY_CORRECTION'; method: string }
  | { type: 'RECHECK' }
  | { type: 'COMPLETE_CYCLE' }
  | { type: 'DAILY_CHECKIN' }
  | { type: 'ADD_MICRO_PRACTICE'; practice: string }
  | { type: 'SUBMIT_REFLECTION'; reflection: Partial<EnergyLiteracyContext['reflections']> }
  | { type: 'RESET' };

export const energyLiteracyMachine = setup({
  types: {
    context: {} as EnergyLiteracyContext,
    events: {} as EnergyLiteracyEvent,
  },
  guards: {
    hasIdentifiedDrain: ({ context }) => context.drainSources.length > 0,
    correctionApplied: ({ context }) => context.restorationMethods.length > 0,
    energyImproved: ({ context }) => context.energyLevel >= 6,
  },
  actions: {
    logEvent: ({ context, event }) => {
      console.log(`EnergyLiteracy: ${event.type} - Phase ${context.currentPhase}`);
    },
    initializeSession: assign({
      sessionId: () => `energy_literacy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startTime: () => Date.now(),
      energyLevel: () => 5,
      bodyAwareness: () => 3,
    }),
    improveAwareness: assign({
      bodyAwareness: ({ context }) => Math.min(context.bodyAwareness + 1, 10),
    }),
    identifyDrain: assign({
      drainSources: ({ context, event }) => {
        if (event.type === 'IDENTIFY_DRAIN') {
          return [...context.drainSources, event.source];
        }
        return context.drainSources;
      },
    }),
    applyCorrection: assign({
      restorationMethods: ({ context, event }) => {
        if (event.type === 'APPLY_CORRECTION') {
          return [...context.restorationMethods, event.method];
        }
        return context.restorationMethods;
      },
      energyLevel: ({ context }) => Math.min(context.energyLevel + 2, 10),
    }),
    addMicroPractice: assign({
      microPractices: ({ context, event }) => {
        if (event.type === 'ADD_MICRO_PRACTICE') {
          return [...context.microPractices, event.practice];
        }
        return context.microPractices;
      },
    }),
    incrementCheckin: assign({
      dailyCheckins: ({ context }) => context.dailyCheckins + 1,
    }),
    updateReflection: assign({
      reflections: ({ context, event }) => {
        if (event.type === 'SUBMIT_REFLECTION') {
          return { ...context.reflections, ...event.reflection };
        }
        return context.reflections;
      },
    }),
    moveToNextPhase: assign({
      currentPhase: ({ context }) => {
        const phases = ['scan', 'identify', 'correct', 'recheck'] as const;
        const currentIndex = phases.indexOf(context.currentPhase);
        return phases[Math.min(currentIndex + 1, phases.length - 1)];
      },
    }),
    resetToScan: assign({
      currentPhase: () => 'scan' as const,
    }),
  },
}).createMachine({
  id: 'energyLiteracy',
  initial: 'orientation',
  context: {
    currentPhase: 'scan',
    energyLevel: 5,
    drainSources: [],
    restorationMethods: [],
    sessionId: '',
    startTime: 0,
    dailyCheckins: 0,
    reflections: {
      whatLeaked: '',
      whatRestored: '',
    },
    microPractices: [],
    bodyAwareness: 3,
  },
  states: {
    orientation: {
      entry: ['logEvent', 'initializeSession'],
      on: {
        START: {
          target: 'scanning',
          actions: 'logEvent',
        },
      },
    },
    scanning: {
      entry: ['logEvent'],
      on: {
        SCAN_BODY: {
          target: 'identifying',
          actions: ['improveAwareness', 'moveToNextPhase'],
        },
      },
    },
    identifying: {
      entry: ['logEvent'],
      on: {
        IDENTIFY_DRAIN: {
          target: 'correcting',
          actions: ['identifyDrain', 'moveToNextPhase'],
        },
      },
    },
    correcting: {
      entry: ['logEvent'],
      on: {
        APPLY_CORRECTION: {
          target: 'rechecking',
          actions: ['applyCorrection', 'moveToNextPhase'],
        },
        ADD_MICRO_PRACTICE: {
          actions: 'addMicroPractice',
        },
      },
    },
    rechecking: {
      entry: ['logEvent'],
      on: {
        RECHECK: [
          {
            target: 'complete',
            guard: 'energyImproved',
            actions: 'logEvent',
          },
          {
            target: 'scanning',
            actions: 'resetToScan',
          },
        ],
        COMPLETE_CYCLE: {
          target: 'complete',
          actions: 'logEvent',
        },
      },
    },
    complete: {
      on: {
        DAILY_CHECKIN: {
          target: 'scanning',
          actions: ['incrementCheckin', 'resetToScan'],
        },
        SUBMIT_REFLECTION: {
          actions: 'updateReflection',
        },
        RESET: {
          target: 'orientation',
        },
      },
    },
  },
  history: 'shallow',
});