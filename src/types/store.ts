import type { PanelId } from '@/types/portfolio'

export type CursorVariant = 'default' | 'planet' | 'link' | 'drag'
export type ExperiencePreset = 'cinematic' | 'balanced' | 'performance' | 'minimal'

export interface ExperienceSettings {
  antialias: boolean
  asteroidDensity: number
  autoRotate: boolean
  dpr: number
  nebula: boolean
  musicEnabled: boolean
  musicVolume: number
  orbitalParticles: boolean
  planetRotation: boolean
  shootingStars: boolean
  shadows: boolean
  starDensity: number
  transitionAnimations: boolean
  warpEffects: boolean
}

export interface NavigationSlice {
  activePlanet: PanelId | null
  setActivePlanet: (id: PanelId | null) => void
  activePanel: PanelId | null
  openPanel: (panel: PanelId) => void
  handlePlanetClick: (planetId: PanelId) => void
  closePanel: () => void
  navigateToPanel: (id: PanelId) => void
  helpOpen: boolean
  openHelp: () => void
  closeHelp: () => void
  settingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

export interface UiSlice {
  cursorVariant: CursorVariant
  setCursorVariant: (variant: CursorVariant) => void
  isLoaded: boolean
  setIsLoaded: (loaded: boolean) => void
  warpActive: boolean
  setWarpActive: (active: boolean) => void
  experienceSettings: ExperienceSettings
  setExperienceSetting: <Key extends keyof ExperienceSettings>(
    key: Key,
    value: ExperienceSettings[Key]
  ) => void
  applyExperiencePreset: (preset: ExperiencePreset) => void
  resetExperienceSettings: () => void
  language: 'pt' | 'en'
  setLanguage: (lang: 'pt' | 'en') => void
}

export type SpaceStore = NavigationSlice & UiSlice
