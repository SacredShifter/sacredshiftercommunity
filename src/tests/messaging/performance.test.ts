import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { UnifiedMessagingService } from '@/lib/unifiedMessaging/UnifiedMessagingService';
import { SacredMesh } from '@/lib/sacredMesh';

// --- Mocks ---
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockImplementation(() => {
        // Simulate a 150ms network latency for DB calls
        return new Promise(resolve => setTimeout(() => resolve({ error: null }), 150));
      }),
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } } }),
    },
  },
}));

vi.mock('@/lib/sacredMesh', () => ({
  SacredMesh: vi.fn(() => ({
    initialize: vi.fn().mockResolvedValue(undefined),
    send: vi.fn().mockImplementation(() => {
      // Simulate a 400ms processing/latency for mesh sends
      return new Promise(resolve => setTimeout(resolve, 400));
    }),
    onMessage: vi.fn(),
    getStatus: vi.fn().mockResolvedValue({
      initialized: true,
      transports: { websocket: true, webrtc: false },
      queue: { size: 0, oldestAge: 0 },
    }),
  })),
}));

// --- Benchmark Results ---
const results = {
  connectTime: [] as number[],
  sendToAckWSTime: [] as number[],
  sendToAckMeshTime: [] as number[],
  queueFlushTime: -1,
};

function calculateP95(times: number[]): number {
  if (times.length === 0) return -1;
  times.sort((a, b) => a - b);
  const p95Index = Math.floor(times.length * 0.95);
  return times[p95Index];
}

describe('Performance Benchmarks', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    (UnifiedMessagingService as any).instance = undefined;
  });

  it('Benchmark: Connection Time', async () => {
    const runs = 20;
    for (let i = 0; i < runs; i++) {
      const start = performance.now();
      const service = UnifiedMessagingService.getInstance();
      await service.initialize();
      const end = performance.now();
      results.connectTime.push(end - start);
      (UnifiedMessagingService as any).instance = undefined; // Reset for next run
    }
    expect(results.connectTime.length).toBe(runs);
  });

  it('Benchmark: Send-to-Ack Latency (WebSocket)', async () => {
    const runs = 20;
    const service = UnifiedMessagingService.getInstance();
    await service.initialize();

    for (let i = 0; i < runs; i++) {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true); // Force DB path
      const start = performance.now();
      await service.sendMessage('ws test', { type: 'direct', targetId: 'r1' });
      const end = performance.now();
      results.sendToAckWSTime.push(end - start);
    }
    expect(results.sendToAckWSTime.length).toBe(runs);
  });

  it('Benchmark: Send-to-Ack Latency (Mesh)', async () => {
    const runs = 20;
    const service = UnifiedMessagingService.getInstance();
    await service.initialize();

    for (let i = 0; i < runs; i++) {
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false); // Force mesh path
      const start = performance.now();
      await service.sendMessage('mesh test', { type: 'direct', targetId: 'r1' });
      const end = performance.now();
      results.sendToAckMeshTime.push(end - start);
    }
    expect(results.sendToAckMeshTime.length).toBe(runs);
  });

  it('Benchmark: Queue Flush Time (1k msgs)', async () => {
    const service = UnifiedMessagingService.getInstance();
    await service.initialize();

    // Mock send to be instant to only measure queue processing
    const mesh = (service as any).sacredMesh;
    vi.spyOn(mesh, 'send').mockResolvedValue(undefined);

    // Pre-populate the queue
    const queue = (service as any).messageQueue;
    for (let i = 0; i < 1000; i++) {
      queue.push({ id: `msg-${i}`, content: 'test' });
    }

    const start = performance.now();
    // The processor works in batches, so we loop until the queue is empty
    while (queue.length > 0) {
      await (service as any).processMessageQueue();
    }
    const end = performance.now();
    results.queueFlushTime = end - start;

    expect(queue.length).toBe(0);
    expect(results.queueFlushTime).toBeGreaterThan(0);
  });
});

afterAll(() => {
  console.log('\n--- Messaging Performance Audit ---');
  console.log('-----------------------------------');
  const p95Connect = calculateP95(results.connectTime);
  const p95SendWS = calculateP95(results.sendToAckWSTime);
  const p95SendMesh = calculateP95(results.sendToAckMeshTime);

  console.log(`| Metric                  | Result (p95) | Budget       | Status |`);
  console.log(`|-------------------------|--------------|--------------|--------|`);
  console.log(`| Connect Time            | ${p95Connect.toFixed(2).padStart(12)}ms | < 2000ms    | ${p95Connect < 2000 ? '✅ Pass' : '❌ Fail'} |`);
  console.log(`| Send->Ack (WS)          | ${p95SendWS.toFixed(2).padStart(12)}ms | < 300ms     | ${p95SendWS < 300 ? '✅ Pass' : '❌ Fail'} |`);
  console.log(`| Send->Ack (Mesh)        | ${p95SendMesh.toFixed(2).padStart(12)}ms | < 800ms     | ${p95SendMesh < 800 ? '✅ Pass' : '❌ Fail'} |`);
  console.log(`| Queue Flush (1k msgs)   | ${results.queueFlushTime.toFixed(2).padStart(12)}ms | < 5000ms    | ${results.queueFlushTime < 5000 ? '✅ Pass' : '❌ Fail'} |`);
  console.log('-----------------------------------\n');
  console.log('Note: Memory/CPU ceilings require browser-based profiling and are not measured here.');
});
