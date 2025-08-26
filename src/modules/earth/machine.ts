import { createMachine, assign, setup } from 'xstate';

export type BreathingMode = 'forest' | 'ocean' | 'atmosphere' | 'magnetic' | null;
export type CelestialBody = 'sun' | 'moon' | null;

export interface EarthContext {
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
  | { type: 'SELECT_BREATHING_MODE'; mode: BreathingMode };

export const earthMachine = setup({
  types: {
    context: {} as EarthContext,
    events: {} as EarthEvent,
  },
}).createMachine({
  id: 'earth',
  initial: 'intro',
  context: {
    sessionId: '',
    startTime: 0,
    breathingMode: null,
    celestialBody: null,
    celestialTime: null,
  },
  on: {
    SET_CELESTIAL_BODY: {
      actions: ['setCelestialBody'],
    },
    SET_CELESTIAL_TIME: {
      actions: ['setCelestialTime'],
    },
    SELECT_BREATHING_MODE: {
      actions: ['setBreathingMode'],
    },
  },
  states: {
    intro: {
      entry: assign({
        sessionId: () => `earth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: () => Date.now(),
      }),
      on: {
        START: 'breathing',
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
    },
  },
  actions: {
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