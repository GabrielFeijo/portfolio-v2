import { useTemporaryFlag } from '@/components/ui/panels/use-temporary-flag'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useTemporaryFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('activates and automatically deactivates after duration', () => {
    const onExpire = vi.fn()

    const { result } = renderHook(() => useTemporaryFlag(1000, onExpire))

    expect(result.current.active).toBe(false)

    act(() => {
      result.current.trigger()
    })

    expect(result.current.active).toBe(true)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current.active).toBe(true)
    expect(onExpire).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current.active).toBe(false)
    expect(onExpire).toHaveBeenCalled()
  })

  it('resets timeout if triggered multiple times', () => {
    const onExpire = vi.fn()

    const { result } = renderHook(() => useTemporaryFlag(1000, onExpire))

    act(() => result.current.trigger())

    act(() => {
      vi.advanceTimersByTime(800)
    })

    act(() => result.current.trigger())

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current.active).toBe(true)
    expect(onExpire).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(600)
    })

    expect(result.current.active).toBe(false)
    expect(onExpire).toHaveBeenCalledOnce()
  })

  it('clears timeout on unmount', () => {
    const onExpire = vi.fn()

    const { result, unmount } = renderHook(() => useTemporaryFlag(1000, onExpire))

    act(() => result.current.trigger())

    unmount()

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(onExpire).not.toHaveBeenCalled()
  })
})
