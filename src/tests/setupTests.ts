import 'vitest-webgl-canvas-mock';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver for Radix UI components in vitest
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

(globalThis as any).__SETUP_LOADED__ = true;
