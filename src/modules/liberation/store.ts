import { create } from 'zustand';

export type ActiveNode = 'cube' | 'circle' | 'witness' | 'eros' | 'butterfly' | 'justice' | null;

interface CosmogramState {
  activeNode: ActiveNode;
  setActiveNode: (node: ActiveNode) => void;
}

export const useCosmogramStore = create<CosmogramState>((set) => ({
  activeNode: null,
  setActiveNode: (node) => set({ activeNode: node }),
}));
