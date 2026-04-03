import { create } from 'zustand'

export type PanelType = 'about' | 'skills' | 'projects' | 'experience' | 'accomplishments' | 'contact' | null

interface SpaceStore {
  activePlanet: string | null
  setActivePlanet: (id: string | null) => void
  
  activePanel: PanelType
  openPanel: (panel: PanelType) => void
  closePanel: () => void
  
  cursorVariant: 'default' | 'planet' | 'link' | 'drag'
  setCursorVariant: (variant: 'default' | 'planet' | 'link' | 'drag') => void
  
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
  
  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  
  warpActive: false,
  setWarpActive: (active) => set({ warpActive: active }),
}))
