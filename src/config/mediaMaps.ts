export const COSMOGRAM = {
  videoId: '', // Empty until actual YouTube video ID is provided
  chapters: {
    cube: 0,
    circle: 180,
    witness: 360,
    eros: 540,
    butterfly: 720,
    justice: 900,
    all: 1080
  }
} as const;

export const SHIFT_MODULE_CONFIG = {
  media: COSMOGRAM,
  performance: {
    maxDrawCalls: 60,
    targetFPS: 60,
    mobileFPS: 30
  },
  animations: {
    erosPulseBPM: 60,
    butterflyFlutterSpeed: 0.5,
    justiceFootstepInterval: 1000
  }
} as const;

export type ChapterKey = keyof typeof COSMOGRAM.chapters;