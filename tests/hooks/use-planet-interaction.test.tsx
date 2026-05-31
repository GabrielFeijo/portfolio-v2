import { usePlanetInteraction } from '@/hooks/use-planet-interaction'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('usePlanetInteraction', () => {
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
})
