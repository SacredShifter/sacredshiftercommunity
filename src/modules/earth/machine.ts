import { createMachine, assign, setup } from 'xstate';

export interface EarthContext {
  currentScene: string;
  isComfortable: boolean;
  audioGranted: boolean;
  groundConnected: boolean;
  pulseAligned: boolean;
  breathSynced: boolean;
  sessionId: string;
  startTime: number;
}

export type EarthEvent =
  | { type: 'START' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'ABORT' }
  | { type: 'COMPLETE' }
  | { type: 'STEP_IN' }
  | { type: 'PULSE_SYNC' }
  | { type: 'BREATH_SYNC' }
  | { type: 'AUDIO_PERMISSION'; granted: boolean };

export const earthMachine = setup({
  types: {
    context: {} as EarthContext,
    events: {} as EarthEvent,
  },
  guards: {
    groundConnected: ({ context }) => context.groundConnected,
    pulseAligned: ({ context }) => context.pulseAligned,
    breathSynced: ({ context }) => context.breathSynced,
    audioGranted: ({ context }) => context.audioGranted,
  },
  actions: {
    logMarker: ({ context, event }) => {
      console.log(`Earth: ${event.type} at ${context.currentScene}`);
    },
    swapScene: assign({
      currentScene: ({ context, event }) => {
        const sceneMap: Record<string, string> = {
          START: 'ground',
          NEXT: getNextScene(context.currentScene),
        };
        return sceneMap[event.type] || context.currentScene;
      },
    }),
    connectGround: assign({
      groundConnected: () => true,
    }),
    alignPulse: assign({
      pulseAligned: () => true,
    }),
    syncBreath: assign({
      breathSynced: () => true,
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
  id: 'earth',
  initial: 'intro',
  context: {
    currentScene: 'intro',
    isComfortable: true,
    audioGranted: false,
    groundConnected: false,
    pulseAligned: false,
    breathSynced: false,
    sessionId: '',
    startTime: 0,
  },
  states: {
    intro: {
      entry: assign({
        sessionId: () => `earth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: () => Date.now(),
      }),
      on: {
        START: {
          target: 'ground',
          actions: ['logMarker', 'swapScene'],
        },
        AUDIO_PERMISSION: {
          actions: 'updateAudioGranted',
        },
      },
    },
    ground: {
      entry: ['swapScene'],
      on: {
        STEP_IN: {
          actions: ['connectGround'],
        },
        NEXT: {
          target: 'pulse',
          guard: 'groundConnected',
          actions: ['logMarker'],
        },
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    pulse: {
      entry: ['swapScene'],
      on: {
        PULSE_SYNC: {
          actions: ['alignPulse'],
        },
        NEXT: {
          target: 'sync',
          guard: 'pulseAligned',
          actions: ['logMarker'],
        },
        BACK: 'ground',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    sync: {
      entry: ['swapScene'],
      on: {
        BREATH_SYNC: {
          actions: ['syncBreath'],
        },
        NEXT: {
          target: 'integration',
          guard: 'breathSynced',
          actions: ['logMarker'],
        },
        BACK: 'pulse',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    integration: {
      entry: ['swapScene'],
      on: {
        COMPLETE: {
          target: 'complete',
          actions: ['logMarker'],
        },
        BACK: 'sync',
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
    intro: 'ground',
    ground: 'pulse',
    pulse: 'sync',
    sync: 'integration',
    integration: 'complete',
  };
  return progression[currentScene as keyof typeof progression] || currentScene;
}