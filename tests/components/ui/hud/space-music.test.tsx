import { SpaceMusic } from '@/components/ui/hud/space-music';
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockGain = {
  connect: vi.fn(),
  gain: {
    value: 0,
    cancelScheduledValues: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
  },
};

const mockSource = {
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  disconnect: vi.fn(),
  buffer: null,
  loop: false,
};

const mockAudioContextMembers = {
  createGain: vi.fn(() => mockGain),
  createBufferSource: vi.fn(() => mockSource),
  decodeAudioData: vi.fn().mockResolvedValue({}),
  resume: vi.fn().mockResolvedValue(undefined),
  suspend: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  destination: {},
  currentTime: 0,
  state: 'suspended',
};

class MockAudioContext {
  get state() {
    return mockAudioContextMembers.state;
  }
  set state(value: string) {
    mockAudioContextMembers.state = value;
  }
  constructor() {
    Object.assign(this, mockAudioContextMembers);
  }
}

let mockStoreState = {
  experienceSettings: { musicEnabled: true, musicVolume: 0.5 },
};

vi.mock('@/store/space-store', () => ({
  useSpaceStore: Object.assign((selector: any) => selector(mockStoreState), {
    getState: () => mockStoreState,
  }),
}));

vi.mock('zustand/react/shallow', () => ({
  useShallow: (fn: any) => fn,
}));

describe('SpaceMusic', () => {
  beforeEach(() => {
    mockStoreState = { experienceSettings: { musicEnabled: true, musicVolume: 0.5 } };
    vi.stubGlobal('AudioContext', MockAudioContext);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      })
    );
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockAudioContextMembers.state = 'suspended';
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('starts playback when enabled', async () => {
    await act(async () => {
      render(<SpaceMusic />);
    });

    expect(global.fetch).toHaveBeenCalled();
    expect(mockSource.start).toHaveBeenCalled();
    expect(mockAudioContextMembers.resume).toHaveBeenCalled();
  });

  it('handles volume changes', async () => {
    const { rerender } = render(<SpaceMusic />);
    await act(async () => {});

    mockStoreState.experienceSettings.musicVolume = 0.8;
    await act(async () => {
      rerender(<SpaceMusic />);
    });
    expect(mockGain.gain.setTargetAtTime).toHaveBeenCalledWith(0.8, expect.any(Number), 0.2);
  });

  it('stops playback when disabled', async () => {
    const { rerender } = render(<SpaceMusic />);
    await act(async () => {});

    mockStoreState.experienceSettings.musicEnabled = false;
    await act(async () => {
      rerender(<SpaceMusic />);
    });

    expect(mockGain.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.any(Number));

    act(() => {
      vi.runAllTimers();
    });
    expect(mockSource.stop).toHaveBeenCalled();
  });

  it('handles fetch errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

    await act(async () => {
      render(<SpaceMusic />);
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('closes context on unmount', async () => {
    const { unmount } = render(<SpaceMusic />);
    await act(async () => {});

    await act(async () => {
      unmount();
    });
    expect(mockAudioContextMembers.close).toHaveBeenCalled();
  });

  it('does not resume context when already running', async () => {
    mockAudioContextMembers.state = 'running';
    await act(async () => {
      render(<SpaceMusic />);
    });
    expect(mockAudioContextMembers.resume).not.toHaveBeenCalled();
  });

  it('reuses graph on rerender while enabled', async () => {
    const { rerender } = render(<SpaceMusic />);
    await act(async () => {});
    await act(async () => {
      rerender(<SpaceMusic />);
    });
    expect(mockAudioContextMembers.createGain).toHaveBeenCalledTimes(1);
  });

  it('does nothing when disabled before a graph exists', () => {
    mockStoreState = { experienceSettings: { musicEnabled: false, musicVolume: 0.5 } };

    render(<SpaceMusic />);

    expect(mockAudioContextMembers.createGain).not.toHaveBeenCalled();
  });

  it('does not start a second source when re-enabled before stop timeout', async () => {
    const { rerender } = render(<SpaceMusic />);
    await act(async () => {});

    mockStoreState.experienceSettings.musicEnabled = false;
    await act(async () => {
      rerender(<SpaceMusic />);
    });

    mockStoreState.experienceSettings.musicEnabled = true;
    await act(async () => {
      rerender(<SpaceMusic />);
    });

    expect(mockAudioContextMembers.createBufferSource).toHaveBeenCalledTimes(1);
  });

  it('keeps the source alive when music is re-enabled before the delayed stop', async () => {
    const { rerender } = render(<SpaceMusic />);
    await act(async () => {});

    mockStoreState.experienceSettings.musicEnabled = false;
    await act(async () => {
      rerender(<SpaceMusic />);
    });
    mockStoreState.experienceSettings.musicEnabled = true;

    act(() => {
      vi.runAllTimers();
    });

    expect(mockSource.stop).not.toHaveBeenCalled();
  });

  it('handles fetch abort/timeout error', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = vi.fn().mockImplementation((_url, options) => {
      return new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => {
          reject(new DOMException('The user aborted a request.', 'AbortError'));
        });
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    await act(async () => {
      render(<SpaceMusic />);
    });

    await act(async () => {
      vi.advanceTimersByTime(15000);
    });

    expect(consoleSpy).toHaveBeenCalledWith('SpaceMusic: audio fetch timed out');
    consoleSpy.mockRestore();
  });

  it('suspends audio context when document is hidden and resumes when visible', async () => {
    let hidden = false;
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);

    mockStoreState.experienceSettings.musicEnabled = false;
    const { rerender } = render(<SpaceMusic />);
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(mockAudioContextMembers.suspend).not.toHaveBeenCalled();

    mockStoreState.experienceSettings.musicEnabled = true;
    await act(async () => {
      rerender(<SpaceMusic />);
    });

    mockAudioContextMembers.state = 'running';
    hidden = true;
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(mockAudioContextMembers.suspend).toHaveBeenCalledTimes(1);

    mockAudioContextMembers.state = 'suspended';
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(mockAudioContextMembers.suspend).toHaveBeenCalledTimes(1);

    mockAudioContextMembers.state = 'suspended';
    hidden = false;
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(mockAudioContextMembers.resume).toHaveBeenCalled();

    mockAudioContextMembers.state = 'running';
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    mockStoreState.experienceSettings.musicEnabled = false;
    mockAudioContextMembers.state = 'suspended';
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
  });
});
