import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedMessagingService } from '@/lib/unifiedMessaging/UnifiedMessagingService';

// Mock the full chain of dependencies to isolate the service
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockRejectedValue(new Error('Database offline')),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
  },
}));

vi.mock('@/lib/sacredMesh', () => ({
  SacredMesh: vi.fn(() => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    send: vi.fn().mockRejectedValue(new Error('Mesh unavailable')),
    onMessage: vi.fn(),
    getStatus: vi.fn().mockResolvedValue({
      initialized: true,
      transports: { webrtc: true },
      queue: { size: 0, oldestAge: 0 }
    }),
    disconnect: vi.fn().mockResolvedValue(undefined),
  })),
  // Ensure other exports from the module are also mocked if needed
  __esModule: true,
  ...vi.importActual('@/lib/sacredMesh/types'), // Keep original types
}));


describe('MSG-002: UnifiedMessagingService Durability Audit', () => {

  beforeEach(() => {
    // Reset mocks and singleton instance before each test
    vi.clearAllMocks();
    // Reset the singleton instance to ensure a clean state for each test
    (UnifiedMessagingService as any).instance = undefined;
  });

  it('should lose all queued messages on application reload (simulated by re-instantiation)', async () => {
    // --- STAGE 1: Simulate offline and queue a message ---

    // GIVEN the application is offline (both DB and Mesh will fail via mocks)
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);

    const messagingService1 = UnifiedMessagingService.getInstance();
    await messagingService1.initialize();

    // WHEN a message is sent while all transports are failing
    // The service will try to send, fail, and add the message to the retry queue.
    await messagingService1.sendMessage('This message should be lost', { type: 'direct', targetId: 'recipient-1' });

    // THEN the message should be in the retryQueue of the first service instance
    const stats1 = messagingService1.getQueueStats();
    expect(stats1.retryQueue).toBe(1);
    expect(stats1.totalPending).toBe(1);

    // --- STAGE 2: Simulate application reload ---

    // GIVEN the application "reloads" (we create a new instance of the service)
    (UnifiedMessagingService as any).instance = undefined; // Force singleton to be recreated

    // WHEN a new messaging service is initialized
    const messagingService2 = UnifiedMessagingService.getInstance();
    await messagingService2.initialize();

    // THEN the queue of the new service instance must be empty, proving data was not persisted
    const stats2 = messagingService2.getQueueStats();
    expect(stats2.messageQueue).toBe(0);
    expect(stats2.retryQueue).toBe(0);
    expect(stats2.totalPending).toBe(0);
  });
});
