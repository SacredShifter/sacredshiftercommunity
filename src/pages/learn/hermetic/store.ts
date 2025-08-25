import { create } from 'zustand'

type State = {
  progress: Record<string, 'incomplete'|'in_progress'|'complete'>
  setStatus: (k: string, s: State['progress'][string]) => void
}

export const useHermetic = create<State>((set) => ({
  progress: { mentalism: 'incomplete', vibration: 'incomplete' },
  setStatus: (k, s) => set((st) => ({ progress: { ...st.progress, [k]: s } }))
}))
