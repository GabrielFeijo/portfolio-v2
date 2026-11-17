import { ANIMATION_SETTINGS } from '@/constants/animation';
import type {
  ExperiencePreset,
  ExperienceSettings,
  NavigationSlice,
  SpaceStore,
  UiSlice,
} from '@/types/store';
import { detectGpuTier } from '@/utils/gpu-tier';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SliceSet = (
  partial: Partial<SpaceStore> | ((state: SpaceStore) => Partial<SpaceStore>)
) => void;
type SliceGet = () => SpaceStore;

let panelOpenTimer: ReturnType<typeof setTimeout> | null = null;
let warpOffTimer: ReturnType<typeof setTimeout> | null = null;
const EXPERIENCE_STORAGE_KEY = 'space-portfolio:experience:v1';
const EXPERIENCE_STORAGE_VERSION = 1;

type PersistedSpaceState = Pick<SpaceStore, 'experienceSettings'>;

function clearNavigationTimers() {
  if (panelOpenTimer !== null) {
    clearTimeout(panelOpenTimer);
    panelOpenTimer = null;
  }

  if (warpOffTimer !== null) {
    clearTimeout(warpOffTimer);
    warpOffTimer = null;
  }
}

function scheduleWarpOff(set: SliceSet) {
  warpOffTimer = setTimeout(() => {
    set({ warpActive: false });
    warpOffTimer = null;
  }, ANIMATION_SETTINGS.warpDurationMs);
}

function writeSectionHash(panel: string | null) {
  if (typeof window === 'undefined') return;

  const nextUrl = panel
    ? `${window.location.pathname}${window.location.search}#${panel}`
    : `${window.location.pathname}${window.location.search}`;
  const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (nextUrl !== currentUrl) window.history.pushState(null, '', nextUrl);
}

export const MAX_EXPERIENCE_SETTINGS: ExperienceSettings = {
  antialias: true,
  asteroidDensity: 1,
  autoRotate: true,
  customCursor: true,
  dpr: 1.6,
  liteEffects: false,
  musicEnabled: false,
  musicVolume: 0.35,
  nebula: true,
  orbitalParticles: true,
  planetRotation: true,
  shootingStars: true,
  shadows: true,
  starDensity: 1,
  transitionAnimations: true,
  warpEffects: true,
};

const EXPERIENCE_PRESETS: Record<ExperiencePreset, ExperienceSettings> = {
  cinematic: MAX_EXPERIENCE_SETTINGS,
  balanced: {
    antialias: true,
    asteroidDensity: 0.65,
    autoRotate: true,
    customCursor: false,
    dpr: 1.3,
    liteEffects: false,
    musicEnabled: false,
    musicVolume: 0.35,
    nebula: true,
    orbitalParticles: true,
    planetRotation: true,
    shootingStars: true,
    shadows: false,
    starDensity: 0.6,
    transitionAnimations: true,
    warpEffects: true,
  },
  performance: {
    antialias: false,
    asteroidDensity: 0.38,
    autoRotate: false,
    customCursor: false,
    dpr: 1,
    liteEffects: true,
    musicEnabled: false,
    musicVolume: 0.25,
    nebula: false,
    orbitalParticles: false,
    planetRotation: true,
    shootingStars: false,
    shadows: false,
    starDensity: 0.3,
    transitionAnimations: true,
    warpEffects: false,
  },
  minimal: {
    antialias: false,
    asteroidDensity: 0,
    autoRotate: false,
    customCursor: false,
    dpr: 1,
    liteEffects: true,
    musicEnabled: false,
    musicVolume: 0.2,
    nebula: false,
    orbitalParticles: false,
    planetRotation: false,
    shootingStars: false,
    shadows: false,
    starDensity: 0.18,
    transitionAnimations: false,
    warpEffects: false,
  },
};

export const DEFAULT_EXPERIENCE_SETTINGS = EXPERIENCE_PRESETS.balanced;

export function getRecommendedExperiencePreset(): ExperiencePreset {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'balanced';

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  const gpuTier = detectGpuTier();

  if (reducedMotion || gpuTier === 'software') return 'minimal';
  if (gpuTier === 'integrated') return 'performance';
  if (coarsePointer || cores <= 4 || memory <= 4) return 'performance';
  return 'balanced';
}

function getInitialExperienceSettings(): ExperienceSettings {
  const recommended = EXPERIENCE_PRESETS[getRecommendedExperiencePreset()];
  return { ...recommended };
}

const experienceStorage = createJSONStorage<PersistedSpaceState>(() => ({
  getItem: (name) => {
    try {
      const stored = window.localStorage.getItem(name);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as Record<string, unknown>;
      if ('state' in parsed) return stored;

      return JSON.stringify({
        state: { experienceSettings: parsed },
        version: 0,
      });
    } catch {
      return null;
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      return;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      return;
    }
  },
}));

const createNavigationSlice = (set: SliceSet, get: SliceGet): NavigationSlice => ({
  activePlanet: null,
  setActivePlanet: (id) => set({ activePlanet: id }),
  activePanel: null,
  openPanel: (panel) => {
    set({ activePanel: panel, activePlanet: panel });
    writeSectionHash(panel);
  },
  handlePlanetClick: (planetId) => {
    clearNavigationTimers();

    const { transitionAnimations, warpEffects } = get().experienceSettings;

    if (!transitionAnimations) {
      set({ activePlanet: planetId, activePanel: planetId });
      return;
    }

    set({ activePlanet: planetId });
    writeSectionHash(planetId);

    if (warpEffects) {
      set({ warpActive: true });
      scheduleWarpOff(set);
    }

    panelOpenTimer = setTimeout(() => {
      set({ activePanel: planetId });
      panelOpenTimer = null;
    }, ANIMATION_SETTINGS.panelOpenDelayMs);
  },
  closePanel: () => {
    clearNavigationTimers();

    const { transitionAnimations, warpEffects } = get().experienceSettings;

    if (transitionAnimations && warpEffects) {
      set({ warpActive: true });
      scheduleWarpOff(set);
    }

    set({ activePanel: null, activePlanet: null });
    writeSectionHash(null);
  },
  navigateToPanel: (id) => {
    clearNavigationTimers();
    set({ activePlanet: id, activePanel: id });
    writeSectionHash(id);
  },
  setPanelFromLocation: (id) => {
    clearNavigationTimers();
    set({ activePlanet: id, activePanel: id });
  },
  helpOpen: false,
  openHelp: () => {
    set({ helpOpen: true, activePanel: null, activePlanet: null });
    writeSectionHash(null);
  },
  closeHelp: () => set({ helpOpen: false }),
  settingsOpen: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
});

const createUiSlice = (set: SliceSet, get: SliceGet): UiSlice => ({
  graphicsMode: 'webgl',
  setGraphicsMode: (mode) => set({ graphicsMode: mode }),
  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  warpActive: false,
  setWarpActive: (active) => set({ warpActive: active }),
  experienceSettings: getInitialExperienceSettings(),
  setExperienceSetting: (key, value) =>
    set((state) => {
      const safeValue = key === 'customCursor' && state.graphicsMode === '2d' ? false : value;
      const experienceSettings = {
        ...state.experienceSettings,
        [key]: safeValue,
      };
      return { experienceSettings };
    }),
  applyExperiencePreset: (preset) => {
    const experienceSettings = {
      ...EXPERIENCE_PRESETS[preset],
      customCursor: get().graphicsMode === 'webgl' && EXPERIENCE_PRESETS[preset].customCursor,
    };
    set({ experienceSettings });
  },
  resetExperienceSettings: () => {
    const experienceSettings = {
      ...DEFAULT_EXPERIENCE_SETTINGS,
      customCursor: get().graphicsMode === 'webgl' && DEFAULT_EXPERIENCE_SETTINGS.customCursor,
    };
    set({ experienceSettings });
  },
  language: 'pt',
  setLanguage: (lang) => set({ language: lang }),
});

export const useSpaceStore = create<SpaceStore>()(
  persist<SpaceStore, [], [], PersistedSpaceState>(
    (set, get) => ({
      ...createNavigationSlice(set, get),
      ...createUiSlice(set, get),
    }),
    {
      name: EXPERIENCE_STORAGE_KEY,
      version: EXPERIENCE_STORAGE_VERSION,
      storage: experienceStorage,
      partialize: (state) => ({ experienceSettings: state.experienceSettings }),
      migrate: (persistedState) => {
        const persisted = persistedState as Partial<PersistedSpaceState>;
        return {
          experienceSettings: {
            ...getInitialExperienceSettings(),
            ...persisted.experienceSettings,
          },
        };
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<PersistedSpaceState> | undefined;
        return {
          ...currentState,
          experienceSettings: {
            ...currentState.experienceSettings,
            ...persisted?.experienceSettings,
          },
        };
      },
    }
  )
);
