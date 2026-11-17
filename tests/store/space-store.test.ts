import {
  DEFAULT_EXPERIENCE_SETTINGS,
  getRecommendedExperiencePreset,
  MAX_EXPERIENCE_SETTINGS,
  useSpaceStore,
} from '@/store/space-store';
import * as gpuTier from '@/utils/gpu-tier';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('space-store', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState(null, '', '/');
    useSpaceStore.setState({
      activePlanet: null,
      activePanel: null,
      helpOpen: false,
      settingsOpen: false,
      graphicsMode: 'webgl',
      cursorVariant: 'default',
      isLoaded: false,
      warpActive: false,
      experienceSettings: MAX_EXPERIENCE_SETTINGS,
      language: 'pt',
    });
  });

  it('navigates between panels', () => {
    useSpaceStore.getState().setActivePlanet('skills');
    expect(useSpaceStore.getState().activePlanet).toBe('skills');

    useSpaceStore.getState().openPanel('skills');
    expect(useSpaceStore.getState().activePanel).toBe('skills');

    useSpaceStore.getState().navigateToPanel('about');
    expect(useSpaceStore.getState().activePanel).toBe('about');
    expect(useSpaceStore.getState().activePlanet).toBe('about');
    expect(window.location.hash).toBe('#about');

    useSpaceStore.getState().closePanel();
    expect(useSpaceStore.getState().activePanel).toBeNull();
    expect(useSpaceStore.getState().activePlanet).toBeNull();
    expect(window.location.hash).toBe('');
  });

  it('updates UI state', () => {
    useSpaceStore.getState().setGraphicsMode('2d');
    useSpaceStore.getState().setCursorVariant('planet');
    useSpaceStore.getState().setIsLoaded(true);
    useSpaceStore.getState().setWarpActive(true);
    useSpaceStore.getState().setLanguage('en');

    const state = useSpaceStore.getState();
    expect(state.graphicsMode).toBe('2d');
    expect(state.cursorVariant).toBe('planet');
    expect(state.isLoaded).toBe(true);
    expect(state.warpActive).toBe(true);
    expect(state.language).toBe('en');
  });

  it('prevents the custom cursor in 2D compatibility mode', () => {
    useSpaceStore.getState().setGraphicsMode('2d');
    useSpaceStore.getState().setExperienceSetting('customCursor', true);
    expect(useSpaceStore.getState().experienceSettings.customCursor).toBe(false);

    useSpaceStore.getState().applyExperiencePreset('cinematic');
    expect(useSpaceStore.getState().experienceSettings.customCursor).toBe(false);

    useSpaceStore.getState().resetExperienceSettings();
    expect(useSpaceStore.getState().experienceSettings.customCursor).toBe(false);
  });

  it('opens and closes overlays', () => {
    useSpaceStore.getState().openHelp();
    expect(useSpaceStore.getState().helpOpen).toBe(true);
    expect(useSpaceStore.getState().activePanel).toBeNull();

    useSpaceStore.getState().closeHelp();
    expect(useSpaceStore.getState().helpOpen).toBe(false);

    useSpaceStore.getState().openSettings();
    expect(useSpaceStore.getState().settingsOpen).toBe(true);
    useSpaceStore.getState().closeSettings();
    expect(useSpaceStore.getState().settingsOpen).toBe(false);
  });

  it('applies and resets experience presets', () => {
    useSpaceStore.getState().applyExperiencePreset('performance');
    expect(useSpaceStore.getState().experienceSettings.antialias).toBe(false);
    const persisted = JSON.parse(
      window.localStorage.getItem('space-portfolio:experience:v1') ?? '{}'
    );
    expect(persisted.state.experienceSettings.antialias).toBe(false);
    expect(persisted.version).toBe(1);

    useSpaceStore.getState().setExperienceSetting('musicEnabled', true);
    expect(useSpaceStore.getState().experienceSettings.musicEnabled).toBe(true);

    useSpaceStore.getState().resetExperienceSettings();
    expect(useSpaceStore.getState().experienceSettings).toEqual(DEFAULT_EXPERIENCE_SETTINGS);
  });

  it('migrates legacy experience settings through Zustand persist', async () => {
    window.localStorage.setItem(
      'space-portfolio:experience:v1',
      JSON.stringify({ ...DEFAULT_EXPERIENCE_SETTINGS, customCursor: true, musicVolume: 0.72 })
    );

    await useSpaceStore.persist.rehydrate();

    expect(useSpaceStore.getState().experienceSettings.customCursor).toBe(true);
    expect(useSpaceStore.getState().experienceSettings.musicVolume).toBe(0.72);
    const migrated = JSON.parse(
      window.localStorage.getItem('space-portfolio:experience:v1') ?? '{}'
    );
    expect(migrated.version).toBe(1);
    expect(migrated.state.experienceSettings.musicVolume).toBe(0.72);
  });

  it('recommends minimal quality when reduced motion is requested', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as unknown as MediaQueryList
    );

    expect(getRecommendedExperiencePreset()).toBe('minimal');
    matchMedia.mockRestore();
  });

  it('recommends quality presets for server, device, and media-query capabilities', () => {
    const originalWindow = window;
    vi.stubGlobal('window', undefined);
    expect(getRecommendedExperiencePreset()).toBe('balanced');
    vi.stubGlobal('window', originalWindow);

    const matchMedia = vi.spyOn(window, 'matchMedia');
    const hardwareConcurrency = vi.spyOn(navigator, 'hardwareConcurrency', 'get');
    const originalDeviceMemory = Object.getOwnPropertyDescriptor(navigator, 'deviceMemory');
    const setCapabilities = (coarse: boolean, cores: number, memory?: number) => {
      matchMedia.mockImplementation(
        (query) =>
          ({
            matches: query.includes('pointer: coarse') && coarse,
            media: query,
          }) as MediaQueryList
      );
      hardwareConcurrency.mockReturnValue(cores);
      Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: memory });
    };

    setCapabilities(true, 8, 8);
    expect(getRecommendedExperiencePreset()).toBe('performance');
    setCapabilities(false, 2, 8);
    expect(getRecommendedExperiencePreset()).toBe('performance');
    setCapabilities(false, 8, 2);
    expect(getRecommendedExperiencePreset()).toBe('performance');
    setCapabilities(false, 8, 8);
    expect(getRecommendedExperiencePreset()).toBe('balanced');
    setCapabilities(false, 0, undefined);
    expect(getRecommendedExperiencePreset()).toBe('performance');

    if (originalDeviceMemory) {
      Object.defineProperty(navigator, 'deviceMemory', originalDeviceMemory);
    } else {
      delete (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    }

    const gpuSpy = vi.spyOn(gpuTier, 'detectGpuTier');
    gpuSpy.mockReturnValue('software');
    expect(getRecommendedExperiencePreset()).toBe('minimal');
    gpuSpy.mockReturnValue('integrated');
    expect(getRecommendedExperiencePreset()).toBe('performance');
    gpuSpy.mockRestore();
  });

  it('uses media-query fallbacks when matchMedia is unavailable', () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', { configurable: true, value: undefined });

    expect(getRecommendedExperiencePreset()).toBe('performance');

    Object.defineProperty(window, 'matchMedia', { configurable: true, value: originalMatchMedia });
  });

  it('skips URL writes when window is unavailable', () => {
    const originalWindow = window;
    vi.stubGlobal('window', undefined);

    expect(() => useSpaceStore.getState().navigateToPanel('about')).not.toThrow();

    vi.stubGlobal('window', originalWindow);
  });

  it('reads current persisted format and tolerates invalid storage', async () => {
    window.localStorage.setItem(
      'space-portfolio:experience:v1',
      JSON.stringify({
        state: { experienceSettings: { ...DEFAULT_EXPERIENCE_SETTINGS, dpr: 1.5 } },
        version: 1,
      })
    );
    await useSpaceStore.persist.rehydrate();
    expect(useSpaceStore.getState().experienceSettings.dpr).toBe(1.5);

    window.localStorage.setItem('space-portfolio:experience:v1', '{invalid');
    await expect(useSpaceStore.persist.rehydrate()).resolves.toBeUndefined();
  });

  it('tolerates storage write and removal failures', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(() => useSpaceStore.getState().setExperienceSetting('dpr', 1)).not.toThrow();
    setItem.mockRestore();

    const removeItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });
    expect(() => useSpaceStore.persist.clearStorage()).not.toThrow();
    removeItem.mockRestore();
  });

  it('syncs state from history without rewriting the URL', () => {
    window.history.replaceState(null, '', '/#experience');
    useSpaceStore.getState().setPanelFromLocation('experience');

    expect(useSpaceStore.getState().activePanel).toBe('experience');
    expect(window.location.hash).toBe('#experience');
  });

  it('handles complex planet click with warp and delays', () => {
    vi.useFakeTimers();
    const store = useSpaceStore.getState();

    store.handlePlanetClick('about');
    expect(useSpaceStore.getState().warpActive).toBe(true);
    expect(useSpaceStore.getState().activePlanet).toBe('about');
    expect(useSpaceStore.getState().activePanel).toBeNull();

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(useSpaceStore.getState().warpActive).toBe(false);
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(useSpaceStore.getState().activePanel).toBe('about');

    useSpaceStore.getState().setExperienceSetting('transitionAnimations', false);
    useSpaceStore.getState().handlePlanetClick('contact');
    expect(useSpaceStore.getState().activePlanet).toBe('contact');
    expect(useSpaceStore.getState().activePanel).toBe('contact');
    expect(useSpaceStore.getState().warpActive).toBe(false);

    vi.useRealTimers();
  });

  it('cancels pending panel timers when a new planet is clicked', () => {
    vi.useFakeTimers();
    const store = useSpaceStore.getState();

    store.handlePlanetClick('about');
    store.handlePlanetClick('skills');

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(useSpaceStore.getState().activePanel).toBe('skills');
    expect(useSpaceStore.getState().activePlanet).toBe('skills');

    vi.useRealTimers();
  });

  it('closePanel triggers warp when warpEffects and transitionAnimations are enabled', () => {
    vi.useFakeTimers();

    useSpaceStore.getState().navigateToPanel('skills');
    expect(useSpaceStore.getState().activePanel).toBe('skills');

    useSpaceStore.getState().closePanel();
    expect(useSpaceStore.getState().warpActive).toBe(true);
    expect(useSpaceStore.getState().activePanel).toBeNull();
    expect(useSpaceStore.getState().activePlanet).toBeNull();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(useSpaceStore.getState().warpActive).toBe(false);

    vi.useRealTimers();
  });

  it('handles planet click and closePanel when warpEffects disabled', () => {
    vi.useFakeTimers();

    useSpaceStore.getState().setExperienceSetting('warpEffects', false);
    useSpaceStore.getState().setExperienceSetting('transitionAnimations', true);

    useSpaceStore.getState().handlePlanetClick('contact');
    expect(useSpaceStore.getState().activePlanet).toBe('contact');
    expect(useSpaceStore.getState().warpActive).toBe(false);

    act(() => vi.advanceTimersByTime(2000));
    expect(useSpaceStore.getState().activePanel).toBe('contact');

    useSpaceStore.getState().navigateToPanel('skills');
    useSpaceStore.getState().closePanel();
    expect(useSpaceStore.getState().warpActive).toBe(false);

    vi.useRealTimers();
  });
});

describe('lite effects presets', () => {
  it('enables lite effects only on performance and minimal presets', () => {
    const apply = useSpaceStore.getState().applyExperiencePreset;

    for (const [preset, lite] of [
      ['cinematic', false],
      ['balanced', false],
      ['performance', true],
      ['minimal', true],
    ] as const) {
      act(() => apply(preset));
      expect(useSpaceStore.getState().experienceSettings.liteEffects).toBe(lite);
    }
  });
});
