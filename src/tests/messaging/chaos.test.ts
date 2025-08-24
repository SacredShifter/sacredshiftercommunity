import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnifiedMessagingService } from '@/lib/unifiedMessaging/UnifiedMessagingService';
import { SacredMesh } from '@/lib/sacredMesh';
import { WebSocketTransport, MultipeerTransport } from '@/lib/sacredMesh/transport';

// Mock the actual transport classes
vi.mock('@/lib/sacredMesh/transport', async () => {
  const actual = await vi.importActual('@/lib/sacredMesh/transport');
  return {
    ...actual,
    WebSocketTransport: vi.fn().mockImplementation(() => ({
      type: 'websocket',
      available: vi.fn().mockResolvedValue(true),
      send: vi.fn().mockResolvedValue(undefined),
      onMessage: vi.fn(),
      disconnect: vi.fn(),
    })),
    MultipeerTransport: vi.fn().mockImplementation(() => ({
      type: 'multipeer',
      available: vi.fn().mockResolvedValue(true),
      send: vi.fn().mockResolvedValue(undefined),
      onMessage: vi.fn(),
      disconnect: vi.fn(),
    })),
    // Mock other transports to be unavailable so we can focus on WS and Multipeer
    WiFiAwareTransport: vi.fn().mockImplementation(() => ({
      type: 'wifi-aware',
      available: vi.fn().mockResolvedValue(false),
      onMessage: vi.fn(),
      disconnect: vi.fn(),
    })),
    MeshtasticTransport: vi.fn().mockImplementation(() => ({
      type: 'meshtastic',
      available: vi.fn().mockResolvedValue(false),
      onMessage: vi.fn(),
      disconnect: vi.fn(),
    })),
  };
});

// Mock Supabase to simulate an offline DB
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

describe('Chaos & Reliability Audit', () => {

  beforeEach(() => {
    // We only need to clear mocks here. Instances will be created inside the test.
    vi.clearAllMocks();
  });

  it('should failover from WebSocket to Mesh and back again when network flaps', async () => {
    // --- SETUP ---
    // Mock user agent to ensure iOS-specific transports are initialized
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('iPhone');

    const sacredMeshInstance = new SacredMesh();
    // Initialize the mesh to trigger the transport constructors
    await sacredMeshInstance.initialize();

    // NOW we can get the instances of the mocked transports
    const webSocketTransportInstance = (WebSocketTransport as any).mock.results[0].value;
    const multipeerTransportInstance = (MultipeerTransport as any).mock.results[0].value;

    // --- STAGE 1: WebSocket is available ---
    vi.mocked(webSocketTransportInstance.available).mockResolvedValue(true);
    vi.mocked(multipeerTransportInstance.available).mockResolvedValue(true); // Both are available

    await sacredMeshInstance.send({ note: 'Message 1' } as any);

    // The router prioritizes the first transport in the list (WebSocket)
    expect(webSocketTransportInstance.send).toHaveBeenCalledTimes(1);
    expect(multipeerTransportInstance.send).toHaveBeenCalledTimes(0);

    // --- STAGE 2: WebSocket flaps (goes offline) ---
    vi.mocked(webSocketTransportInstance.available).mockResolvedValue(false);

    await sacredMeshInstance.send({ note: 'Message 2' } as any);

    // The router should now skip the unavailable WS and use the next transport (Multipeer)
    expect(webSocketTransportInstance.send).toHaveBeenCalledTimes(1); // Not called again
    expect(multipeerTransportInstance.send).toHaveBeenCalledTimes(1);

    // --- STAGE 3: WebSocket recovers ---
    vi.mocked(webSocketTransportInstance.available).mockResolvedValue(true);

    await sacredMeshInstance.send({ note: 'Message 3' } as any);

    // The router should return to using the higher-priority WebSocket transport
    expect(webSocketTransportInstance.send).toHaveBeenCalledTimes(2);
    expect(multipeerTransportInstance.send).toHaveBeenCalledTimes(1); // Not called again
  });
});
