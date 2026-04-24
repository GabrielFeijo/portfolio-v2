import type { PanelId } from '@/types/portfolio'

export type CursorVariant = 'default' | 'planet' | 'link' | 'drag'

export interface NavigationSlice {
  activePlanet: string | null
  setActivePlanet: (id: string | null) => void
  activePanel: PanelId | null
  openPanel: (panel: PanelId) => void
  closePanel: () => void
  helpOpen: boolean
  openHelp: () => void
  closeHelp: () => void
}

export interface UiSlice {
  cursorVariant: CursorVariant
  setCursorVariant: (variant: CursorVariant) => void
  isLoaded: boolean
  setIsLoaded: (loaded: boolean) => void
  warpActive: boolean
  setWarpActive: (active: boolean) => void
}

export type SpaceStore = NavigationSlice & UiSlice
