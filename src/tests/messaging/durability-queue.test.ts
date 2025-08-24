import 'fake-indexeddb/auto'; // MUST be the first import
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UnifiedMessagingService } from '@/lib/unifiedMessaging/UnifiedMessagingService';
import { DurableStore } from '@/lib/durableStore';
import type { UnifiedMessage } from '@/lib/unifiedMessaging/types';

// Mock the Supabase client to control its behavior in tests
const supabaseInsertMock = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: supabaseInsertMock,
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
  },
}));

// Mock SacredMesh to isolate the UnifiedMessagingService
vi.mock('@/lib/sacredMesh', () => {
  const mockInstance = {
    initialize: vi.fn().mockResolvedValue(undefined),
    getStatus: vi.fn().mockResolvedValue({
      initialized: true,
      transports: { http: true, webrtc: false },
      queue: { size: 0 },
    }),
    onMessage: vi.fn(),
    send: vi.fn().mockResolvedValue(undefined),
    disconnect: vi.fn().mockResolvedValue(undefined),
  };
  return {
    SacredMesh: {
      getInstance: vi.fn(() => mockInstance),
    },
  };
});

describe('MSG-002: Queue Durability Fix Verification', () => {
  const retryQueue = new DurableStore<UnifiedMessage>('retry-queue');

  beforeEach(async () => {
    // Reset mocks and clear stores before each test
    vi.clearAllMocks();
    await retryQueue.clear();

    // Invalidate the singleton instance to ensure a fresh start
    (UnifiedMessagingService as any).instance = undefined;

    // Stop any running intervals from previous tests
    const serviceInstance = UnifiedMessagingService.getInstance();
    await serviceInstance.disconnect();
    (UnifiedMessagingService as any).instance = undefined;
  });

  afterEach(async () => {
    // Ensure any created services are disconnected
    const serviceInstance = UnifiedMessagingService.getInstance();
    await serviceInstance.disconnect();
  });

  it('should persist messages to retry-queue on network failure and send them on recovery', async () => {
    // --- STAGE 1: Simulate network failure and queue a message ---
    supabaseInsertMock.mockRejectedValue(new TypeError('Network failure'));

    const service1 = UnifiedMessagingService.getInstance({ meshAsFallback: false });
    await service1.initialize();

    await service1.sendMessage('This message should be persisted', { type: 'direct', targetId: 'r1' });

    // Manually trigger a single processing pass instead of relying on timers
    await (service1 as any).__test__flushOnce();

    // VERIFY STAGE 1: Message should be in the persistent retry queue
    const retryQueueContent = await retryQueue.getAll();
    expect(retryQueueContent).toHaveLength(1);
    const persistedMessage = retryQueueContent[0];
    expect(persistedMessage.content).toBe('This message should be persisted');
    expect(persistedMessage.retryCount).toBe(0);

    // --- STAGE 2: Simulate application reload and network recovery ---
    (UnifiedMessagingService as any).instance = undefined;
    supabaseInsertMock.mockResolvedValue({ error: null });

    const service2 = UnifiedMessagingService.getInstance({ meshAsFallback: false });
    await service2.initialize();

    // To make the test deterministic, manually advance the message's due time
    const items = await retryQueue.getAll();
    for (const m of items) {
      m.nextRetryAtMs = Date.now() - 1;
      await retryQueue.set(m.id, m);
    }

    // Manually trigger another processing pass
    await (service2 as any).__test__flushOnce();

    // VERIFY STAGE 2: The message should be sent and the queue cleared
    const finalRetryQueue = await retryQueue.getAll();
    expect(finalRetryQueue).toHaveLength(0);
    expect(supabaseInsertMock).toHaveBeenCalledTimes(2); // Once for the fail, once for the success
  });
});
