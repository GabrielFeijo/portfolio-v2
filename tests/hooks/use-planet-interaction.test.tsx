import { usePlanetInteraction } from '@/hooks/use-planet-interaction'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

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
  it('opens panel immediately when transitions are disabled', () => {
    const openPanel = vi.fn()
    const setActivePlanet = vi.fn()
    const setCursorVariant = vi.fn()
    const setWarpActive = vi.fn()

    const { result } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'about',
        openPanel,
        setActivePlanet,
        setCursorVariant,
        setWarpActive,
        settings: {
          ...baseSettings,
          transitionAnimations: false,
          warpEffects: false,
        },
      })
    )

    const stopPropagation = vi.fn()
    act(() => result.current.handleClick({ stopPropagation } as never))

    expect(stopPropagation).toHaveBeenCalled()
    expect(setActivePlanet).toHaveBeenCalledWith('about')
    expect(openPanel).toHaveBeenCalledWith('about')
    expect(setWarpActive).not.toHaveBeenCalled()
  })

  it('runs delayed open without warp when warpEffects are disabled', () => {
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
        settings: {
          ...baseSettings,
          warpEffects: false,
        },
      })
    )

    act(() => result.current.handleClick({ stopPropagation: vi.fn() } as never))
    expect(setWarpActive).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(openPanel).toHaveBeenCalledWith('contact')

    vi.useRealTimers()
  })

  it('runs warp and delayed open when enabled', () => {
    vi.useFakeTimers()

    const openPanel = vi.fn()
    const setActivePlanet = vi.fn()
    const setCursorVariant = vi.fn()
    const setWarpActive = vi.fn()

    const { result } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'skills',
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
      vi.advanceTimersByTime(800)
    })
    expect(setWarpActive).toHaveBeenCalledWith(false)
    expect(openPanel).toHaveBeenCalledWith('skills')

    act(() => result.current.handlePointerEnter())
    expect(setCursorVariant).toHaveBeenCalledWith('planet')
    act(() => result.current.handlePointerLeave())
    expect(setCursorVariant).toHaveBeenCalledWith('default')

    vi.useRealTimers()
  })

  it('clears warp timeout on unmount or consecutive clicks', () => {
    vi.useFakeTimers()

    const openPanel = vi.fn()
    const setActivePlanet = vi.fn()
    const setCursorVariant = vi.fn()
    const setWarpActive = vi.fn()

    const { result, unmount } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'projects',
        openPanel,
        setActivePlanet,
        setCursorVariant,
        setWarpActive,
        settings: baseSettings,
      })
    )

    act(() => result.current.handleClick({ stopPropagation: vi.fn() } as never))
    expect(setWarpActive).toHaveBeenCalledWith(true)

    unmount()

    const { result: r2 } = renderHook(() =>
      usePlanetInteraction({
        planetId: 'projects',
        openPanel,
        setActivePlanet,
        setCursorVariant,
        setWarpActive,
        settings: baseSettings,
      })
    )

    act(() => r2.current.handleClick({ stopPropagation: vi.fn() } as never))
    act(() => r2.current.handleClick({ stopPropagation: vi.fn() } as never))
    expect(setWarpActive).toHaveBeenCalled()

    vi.useRealTimers()
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

    vi.useRealTimers()
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
})
