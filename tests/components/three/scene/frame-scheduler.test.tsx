import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const invalidate = vi.fn();
const setExperienceSetting = vi.fn();
let frameCallback: ((state: { clock: { getElapsedTime: () => number } }) => void) | undefined;
let hidden = false;
let mobileMatches = false;
let mediaChangeListeners: Array<() => void> = [];
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

import {
  FrameScheduler,
  resetPerformanceDegradation,
} from '@/components/three/scene/frame-scheduler';

const animatedSettings = {
  antialias: true,
  asteroidDensity: 0.6,
  autoRotate: true,
  dpr: 1.3,
  liteEffects: false,
  nebula: true,
  orbitalParticles: true,
  planetRotation: true,
  shadows: false,
  shootingStars: true,
  starDensity: 0.6,
  warpEffects: true,
};

describe('FrameScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    resetPerformanceDegradation();
    hidden = false;
    mobileMatches = false;
    mediaChangeListeners = [];
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        get matches() {
          return query.includes('max-width: 639px') ? mobileMatches : false;
        },
        media: query,
        addEventListener: vi.fn((event: string, cb: () => void) => {
          if (event === 'change') mediaChangeListeners.push(cb);
        }),
        removeEventListener: vi.fn(),
      })),
    });
    mockState = {
      activePanel: null,
      activePlanet: null,
      helpOpen: false,
      isLoaded: true,
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

  it('uses transition cadence and stops when loading, obscured by modals, full-screen panel, or static', () => {
    mockState.isLoaded = false;
    const { rerender } = render(<FrameScheduler />);
    const loadingCalls = invalidate.mock.calls.length;
    act(() => vi.advanceTimersByTime(150));
    expect(invalidate).toHaveBeenCalledTimes(loadingCalls);

    mockState.isLoaded = true;
    mockState.activePlanet = 'projects';
    rerender(<FrameScheduler />);
    act(() => vi.advanceTimersByTime(20));
    expect(invalidate.mock.calls.length).toBeGreaterThan(loadingCalls);

    mockState.activePanel = 'projects';
    rerender(<FrameScheduler />);
    const obscuredCalls = invalidate.mock.calls.length;
    act(() => vi.advanceTimersByTime(100));
    expect(invalidate).toHaveBeenCalledTimes(obscuredCalls + 1);

    mockState.helpOpen = true;
    rerender(<FrameScheduler />);
    const helpCalls = invalidate.mock.calls.length;
    act(() => vi.advanceTimersByTime(150));
    expect(invalidate).toHaveBeenCalledTimes(helpCalls);

    mockState.helpOpen = false;
    mobileMatches = true;
    act(() => {
      mediaChangeListeners.forEach((cb) => cb());
    });
    mockState.activePanel = 'about';
    rerender(<FrameScheduler />);
    const mobilePanelCalls = invalidate.mock.calls.length;
    act(() => vi.advanceTimersByTime(150));
    expect(invalidate).toHaveBeenCalledTimes(mobilePanelCalls);

    mobileMatches = false;
    act(() => {
      mediaChangeListeners.forEach((cb) => cb());
    });
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

  it('degrades progressively across levels and caps at level 3', () => {
    render(<FrameScheduler />);

    act(() => {
      frameCallback?.({ clock: { getElapsedTime: () => 1 } });
      frameCallback?.({ clock: { getElapsedTime: () => 6 } });
    });

    expect(setExperienceSetting).toHaveBeenCalledWith('dpr', 1);
    expect(setExperienceSetting).toHaveBeenCalledWith('shadows', false);
    expect(setExperienceSetting).toHaveBeenCalledWith('liteEffects', true);
    expect(setExperienceSetting).toHaveBeenCalledWith('starDensity', 0.3);
    expect(setExperienceSetting).toHaveBeenCalledWith('asteroidDensity', 0.3);

    act(() => {
      frameCallback?.({ clock: { getElapsedTime: () => 11 } });
      frameCallback?.({ clock: { getElapsedTime: () => 16 } });
    });

    expect(setExperienceSetting).toHaveBeenCalledWith('nebula', false);
    expect(setExperienceSetting).toHaveBeenCalledWith('shootingStars', false);
    expect(setExperienceSetting).toHaveBeenCalledWith('orbitalParticles', false);
    expect(setExperienceSetting).toHaveBeenCalledWith('warpEffects', false);
    expect(setExperienceSetting).toHaveBeenCalledWith('antialias', false);
    expect(setExperienceSetting).toHaveBeenCalledWith('asteroidDensity', 0.15);

    const callsBeforeLevel3 = setExperienceSetting.mock.calls.length;
    act(() => {
      frameCallback?.({ clock: { getElapsedTime: () => 21 } });
      frameCallback?.({ clock: { getElapsedTime: () => 26 } });
    });
    expect(setExperienceSetting).toHaveBeenCalledTimes(callsBeforeLevel3);

    act(() => {
      frameCallback?.({ clock: { getElapsedTime: () => 31 } });
      frameCallback?.({ clock: { getElapsedTime: () => 36 } });
    });
    expect(setExperienceSetting).toHaveBeenCalledTimes(callsBeforeLevel3);
  });

  it('skips level 1 when already running lite settings at 1x DPR without shadows', () => {
    mockState.experienceSettings = {
      ...animatedSettings,
      dpr: 1,
      liteEffects: true,
      shadows: false,
    };

    render(<FrameScheduler />);

    act(() => {
      frameCallback?.({ clock: { getElapsedTime: () => 1 } });
      frameCallback?.({ clock: { getElapsedTime: () => 6 } });
    });

    expect(setExperienceSetting).toHaveBeenCalledWith('nebula', false);
    expect(setExperienceSetting).toHaveBeenCalledWith('antialias', false);
  });

  it('keeps quality when the measured frame rate is healthy', () => {
    render(<FrameScheduler />);

    for (let index = 0; index <= 120; index += 1) {
      const elapsed = 1 + index / 30;
      frameCallback?.({ clock: { getElapsedTime: () => elapsed } });
    }

    expect(setExperienceSetting).not.toHaveBeenCalled();
  });

  it('invalidates on settings change and handles lite FPS + missing matchMedia', () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });

    mockState.experienceSettings = { ...animatedSettings, liteEffects: true };
    const { rerender, unmount } = render(<FrameScheduler />);
    const initialCalls = invalidate.mock.calls.length;

    mockState.experienceSettings = { ...animatedSettings, liteEffects: true, starDensity: 0.4 };
    rerender(<FrameScheduler />);
    expect(invalidate).toHaveBeenCalledTimes(initialCalls + 1);

    act(() => {
      frameCallback?.({ clock: { getElapsedTime: () => 1 } });
      frameCallback?.({ clock: { getElapsedTime: () => 6 } });
      frameCallback?.({ clock: { getElapsedTime: () => 11 } });
      frameCallback?.({ clock: { getElapsedTime: () => 16 } });
      frameCallback?.({ clock: { getElapsedTime: () => 21 } });
      frameCallback?.({ clock: { getElapsedTime: () => 26 } });
    });

    unmount();
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: originalMatchMedia });
  });
});
