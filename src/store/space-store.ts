import { create } from 'zustand'
import type { ExperiencePreset, ExperienceSettings, NavigationSlice, SpaceStore, UiSlice } from '@/types/store'

type SliceSet = (partial: Partial<SpaceStore> | ((state: SpaceStore) => Partial<SpaceStore>)) => void

export const MAX_EXPERIENCE_SETTINGS: ExperienceSettings = {
  antialias: true,
  asteroidDensity: 1,
  autoRotate: true,
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

const createNavigationSlice = (set: SliceSet): NavigationSlice => ({
  activePlanet: null,
  setActivePlanet: (id) => set({ activePlanet: id }),
  activePanel: null,
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null, activePlanet: null }),
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
  setExperienceSetting: (key, value) => set((state) => ({
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

export const useSpaceStore = create<SpaceStore>((set) => ({
  ...createNavigationSlice(set),
  ...createUiSlice(set),
}))
