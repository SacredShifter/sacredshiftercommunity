import { createMachine, assign, setup } from 'xstate';

export interface UnhookingContext {
  currentScene: string;
  isComfortable: boolean;
  audioGranted: boolean;
  fragmentsCleared: number;
  totalFragments: number;
  fogIntensity: number;
  sessionId: string;
  startTime: number;
}

export type UnhookingEvent =
  | { type: 'START' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'ABORT' }
  | { type: 'COMPLETE' }
  | { type: 'CLEAR_FRAGMENT' }
  | { type: 'BREATH_CLEAR' }
  | { type: 'AUDIO_PERMISSION'; granted: boolean };

export const unhookingMachine = setup({
  types: {
    context: {} as UnhookingContext,
    events: {} as UnhookingEvent,
  },
  guards: {
    allFragmentsCleared: ({ context }) => context.fragmentsCleared >= context.totalFragments,
    fogCleared: ({ context }) => context.fogIntensity <= 0.1,
    audioGranted: ({ context }) => context.audioGranted,
  },
  actions: {
    logMarker: ({ context, event }) => {
      console.log(`Unhooking: ${event.type} at ${context.currentScene}`);
    },
    swapScene: assign({
      currentScene: ({ context, event }) => {
        const sceneMap: Record<string, string> = {
          START: 'fog',
          NEXT: getNextScene(context.currentScene),
        };
        return sceneMap[event.type] || context.currentScene;
      },
    }),
    clearFragment: assign({
      fragmentsCleared: ({ context }) => context.fragmentsCleared + 1,
    }),
    breathClear: assign({
      fogIntensity: ({ context }) => Math.max(0, context.fogIntensity - 0.2),
    }),
    resetFog: assign({
      fogIntensity: () => 1.0,
    }),
    updateAudioGranted: assign({
      audioGranted: ({ event }) => {
        if (event.type === 'AUDIO_PERMISSION') {
          return event.granted;
        }
        return false;
      },
    }),
  },
}).createMachine({
  id: 'unhooking',
  initial: 'intro',
  context: {
    currentScene: 'intro',
    isComfortable: true,
    audioGranted: false,
    fragmentsCleared: 0,
    totalFragments: 8,
    fogIntensity: 1.0,
    sessionId: '',
    startTime: 0,
  },
  states: {
    intro: {
      entry: assign({
        sessionId: () => `unhook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: () => Date.now(),
      }),
      on: {
        START: {
          target: 'fog',
          actions: ['logMarker', 'swapScene', 'resetFog'],
        },
        AUDIO_PERMISSION: {
          actions: 'updateAudioGranted',
        },
      },
    },
    fog: {
      entry: ['swapScene'],
      on: {
        CLEAR_FRAGMENT: {
          actions: ['clearFragment', 'logMarker'],
        },
        NEXT: {
          target: 'recognition',
          guard: 'allFragmentsCleared',
          actions: ['logMarker'],
        },
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    recognition: {
      entry: ['swapScene'],
      on: {
        NEXT: {
          target: 'clearing',
          actions: ['logMarker'],
        },
        BACK: 'fog',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    clearing: {
      entry: ['swapScene'],
      on: {
        BREATH_CLEAR: {
          actions: ['breathClear'],
        },
        NEXT: {
          target: 'calm',
          guard: 'fogCleared',
          actions: ['logMarker'],
        },
        BACK: 'recognition',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    calm: {
      entry: ['swapScene'],
      on: {
        COMPLETE: {
          target: 'complete',
          actions: ['logMarker'],
        },
        BACK: 'clearing',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    paused: {
      on: {
        RESUME: {
          target: 'intro',
        },
        ABORT: 'exit',
      },
    },
    complete: {
      type: 'final',
    },
    exit: {
      type: 'final',
    },
  },
  history: 'shallow',
});

function getNextScene(currentScene: string): string {
  const progression = {
    intro: 'fog',
    fog: 'recognition',
    recognition: 'clearing',
    clearing: 'calm',
    calm: 'complete',
  };
  return progression[currentScene as keyof typeof progression] || currentScene;
}