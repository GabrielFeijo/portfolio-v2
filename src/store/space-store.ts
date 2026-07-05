import { ANIMATION_SETTINGS } from '@/constants/animation'
import type {
  ExperiencePreset,
  ExperienceSettings,
  NavigationSlice,
  SpaceStore,
  UiSlice,
} from '@/types/store'
import { create } from 'zustand'

type SliceSet = (
  partial: Partial<SpaceStore> | ((state: SpaceStore) => Partial<SpaceStore>)
) => void
type SliceGet = () => SpaceStore

let panelOpenTimer: ReturnType<typeof setTimeout> | null = null
let warpOffTimer: ReturnType<typeof setTimeout> | null = null

function clearNavigationTimers() {
  if (panelOpenTimer !== null) {
    clearTimeout(panelOpenTimer)
    panelOpenTimer = null
  }

  if (warpOffTimer !== null) {
    clearTimeout(warpOffTimer)
    warpOffTimer = null
  }
}

function scheduleWarpOff(set: SliceSet) {
  warpOffTimer = setTimeout(() => {
    set({ warpActive: false })
    warpOffTimer = null
  }, ANIMATION_SETTINGS.warpDurationMs)
}

export const MAX_EXPERIENCE_SETTINGS: ExperienceSettings = {
  antialias: true,
  asteroidDensity: 1,
  autoRotate: true,
  customCursor: true,
  dpr: 1.8,
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
}

const EXPERIENCE_PRESETS: Record<ExperiencePreset, ExperienceSettings> = {
  cinematic: MAX_EXPERIENCE_SETTINGS,
  balanced: {
    antialias: true,
    asteroidDensity: 0.65,
    autoRotate: true,
    customCursor: true,
    dpr: 1.5,
    musicEnabled: false,
    musicVolume: 0.35,
    nebula: true,
    orbitalParticles: true,
    planetRotation: true,
    shootingStars: true,
    shadows: true,
    starDensity: 0.72,
    transitionAnimations: true,
    warpEffects: true,
  },
  performance: {
    antialias: false,
    asteroidDensity: 0.38,
    autoRotate: false,
    customCursor: true,
    dpr: 1.15,
    musicEnabled: false,
    musicVolume: 0.25,
    nebula: true,
    orbitalParticles: false,
    planetRotation: true,
    shootingStars: false,
    shadows: false,
    starDensity: 0.42,
    transitionAnimations: true,
    warpEffects: false,
  },
  minimal: {
    antialias: false,
    asteroidDensity: 0,
    autoRotate: false,
    customCursor: false,
    dpr: 1,
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
}

const createNavigationSlice = (set: SliceSet, get: SliceGet): NavigationSlice => ({
  activePlanet: null,
  setActivePlanet: (id) => set({ activePlanet: id }),
  activePanel: null,
  openPanel: (panel) => set({ activePanel: panel }),
  handlePlanetClick: (planetId) => {
    clearNavigationTimers()

    const { transitionAnimations, warpEffects } = get().experienceSettings

    if (!transitionAnimations) {
      set({ activePlanet: planetId, activePanel: planetId })
      return
    }

    set({ activePlanet: planetId })

    if (warpEffects) {
      set({ warpActive: true })
      scheduleWarpOff(set)
    }

    panelOpenTimer = setTimeout(() => {
      set({ activePanel: planetId })
      panelOpenTimer = null
    }, ANIMATION_SETTINGS.panelOpenDelayMs)
  },
  closePanel: () => {
    clearNavigationTimers()

    const { transitionAnimations, warpEffects } = get().experienceSettings

    if (transitionAnimations && warpEffects) {
      set({ warpActive: true })
      scheduleWarpOff(set)
    }

    set({ activePanel: null, activePlanet: null })
  },
  navigateToPanel: (id) => set({ activePlanet: id, activePanel: id }),
  helpOpen: false,
  openHelp: () => set({ helpOpen: true, activePanel: null, activePlanet: null }),
  closeHelp: () => set({ helpOpen: false }),
  settingsOpen: false,
  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),
})

const createUiSlice = (set: SliceSet): UiSlice => ({
  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  warpActive: false,
  setWarpActive: (active) => set({ warpActive: active }),
  experienceSettings: MAX_EXPERIENCE_SETTINGS,
  setExperienceSetting: (key, value) =>
    set((state) => ({
      experienceSettings: {
        ...state.experienceSettings,
        [key]: value,
      },
    })),
  applyExperiencePreset: (preset) => set({ experienceSettings: EXPERIENCE_PRESETS[preset] }),
  resetExperienceSettings: () => set({ experienceSettings: MAX_EXPERIENCE_SETTINGS }),
  language: 'pt',
  setLanguage: (lang) => set({ language: lang }),
})

export const useSpaceStore = create<SpaceStore>((set, get) => ({
  ...createNavigationSlice(set, get),
  ...createUiSlice(set),
}))
