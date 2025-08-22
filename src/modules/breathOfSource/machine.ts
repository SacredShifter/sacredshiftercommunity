import { createMachine, assign, setup } from 'xstate';

export interface BreathOfSourceContext {
  currentLesson: number;
  trustSpeed: 'gentle' | 'balanced' | 'bold';
  isComfortable: boolean;
  audioGranted: boolean;
  breathPreset: string;
  cycleCount: number;
  sessionId: string;
  startTime: number;
  reflections: {
    chosenExperience: string;
    readyToRelease: string;
    fearLoosened: number; // 1-5 scale
    bodySafety: number; // 1-5 scale
  };
  sovereigntyAnchors: boolean;
  completedLessons: number[];
}

export type BreathOfSourceEvent =
  | { type: 'START' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'COMPLETE_LESSON' }
  | { type: 'COMPLETE_MODULE' }
  | { type: 'BREATH_CYCLE' }
  | { type: 'SOVEREIGNTY_ANCHOR' }
  | { type: 'SUBMIT_REFLECTION'; reflection: Partial<BreathOfSourceContext['reflections']> }
  | { type: 'SET_TRUST_SPEED'; speed: 'gentle' | 'balanced' | 'bold' }
  | { type: 'SET_PRESET'; preset: string }
  | { type: 'COMFORT_CHECK'; comfortable: boolean }
  | { type: 'AUDIO_PERMISSION'; granted: boolean };

export const breathOfSourceMachine = setup({
  types: {
    context: {} as BreathOfSourceContext,
    events: {} as BreathOfSourceEvent,
  },
  guards: {
    comfortOK: ({ context }) => context.isComfortable,
    audioOK: ({ context }) => context.audioGranted,
    lessonCompleted: ({ context }, { lessonNumber }: { lessonNumber: number }) => 
      context.completedLessons.includes(lessonNumber),
    enoughCycles: ({ context }) => context.cycleCount >= 5,
  },
  actions: {
    logEvent: ({ context, event }) => {
      console.log(`BreathOfSource: ${event.type} - Lesson ${context.currentLesson}`);
    },
    startBreath: assign({
      cycleCount: () => 0,
      startTime: () => Date.now(),
    }),
    nextLesson: assign({
      currentLesson: ({ context }) => Math.min(context.currentLesson + 1, 5),
    }),
    prevLesson: assign({
      currentLesson: ({ context }) => Math.max(context.currentLesson - 1, 0),
    }),
    incrementCycle: assign({
      cycleCount: ({ context }) => context.cycleCount + 1,
    }),
    completeLesson: assign({
      completedLessons: ({ context }) => {
        if (!context.completedLessons.includes(context.currentLesson)) {
          return [...context.completedLessons, context.currentLesson];
        }
        return context.completedLessons;
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
    setTrustSpeed: assign({
      trustSpeed: ({ event }) => {
        if (event.type === 'SET_TRUST_SPEED') {
          return event.speed;
        }
        return 'balanced';
      },
    }),
    setPreset: assign({
      breathPreset: ({ event }) => {
        if (event.type === 'SET_PRESET') {
          return event.preset;
        }
        return 'basic';
      },
    }),
    updateComfort: assign({
      isComfortable: ({ event }) => {
        if (event.type === 'COMFORT_CHECK') {
          return event.comfortable;
        }
        return false;
      },
    }),
    updateAudioGranted: assign({
      audioGranted: ({ event }) => {
        if (event.type === 'AUDIO_PERMISSION') {
          return event.granted;
        }
        return false;
      },
    }),
    enableSovereigntyAnchors: assign({
      sovereigntyAnchors: () => true,
    }),
  },
}).createMachine({
  id: 'breathOfSource',
  initial: 'orientation',
  context: {
    currentLesson: 0,
    trustSpeed: 'balanced',
    isComfortable: true,
    audioGranted: false,
    breathPreset: 'basic',
    cycleCount: 0,
    sessionId: '',
    startTime: 0,
    reflections: {
      chosenExperience: '',
      readyToRelease: '',
      fearLoosened: 3,
      bodySafety: 3,
    },
    sovereigntyAnchors: false,
    completedLessons: [],
  },
  states: {
    orientation: {
      entry: assign({
        sessionId: () => `breath_source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: () => Date.now(),
      }),
      on: {
        SET_TRUST_SPEED: {
          actions: 'setTrustSpeed',
        },
        COMFORT_CHECK: {
          actions: 'updateComfort',
        },
        AUDIO_PERMISSION: {
          actions: 'updateAudioGranted',
        },
        START: {
          target: 'lesson1',
          guard: 'comfortOK',
          actions: ['logEvent', 'nextLesson'],
        },
      },
    },
    lesson1: {
      entry: ['logEvent'],
      on: {
        SET_PRESET: {
          actions: 'setPreset',
        },
        BREATH_CYCLE: {
          actions: 'incrementCycle',
        },
        COMPLETE_LESSON: {
          target: 'lesson2',
          guard: 'enoughCycles',
          actions: ['completeLesson', 'nextLesson', 'logEvent'],
        },
        BACK: {
          target: 'orientation',
          actions: 'prevLesson',
        },
        PAUSE: 'paused',
      },
    },
    lesson2: {
      entry: ['logEvent', 'enableSovereigntyAnchors'],
      on: {
        SET_PRESET: {
          actions: 'setPreset',
        },
        BREATH_CYCLE: {
          actions: 'incrementCycle',
        },
        SOVEREIGNTY_ANCHOR: {
          actions: 'logEvent',
        },
        SUBMIT_REFLECTION: {
          actions: 'updateReflection',
        },
        COMPLETE_LESSON: {
          target: 'lesson3',
          guard: 'enoughCycles',
          actions: ['completeLesson', 'nextLesson', 'logEvent'],
        },
        BACK: {
          target: 'lesson1',
          actions: 'prevLesson',
        },
        PAUSE: 'paused',
      },
    },
    lesson3: {
      entry: ['logEvent'],
      on: {
        SET_PRESET: {
          actions: 'setPreset',
        },
        BREATH_CYCLE: {
          actions: 'incrementCycle',
        },
        SOVEREIGNTY_ANCHOR: {
          actions: 'logEvent',
        },
        COMPLETE_LESSON: {
          target: 'lesson4',
          guard: 'enoughCycles',
          actions: ['completeLesson', 'nextLesson', 'logEvent'],
        },
        BACK: {
          target: 'lesson2',
          actions: 'prevLesson',
        },
        PAUSE: 'paused',
      },
    },
    lesson4: {
      entry: ['logEvent'],
      on: {
        SOVEREIGNTY_ANCHOR: {
          actions: 'logEvent',
        },
        COMPLETE_LESSON: {
          target: 'lesson5',
          actions: ['completeLesson', 'nextLesson', 'logEvent'],
        },
        BACK: {
          target: 'lesson3',
          actions: 'prevLesson',
        },
        PAUSE: 'paused',
      },
    },
    lesson5: {
      entry: ['logEvent'],
      on: {
        SUBMIT_REFLECTION: {
          actions: 'updateReflection',
        },
        COMPLETE_MODULE: {
          target: 'complete',
          actions: ['completeLesson', 'logEvent'],
        },
        BACK: {
          target: 'lesson4',
          actions: 'prevLesson',
        },
        PAUSE: 'paused',
      },
    },
    paused: {
      on: {
        RESUME: {
          target: 'orientation', // Simple resume to current lesson
        },
        COMPLETE_MODULE: 'complete',
      },
    },
    complete: {
      type: 'final',
      entry: ['logEvent'],
    },
  },
  history: 'shallow',
});