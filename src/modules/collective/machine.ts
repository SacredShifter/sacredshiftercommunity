import { createMachine, assign, setup } from 'xstate';

export interface CollectiveContext {
  currentScene: string;
  isComfortable: boolean;
  audioGranted: boolean;
  circleJoined: boolean;
  breathSynced: boolean;
  coherenceReached: boolean;
  participantCount: number;
  sessionId: string;
  startTime: number;
}

export type CollectiveEvent =
  | { type: 'START' }
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'ABORT' }
  | { type: 'COMPLETE' }
  | { type: 'JOIN_CIRCLE' }
  | { type: 'SYNC_BREATH' }
  | { type: 'COHERENCE_ACHIEVED' }
  | { type: 'AUDIO_PERMISSION'; granted: boolean };

export const collectiveMachine = setup({
  types: {
    context: {} as CollectiveContext,
    events: {} as CollectiveEvent,
  },
  guards: {
    circleJoined: ({ context }) => context.circleJoined,
    breathSynced: ({ context }) => context.breathSynced,
    coherenceReached: ({ context }) => context.coherenceReached,
    audioGranted: ({ context }) => context.audioGranted,
  },
  actions: {
    logMarker: ({ context, event }) => {
      console.log(`Collective: ${event.type} at ${context.currentScene}`);
    },
    swapScene: assign({
      currentScene: ({ context, event }) => {
        const sceneMap: Record<string, string> = {
          START: 'circle',
          NEXT: getNextScene(context.currentScene),
        };
        return sceneMap[event.type] || context.currentScene;
      },
    }),
    joinCircle: assign({
      circleJoined: () => true,
      participantCount: ({ context }) => context.participantCount + 1,
    }),
    syncBreath: assign({
      breathSynced: () => true,
    }),
    achieveCoherence: assign({
      coherenceReached: () => true,
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
  id: 'collective',
  initial: 'intro',
  context: {
    currentScene: 'intro',
    isComfortable: true,
    audioGranted: false,
    circleJoined: false,
    breathSynced: false,
    coherenceReached: false,
    participantCount: 1,
    sessionId: '',
    startTime: 0,
  },
  states: {
    intro: {
      entry: assign({
        sessionId: () => `collective_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: () => Date.now(),
      }),
      on: {
        START: {
          target: 'circle',
          actions: ['logMarker', 'swapScene'],
        },
        AUDIO_PERMISSION: {
          actions: 'updateAudioGranted',
        },
      },
    },
    circle: {
      entry: ['swapScene'],
      on: {
        JOIN_CIRCLE: {
          actions: ['joinCircle'],
        },
        NEXT: {
          target: 'breathSync',
          guard: 'circleJoined',
          actions: ['logMarker'],
        },
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    breathSync: {
      entry: ['swapScene'],
      on: {
        SYNC_BREATH: {
          actions: ['syncBreath'],
        },
        NEXT: {
          target: 'coherence',
          guard: 'breathSynced',
          actions: ['logMarker'],
        },
        BACK: 'circle',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    coherence: {
      entry: ['swapScene'],
      on: {
        COHERENCE_ACHIEVED: {
          actions: ['achieveCoherence'],
        },
        NEXT: {
          target: 'witness',
          guard: 'coherenceReached',
          actions: ['logMarker'],
        },
        BACK: 'breathSync',
        PAUSE: 'paused',
        ABORT: 'exit',
      },
    },
    witness: {
      entry: ['swapScene'],
      on: {
        COMPLETE: {
          target: 'complete',
          actions: ['logMarker'],
        },
        BACK: 'coherence',
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
    intro: 'circle',
    circle: 'breathSync',
    breathSync: 'coherence',
    coherence: 'witness',
    witness: 'complete',
  };
  return progression[currentScene as keyof typeof progression] || currentScene;
}