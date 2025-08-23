import { describe, it, expect, vi } from 'vitest';
import { useLearningStore } from './learningStore';
import { act } from '@testing-library/react';

// Mock the console.log to spy on media control calls
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('learningStore', () => {
  it('should have a null initial activeNode', () => {
    const { activeNode } = useLearningStore.getState();
    expect(activeNode).toBeNull();
  });

  it('should update activeNode when onChapterJump is called', () => {
    act(() => {
      useLearningStore.getState().onChapterJump('test-node');
    });
    const { activeNode } = useLearningStore.getState();
    expect(activeNode).toBe('test-node');
  });

  it('should call media controls when activeNode changes', () => {
    act(() => {
      useLearningStore.getState().onChapterJump('media-node');
    });

    expect(consoleSpy).toHaveBeenCalledWith('activeNode changed from test-node to media-node');
    expect(consoleSpy).toHaveBeenCalledWith('Playing media for node: media-node');
    expect(consoleSpy).toHaveBeenCalledWith('Setting loop to: true');
  });

  it('should call pause when activeNode is cleared', () => {
    act(() => {
      useLearningStore.getState().onChapterJump(null as any); // a bit of a hack to clear
    });

    expect(consoleSpy).toHaveBeenCalledWith('activeNode cleared from media-node');
    expect(consoleSpy).toHaveBeenCalledWith('Pausing media');
    expect(consoleSpy).toHaveBeenCalledWith('Setting loop to: false');
  });
});
