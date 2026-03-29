import { create } from 'zustand'

export type PanelType = 'about' | 'skills' | 'projects' | 'experience' | 'accomplishments' | 'contact' | null

interface SpaceStore {
  activePlanet: string | null
  setActivePlanet: (id: string | null) => void
  
  activePanel: PanelType
  openPanel: (panel: PanelType) => void
  closePanel: () => void
  
  isZooming: boolean
  setIsZooming: (zooming: boolean) => void
  
  showHUD: boolean
  setShowHUD: (show: boolean) => void
  
  showIntro: boolean
  setShowIntro: (show: boolean) => void
  
  soundEnabled: boolean
  toggleSound: () => void
  
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
  
  isZooming: false,
  setIsZooming: (zooming) => set({ isZooming: zooming }),
  
  showHUD: true,
  setShowHUD: (show) => set({ showHUD: show }),
  
  showIntro: true,
  setShowIntro: (show) => set({ showIntro: show }),
  
  soundEnabled: false,
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  
  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  
  warpActive: false,
  setWarpActive: (active) => set({ warpActive: active }),
}))
