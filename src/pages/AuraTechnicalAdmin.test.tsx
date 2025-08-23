import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import AuraTechnicalAdmin from './AuraTechnicalAdmin';

// Mock the global fetch function
global.fetch = vi.fn();

function createFetchResponse(data: any, ok: boolean = true) {
  return { json: () => new Promise((resolve) => resolve(data)), ok };
}

describe('AuraTechnicalAdmin', () => {
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    consoleErrorSpy.mockReset();
  })

  it('renders the main heading and fetches tasks', async () => {
    const mockTasks = [
      { name: 'bootstrap_infra', description: 'Provisions the initial infrastructure.' },
    ];
    (fetch as vi.Mock).mockResolvedValue(createFetchResponse(mockTasks));

    render(<AuraTechnicalAdmin />);

    const heading = screen.getByRole('heading', {
      name: /Aura Core - Technical Admin Console/i,
    });
    expect(heading).toBeInTheDocument();

    // Wait for the tasks to be rendered
    await waitFor(() => {
      expect(screen.getByText('bootstrap_infra')).toBeInTheDocument();
    });
  });

  it('shows an error if tasks fail to load', async () => {
    (fetch as vi.Mock).mockRejectedValue(new Error('API is down'));

    render(<AuraTechnicalAdmin />);

    await waitFor(() => {
        expect(screen.getByText(/Error: Failed to fetch tasks/i)).toBeInTheDocument();
    });

    // Expect console.error to have been called by the component
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
