import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const invalidate = vi.fn();
const setExperienceSetting = vi.fn();
let frameCallback: ((state: { clock: { getElapsedTime: () => number } }) => void) | undefined;
let hidden = false;
let mockState: any;

vi.mock('@react-three/fiber', () => ({
  useThree: (selector: (state: { invalidate: () => void }) => unknown) => selector({ invalidate }),
  useFrame: (callback: typeof frameCallback) => {
    frameCallback = callback;
  },
}));

vi.mock('zustand/react/shallow', () => ({ useShallow: (selector: unknown) => selector }));

vi.mock('@/store/space-store', () => {
  const useSpaceStore = Object.assign((selector: (state: any) => unknown) => selector(mockState), {
    getState: () => ({
      experienceSettings: mockState.experienceSettings,
      setExperienceSetting,
    }),
  });
  return { useSpaceStore };
});

import { FrameScheduler } from '@/components/three/scene/frame-scheduler';

const animatedSettings = {
  asteroidDensity: 0.6,
  autoRotate: true,
  dpr: 1.3,
  nebula: true,
  planetRotation: true,
  shadows: false,
  shootingStars: true,
  starDensity: 0.6,
};

describe('FrameScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    hidden = false;
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
    mockState = {
      activePanel: null,
      activePlanet: null,
      helpOpen: false,
      settingsOpen: false,
      warpActive: false,
      experienceSettings: { ...animatedSettings },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('schedules idle frames and pauses while the document is hidden', () => {
    const { unmount } = render(<FrameScheduler />);
    expect(invalidate).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(100));
    expect(invalidate.mock.calls.length).toBeGreaterThan(1);

    act(() => document.dispatchEvent(new Event('visibilitychange')));

    hidden = true;
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    const callsWhileHidden = invalidate.mock.calls.length;
    act(() => vi.advanceTimersByTime(100));
    expect(invalidate).toHaveBeenCalledTimes(callsWhileHidden);

    hidden = false;
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => vi.advanceTimersByTime(40));
    expect(invalidate.mock.calls.length).toBeGreaterThan(callsWhileHidden);
    unmount();
  });

  it('uses transition cadence and stops when the scene is obscured or static', () => {
    mockState.activePlanet = 'projects';
    const { rerender } = render(<FrameScheduler />);
    act(() => vi.advanceTimersByTime(20));
    expect(invalidate.mock.calls.length).toBeGreaterThan(1);

    mockState.activePanel = 'projects';
    rerender(<FrameScheduler />);
    const obscuredCalls = invalidate.mock.calls.length;
    act(() => vi.advanceTimersByTime(100));
    expect(invalidate).toHaveBeenCalledTimes(obscuredCalls + 1);

    mockState.activePanel = null;
    mockState.activePlanet = null;
    mockState.experienceSettings = {
      ...animatedSettings,
      asteroidDensity: 0,
      autoRotate: false,
      nebula: false,
      planetRotation: false,
      shootingStars: false,
    };
    rerender(<FrameScheduler />);
    const staticCalls = invalidate.mock.calls.length;
    act(() => vi.advanceTimersByTime(100));
    expect(invalidate).toHaveBeenCalledTimes(staticCalls);
  });

  it('degrades expensive settings after sustained low frame rate', () => {
    render(<FrameScheduler />);

    frameCallback?.({ clock: { getElapsedTime: () => 1 } });
    frameCallback?.({ clock: { getElapsedTime: () => 6 } });

    expect(setExperienceSetting).toHaveBeenCalledWith('dpr', 1);
    expect(setExperienceSetting).toHaveBeenCalledWith('shadows', false);
    expect(setExperienceSetting).toHaveBeenCalledWith('starDensity', 0.3);
    expect(setExperienceSetting).toHaveBeenCalledWith('asteroidDensity', 0.3);

    const calls = setExperienceSetting.mock.calls.length;
    frameCallback?.({ clock: { getElapsedTime: () => 12 } });
    expect(setExperienceSetting).toHaveBeenCalledTimes(calls);
  });

  it('keeps quality when the measured frame rate is healthy', () => {
    render(<FrameScheduler />);

    for (let index = 0; index <= 120; index += 1) {
      const elapsed = 1 + index / 30;
      frameCallback?.({ clock: { getElapsedTime: () => elapsed } });
    }

    expect(setExperienceSetting).not.toHaveBeenCalled();
  });
});
