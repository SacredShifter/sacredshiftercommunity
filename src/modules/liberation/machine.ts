import { createMachine, assign, setup } from 'xstate';

export interface LiberationContext {
  currentScene: string;
  isComfortable: boolean;
  audioGranted: boolean;
  deviceOK: boolean;
  sessionId: string;
  startTime: number;
  arousalLevel: number;
  completedPhases: string[];
  perfFlags: string[];
  comfortSettings: {
    motionReduced: boolean;
    volumeLevel: number;
    vignetteEnabled: boolean;
    fovClamped: boolean;
  };
}

export type LiberationEvent =
  | { type: 'START' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'ABORT' }
  | { type: 'COMPLETE' }
  | { type: 'COMFORT_TOGGLE'; setting: string; value: any }
  | { type: 'AROUSAL_UPDATE'; level: number }
  | { type: 'DEVICE_CHECK'; ok: boolean }
  | { type: 'AUDIO_PERMISSION'; granted: boolean };

export const liberationMachine = setup({
  types: {
    context: {} as LiberationContext,
    events: {} as LiberationEvent,
  },
  guards: {
    deviceOK: ({ context }) => context.deviceOK,
    comfortOK: ({ context }) => context.isComfortable && context.arousalLevel < 7,
    audioGranted: ({ context }) => context.audioGranted,
  },
  actions: {
    logMarker: ({ context, event }) => {
      console.log(`Liberation: ${event.type} at ${context.currentScene}`);
      // This will be replaced with actual telemetry
    },
    playSfx: ({ context }) => {
      if (context.audioGranted) {
        // Audio system will handle this
      }
    },
    swapScene: assign({
      currentScene: ({ context, event }) => {
        const sceneMap: Record<string, string> = {
          START: 'fear',
          NEXT: getNextScene(context.currentScene),
        };
        return sceneMap[event.type] || context.currentScene;
      },
    }),
    startBreathCoach: () => {
      // Breath coach initialization
    },
    saveSession: () => {
      // Save to Supabase
    },
    pushReflection: () => {
      // Push to reflection system
    },
    updateAudioGranted: assign({
      audioGranted: ({ event }) => {
        if (event.type === 'AUDIO_PERMISSION') {
          return event.granted;
        }
        return false;
      },
    }),
    updateDeviceOK: assign({
      deviceOK: ({ event }) => {
        if (event.type === 'DEVICE_CHECK') {
          return event.ok;
        }
        return true;
      },
    }),
    updateArousalLevel: assign({
      arousalLevel: ({ event }) => {
        if (event.type === 'AROUSAL_UPDATE') {
          return event.level;
        }
        return 0;
      },
    }),
  },
}).createMachine({
  id: 'liberation',
  initial: 'intro',
  context: {
    currentScene: 'intro',
    isComfortable: true,
    audioGranted: false,
    deviceOK: true,
    sessionId: '',
    startTime: 0,
    arousalLevel: 0,
    completedPhases: [],
    perfFlags: [],
    comfortSettings: {
      motionReduced: false,
      volumeLevel: 0.7,
      vignetteEnabled: true,
      fovClamped: false,
    },
  },
  states: {
    intro: {
      entry: assign({
        sessionId: () => `lib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: () => Date.now(),
      }),
      on: {
        START: {
          target: 'fear',
          guard: 'deviceOK',
          actions: ['logMarker', 'swapScene'],
        },
        AUDIO_PERMISSION: {
          actions: 'updateAudioGranted',
        },
        DEVICE_CHECK: {
          actions: 'updateDeviceOK',
        },
      },
    },
    fear: {
      entry: ['playSfx', 'swapScene'],
      on: {
        NEXT: {
          target: 'crossing',
          guard: 'comfortOK',
          actions: ['logMarker'],
        },
        PAUSE: 'paused',
        ABORT: 'exit',
        AROUSAL_UPDATE: {
          actions: 'updateArousalLevel',
        },
      },
    },
    crossing: {
      entry: ['swapScene'],
      on: {
        NEXT: {
          target: 'expansion',
          actions: ['logMarker', 'swapScene'],
        },
        BACK: 'fear',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    expansion: {
      entry: ['swapScene', 'startBreathCoach'],
      on: {
        NEXT: {
          target: 'integration',
          actions: ['logMarker'],
        },
        BACK: 'crossing',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    integration: {
      entry: ['swapScene'],
      on: {
        COMPLETE: {
          target: 'complete',
          actions: ['saveSession', 'pushReflection'],
        },
        BACK: 'expansion',
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
    intro: 'fear',
    fear: 'crossing',
    crossing: 'expansion',
    expansion: 'integration',
    integration: 'complete',
  };
  return progression[currentScene as keyof typeof progression] || currentScene;
}