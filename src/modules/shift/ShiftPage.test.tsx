import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// IMPORTANT: mock BEFORE importing the page
vi.mock('./scene/ShiftCanvas', () => ({
  default: () => <div data-testid="shift-canvas-stub" />,
}));

import ShiftPage from './ShiftPage';

describe('ShiftPage', () => {
  it('renders route shell and canvas stub', () => {
    render(<ShiftPage />);
    expect(screen.getByText('Play/Pause')).toBeInTheDocument();
    expect(screen.getByTestId('shift-canvas-stub')).toBeInTheDocument();
  });
});
