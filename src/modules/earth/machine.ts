import { createMachine, assign, setup } from 'xstate';

export type BreathingMode = 'forest' | 'ocean' | 'atmosphere' | 'magnetic' | null;

export type CelestialBody = 'sun' | 'moon' | null;

export interface EarthContext {
  currentScene: string;
  isComfortable: boolean;
  audioGranted: boolean;
  groundConnected: boolean;
  pulseAligned: boolean;
  breathSynced: boolean;
  sessionId: string;
  startTime: number;
  breathingMode: BreathingMode;
  celestialBody: CelestialBody;
  celestialTime: number | null;
}

export type EarthEvent =
  | { type: 'START' }
  | { type: 'SET_CELESTIAL_BODY'; body: CelestialBody }
  | { type: 'TOGGLE_BREATH_SYNC' }
  | { type: 'SET_CELESTIAL_TIME'; time: number }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'ABORT' }
  | { type: 'COMPLETE' }
  | { type: 'STEP_IN' }
  | { type: 'PULSE_SYNC' }
  | { type: 'BREATH_SYNC' }
  | { type: 'AUDIO_PERMISSION'; granted: boolean }
  | { type: 'BREATHE' }
  | { type: 'SELECT_BREATHING_MODE'; mode: BreathingMode };

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
    breathingMode: null,
    celestialBody: null,
    celestialTime: null,
  },
  on: {
    SET_CELESTIAL_BODY: {
      actions: 'setCelestialBody',
    },
    SET_CELESTIAL_TIME: {
      actions: 'setCelestialTime',
    },
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
        BREATHE: {
          target: 'breathing',
          actions: ['logMarker'],
        },
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    breathing: {
      initial: 'animating',
      states: {
        animating: {
          on: {
            TOGGLE_BREATH_SYNC: 'syncing',
          },
        },
        syncing: {
          on: {
            TOGGLE_BREATH_SYNC: 'animating',
          },
        },
      },
      on: {
        SELECT_BREATHING_MODE: {
          actions: 'setBreathingMode',
        },
        BACK: {
          target: 'ground',
          actions: ['logMarker'],
        },
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
    setBreathingMode: assign({
      breathingMode: ({ event }) => {
        if (event.type === 'SELECT_BREATHING_MODE') {
          return event.mode;
        }
        return null;
      },
    }),
    setCelestialBody: assign({
      celestialBody: ({ event }) => {
        if (event.type === 'SET_CELESTIAL_BODY') {
          return event.body;
        }
        return null;
      },
    }),
    setCelestialTime: assign({
      celestialTime: ({ event }) => {
        if (event.type === 'SET_CELESTIAL_TIME') {
          return event.time;
        }
        return null;
      },
    }),
  },
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