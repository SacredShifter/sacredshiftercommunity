import { ActiveNode } from './store';

export const onChapterJump = (node: ActiveNode) => {
  console.log(`Jumping to chapter: ${node}`);
  // This will be connected to the xstate machine later
};
