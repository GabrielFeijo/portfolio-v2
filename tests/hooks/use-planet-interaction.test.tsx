import { usePlanetInteraction } from '@/hooks/use-planet-interaction'
import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/hooks/use-prefers-reduced-motion', () => ({
  usePrefersReducedMotion: vi.fn(() => false),
}))

const baseSettings = {
  antialias: true,
  asteroidDensity: 1,
  autoRotate: true,
  customCursor: true,
  dpr: 1,
  musicEnabled: false,
  musicVolume: 0,
  nebula: true,
  orbitalParticles: true,
  planetRotation: true,
  shootingStars: true,
  shadows: true,
  starDensity: 1,
  transitionAnimations: true,
  warpEffects: true,
}

describe('usePlanetInteraction', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls handlePlanetClick on handleClick', () => {
    const handlePlanetClick = vi.fn()
    const setCursorVariant = vi.fn()

    const { result } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'about',
        handlePlanetClick,
        setCursorVariant,
      })
    )

    const stopPropagation = vi.fn()
    act(() => result.current.handleClick({ stopPropagation } as never))

    expect(stopPropagation).toHaveBeenCalled()
    expect(handlePlanetClick).toHaveBeenCalledWith('about')
  })

  it('updates cursor and hovered state on pointer events', () => {
    const handlePlanetClick = vi.fn()
    const setCursorVariant = vi.fn()

    const { result } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'skills',
        handlePlanetClick,
        setCursorVariant,
      })
    )

    act(() => result.current.handlePointerEnter())
    expect(result.current.hovered).toBe(true)
    expect(setCursorVariant).toHaveBeenCalledWith('planet')

    act(() => result.current.handlePointerLeave())
    expect(result.current.hovered).toBe(false)
    expect(setCursorVariant).toHaveBeenCalledWith('default')
  })

  it('opens panel immediately when reduced motion is preferred', async () => {
    const { usePrefersReducedMotion } = await import('@/hooks/use-prefers-reduced-motion')
    vi.mocked(usePrefersReducedMotion).mockReturnValue(true)

    const openPanel = vi.fn()
    const setActivePlanet = vi.fn()
    const setCursorVariant = vi.fn()
    const setWarpActive = vi.fn()

    const { result } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'experience',
        openPanel,
        setActivePlanet,
        setCursorVariant,
        setWarpActive,
        settings: baseSettings,
      })
    )

    act(() => result.current.handleClick({ stopPropagation: vi.fn() } as never))

    expect(openPanel).toHaveBeenCalledWith('experience')
    expect(setWarpActive).not.toHaveBeenCalled()

    vi.mocked(usePrefersReducedMotion).mockReturnValue(false)
  })

  it('runs warp and delayed open when enabled', () => {
    vi.useFakeTimers()

    const openPanel = vi.fn()
    const setActivePlanet = vi.fn()
    const setCursorVariant = vi.fn()
    const setWarpActive = vi.fn()

    const { result } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'contact',
        openPanel,
        setActivePlanet,
        setCursorVariant,
        setWarpActive,
        settings: baseSettings,
      })
    )

    act(() => result.current.handleClick({ stopPropagation: vi.fn() } as never))
    expect(setWarpActive).toHaveBeenCalledWith(true)

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(openPanel).toHaveBeenCalledWith('contact')
  })

  it('clears panel open timer on unmount', () => {
    vi.useFakeTimers()

    const openPanel = vi.fn()
    const setActivePlanet = vi.fn()
    const setCursorVariant = vi.fn()
    const setWarpActive = vi.fn()

    const { result, unmount } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'about',
        openPanel,
        setActivePlanet,
        setCursorVariant,
        setWarpActive,
        settings: baseSettings,
      })
    )

    act(() => result.current.handleClick({ stopPropagation: vi.fn() } as never))
    unmount()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(openPanel).not.toHaveBeenCalled()
  })
})
