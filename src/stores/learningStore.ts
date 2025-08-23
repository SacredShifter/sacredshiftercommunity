import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Mock media controls
const mediaControls = {
  play: (nodeId: string) => console.log(`Playing media for node: ${nodeId}`),
  pause: () => console.log('Pausing media'),
  setLoop: (loop: boolean) => console.log(`Setting loop to: ${loop}`),
};

interface LearningState {
  activeNode: string | null;
  onChapterJump: (nodeId: string) => void;
}

export const useLearningStore = create<LearningState>()(
  subscribeWithSelector((set) => ({
    activeNode: null,
    onChapterJump: (nodeId: string) => set({ activeNode: nodeId }),
  }))
);

// Subscribe to activeNode changes
useLearningStore.subscribe(
  (state) => state.activeNode,
  (activeNode, previousActiveNode) => {
    if (activeNode) {
      console.log(`activeNode changed from ${previousActiveNode} to ${activeNode}`);
      mediaControls.play(activeNode);
      mediaControls.setLoop(true);
    } else if (previousActiveNode) {
      console.log(`activeNode cleared from ${previousActiveNode}`);
      mediaControls.pause();
      mediaControls.setLoop(false);
    }
  }
);
