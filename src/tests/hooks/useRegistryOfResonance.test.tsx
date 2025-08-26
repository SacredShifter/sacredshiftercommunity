import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useRegistryOfResonance } from '@/hooks/useRegistryOfResonance';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// Mock the dependencies
vi.mock('@/hooks/useAuth');
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  },
}));

describe('useRegistryOfResonance', () => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    (useAuth as vi.Mock).mockReturnValue({ user: mockUser });
  });

  it('should add a reflection note successfully', async () => {
    const { result } = renderHook(() => useRegistryOfResonance());
    const entryId = 'test-entry-id';
    const content = 'This is a reflection note.';

    // Mock the insert call for reflection_notes
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as vi.Mock).mockImplementation((tableName) => {
      if (tableName === 'reflection_notes') {
        return {
          insert: insertMock,
        };
      }
      return {
        from: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };
    });

    let success;
    await act(async () => {
      success = await result.current.addReflectionNote(entryId, content);
    });

    expect(success).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('reflection_notes');
    expect(insertMock).toHaveBeenCalledWith({
      entry_id: entryId,
      user_id: mockUser.id,
      content: content,
    });
  });

  it('should get reflection notes successfully', async () => {
    const { result } = renderHook(() => useRegistryOfResonance());
    const entryId = 'test-entry-id';
    const mockNotes = [
      { id: 'note-1', entry_id: entryId, user_id: mockUser.id, content: 'Note 1' },
      { id: 'note-2', entry_id: entryId, user_id: mockUser.id, content: 'Note 2' },
    ];

    // Mock the select call for reflection_notes
    const selectMock = vi.fn().mockResolvedValue({ data: mockNotes, error: null });
    (supabase.from as vi.Mock).mockImplementation((tableName) => {
      if (tableName === 'reflection_notes') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnValue({
            then: (callback) => callback({ data: mockNotes, error: null }),
          }),
        };
      }
      return { from: vi.fn().mockReturnThis() }; // Fallback for other tables
    });

    let notes;
    await act(async () => {
      notes = await result.current.getReflectionNotes(entryId);
    });

    expect(notes).toEqual(mockNotes);
    expect(supabase.from).toHaveBeenCalledWith('reflection_notes');
  });

  // TODO: Add more tests for other functions
  // - toggleResonance (checking for resonance_growth_data update)
  // - exportEntryAsSeed
});
