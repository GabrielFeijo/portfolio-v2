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

const mockMediaSource = { connect: vi.fn() };

const mockElement = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  load: vi.fn(),
  removeAttribute: vi.fn(),
  preload: '',
  loop: false,
  src: '',
};

const mockAudioContextMembers = {
  createGain: vi.fn(() => mockGain),
  createMediaElementSource: vi.fn(() => mockMediaSource),
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
      'Audio',
      vi.fn(function () {
        return mockElement;
      })
    );
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockElement.play.mockResolvedValue(undefined);
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

    expect(mockElement.preload).toBe('none');
    expect(mockElement.loop).toBe(true);
    expect(mockElement.src).toBe('/audio/space-music.mp3');
    expect(mockMediaSource.connect).toHaveBeenCalledWith(mockGain);
    expect(mockElement.play).toHaveBeenCalled();
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
    expect(mockElement.pause).toHaveBeenCalled();
  });

  it('handles playback errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockElement.play.mockRejectedValueOnce(new Error('blocked'));

    await act(async () => {
      render(<SpaceMusic />);
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('handles audio initialization errors before a graph is created', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'AudioContext',
      vi.fn(() => {
        throw new Error('unsupported');
      })
    );

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

    expect(mockElement.play).toHaveBeenCalledTimes(1);
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

    expect(mockElement.pause).not.toHaveBeenCalled();
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

  it('clears pending stop timer on unmount', async () => {
    const { rerender, unmount } = render(<SpaceMusic />);
    await act(async () => {});

    mockStoreState.experienceSettings.musicEnabled = false;
    await act(async () => {
      rerender(<SpaceMusic />);
    });

    await act(async () => {
      unmount();
    });
    expect(mockElement.pause).toHaveBeenCalled();
  });
});
