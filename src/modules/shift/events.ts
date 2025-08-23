import { ActiveNode } from './state/useShiftStore';

// Chapter jump event handler
export const onChapterJump = (node: ActiveNode) => {
  if (!node) return;

  // Emit analytics event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'media_chapter_jump', {
      node,
      timestamp: Date.now(),
      module: 'shift'
    });
  }

  // Custom event for other components to listen to
  const event = new CustomEvent('shift:chapterJump', {
    detail: { node, timestamp: Date.now() }
  });
  window.dispatchEvent(event);
};