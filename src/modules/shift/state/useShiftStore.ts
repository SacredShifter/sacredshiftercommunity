import { create } from 'zustand';

export type ActiveNode = 'cube' | 'circle' | 'witness' | 'eros' | 'butterfly' | 'justice' | null;
export type PlaybackMode = 'chapter' | 'all' | 'paused';

interface ShiftState {
  activeNode: ActiveNode;
  setActiveNode: (node: ActiveNode) => void;
  playbackMode: PlaybackMode;
  setPlaybackMode: (mode: PlaybackMode) => void;
  volume: number;
  setVolume: (volume: number) => void;
  currentChapter: string | null;
  setCurrentChapter: (chapter: string | null) => void;
}

export const useShiftStore = create<ShiftState>((set) => ({
  activeNode: null,
  setActiveNode: (node) => set({ activeNode: node }),
  playbackMode: 'paused',
  setPlaybackMode: (mode) => set({ playbackMode: mode }),
  volume: 0.7,
  setVolume: (volume) => set({ volume }),
  currentChapter: null,
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
}));