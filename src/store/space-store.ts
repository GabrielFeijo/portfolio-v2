import { create } from 'zustand'
import type { NavigationSlice, SpaceStore, UiSlice } from '@/types/store'

const createNavigationSlice = (set: (partial: Partial<SpaceStore>) => void): NavigationSlice => ({
  activePlanet: null,
  setActivePlanet: (id) => set({ activePlanet: id }),
  activePanel: null,
  openPanel: (panel) => set({ activePanel: panel }),
  closePanel: () => set({ activePanel: null, activePlanet: null }),
  helpOpen: false,
  openHelp: () => set({ helpOpen: true, activePanel: null, activePlanet: null }),
  closeHelp: () => set({ helpOpen: false }),
})

const createUiSlice = (set: (partial: Partial<SpaceStore>) => void): UiSlice => ({
  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  warpActive: false,
  setWarpActive: (active) => set({ warpActive: active }),
})

export const useSpaceStore = create<SpaceStore>((set) => ({
  ...createNavigationSlice(set),
  ...createUiSlice(set),
}))
