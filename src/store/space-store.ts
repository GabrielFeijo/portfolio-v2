import { create } from 'zustand'
import type { PanelId } from '@/data/portfolio'

export type CursorVariant = 'default' | 'planet' | 'link' | 'drag'

interface SpaceStore {
  activePlanet: string | null
  setActivePlanet: (id: string | null) => void
  
  activePanel: PanelId | null
  openPanel: (panel: PanelId) => void
  closePanel: () => void

  helpOpen: boolean
  openHelp: () => void
  closeHelp: () => void
  
  cursorVariant: CursorVariant
  setCursorVariant: (variant: CursorVariant) => void
  
  isLoaded: boolean
  setIsLoaded: (loaded: boolean) => void
  
  warpActive: boolean
  setWarpActive: (active: boolean) => void
}

export const useSpaceStore = create<SpaceStore>((set) => ({
  activePlanet: null,
  setActivePlanet: (id) => set({ activePlanet: id }),
  
  activePanel: null,
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null, activePlanet: null }),

  helpOpen: false,
  openHelp: () => set({ helpOpen: true, activePanel: null, activePlanet: null }),
  closeHelp: () => set({ helpOpen: false }),
  
  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  
  warpActive: false,
  setWarpActive: (active) => set({ warpActive: active }),
}))
