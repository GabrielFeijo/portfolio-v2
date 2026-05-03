import { MAX_EXPERIENCE_SETTINGS, useSpaceStore } from '@/store/space-store'
import { beforeEach, describe, expect, it } from 'vitest'

describe('space-store', () => {
  beforeEach(() => {
    useSpaceStore.setState({
      activePlanet: null,
      activePanel: null,
      helpOpen: false,
      settingsOpen: false,
      cursorVariant: 'default',
      isLoaded: false,
      warpActive: false,
      experienceSettings: MAX_EXPERIENCE_SETTINGS,
      language: 'pt',
    })
  })

  it('navigates between panels', () => {
    useSpaceStore.getState().setActivePlanet('skills')
    expect(useSpaceStore.getState().activePlanet).toBe('skills')

    useSpaceStore.getState().openPanel('skills')
    expect(useSpaceStore.getState().activePanel).toBe('skills')

    useSpaceStore.getState().navigateToPanel('about')
    expect(useSpaceStore.getState().activePanel).toBe('about')
    expect(useSpaceStore.getState().activePlanet).toBe('about')

    useSpaceStore.getState().closePanel()
    expect(useSpaceStore.getState().activePanel).toBeNull()
    expect(useSpaceStore.getState().activePlanet).toBeNull()
  })

  it('updates UI state', () => {
    useSpaceStore.getState().setCursorVariant('planet')
    useSpaceStore.getState().setIsLoaded(true)
    useSpaceStore.getState().setWarpActive(true)
    useSpaceStore.getState().setLanguage('en')

    const state = useSpaceStore.getState()
    expect(state.cursorVariant).toBe('planet')
    expect(state.isLoaded).toBe(true)
    expect(state.warpActive).toBe(true)
    expect(state.language).toBe('en')
  })

  it('opens and closes overlays', () => {
    useSpaceStore.getState().openHelp()
    expect(useSpaceStore.getState().helpOpen).toBe(true)
    expect(useSpaceStore.getState().activePanel).toBeNull()

    useSpaceStore.getState().closeHelp()
    expect(useSpaceStore.getState().helpOpen).toBe(false)

    useSpaceStore.getState().openSettings()
    expect(useSpaceStore.getState().settingsOpen).toBe(true)
    useSpaceStore.getState().closeSettings()
    expect(useSpaceStore.getState().settingsOpen).toBe(false)
  })

  it('applies and resets experience presets', () => {
    useSpaceStore.getState().applyExperiencePreset('performance')
    expect(useSpaceStore.getState().experienceSettings.antialias).toBe(false)

    useSpaceStore.getState().setExperienceSetting('musicEnabled', true)
    expect(useSpaceStore.getState().experienceSettings.musicEnabled).toBe(true)

    useSpaceStore.getState().resetExperienceSettings()
    expect(useSpaceStore.getState().experienceSettings).toEqual(MAX_EXPERIENCE_SETTINGS)
  })
})
