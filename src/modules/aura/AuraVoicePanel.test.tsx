import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import AuraVoicePanel from './AuraVoicePanel';

// Mock MediaRecorder
const mockMediaRecorder = {
  start: vi.fn(() => {
    // @ts-ignore
    mockMediaRecorder.state = 'recording';
  }),
  stop: vi.fn(() => {
    // @ts-ignore
    mockMediaRecorder.state = 'inactive';
  }),
  ondataavailable: vi.fn(),
  onstop: vi.fn(),
  state: 'inactive',
};

// Mock getUserMedia
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: vi.fn().mockReturnValue([{ stop: vi.fn() }]),
    }),
  },
  writable: true,
});

// Mock MediaRecorder constructor
global.MediaRecorder = vi.fn().mockImplementation(() => mockMediaRecorder);

// Mock fetch
global.fetch = vi.fn();

// Mock Audio
const mockAudio = {
  play: vi.fn(),
};
global.Audio = vi.fn().mockImplementation(() => mockAudio);
global.URL.createObjectURL = vi.fn();

describe('AuraVoicePanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: 'Hello world' }),
      blob: () => Promise.resolve(new Blob(['audio data'])),
    });
  });

  it('renders the initial state correctly', () => {
    render(<AuraVoicePanel />);
    expect(screen.getByText('Aura Voice')).toBeInTheDocument();
    expect(screen.getByText('Press the button and start speaking...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
  });

  it('starts and stops recording when the button is clicked', async () => {
    render(<AuraVoicePanel />);
    const recordButton = screen.getByRole('button', { name: /start recording/i });

    // Start recording
    await userEvent.click(recordButton);
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(mockMediaRecorder.start).toHaveBeenCalled();

    const stopButton = await screen.findByRole('button', { name: /stop recording/i });
    expect(stopButton).toBeInTheDocument();

    // Stop recording
    await userEvent.click(stopButton);
    expect(mockMediaRecorder.stop).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /start recording/i })).toBeInTheDocument();
  });

  it('sends audio to STT API and displays transcript on stop', async () => {
    render(<AuraVoicePanel />);
    const recordButton = screen.getByRole('button', { name: /start recording/i });

    // Start recording
    await userEvent.click(recordButton);

    // Simulate some audio data
    const blob = new Blob(['chunk1'], { type: 'audio/webm' });
    mockMediaRecorder.ondataavailable({ data: blob });

    // Stop recording
    await userEvent.click(screen.getByRole('button', { name: /stop recording/i }));
    mockMediaRecorder.onstop();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/voice/stt', expect.any(Object));
    });

    await waitFor(() => {
        expect(screen.getByText('Hello world')).toBeInTheDocument();
    });
  });

  it('plays TTS audio after receiving transcript', async () => {
    render(<AuraVoicePanel />);
    const recordButton = screen.getByRole('button', { name: /start recording/i });

    await userEvent.click(recordButton);
    const blob = new Blob(['chunk1'], { type: 'audio/webm' });
    mockMediaRecorder.ondataavailable({ data: blob });
    await userEvent.click(screen.getByRole('button', { name: /stop recording/i }));
    mockMediaRecorder.onstop();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/voice/tts', expect.any(Object));
      expect(mockAudio.play).toHaveBeenCalled();
    });
  });
});
