import { useTemporaryFlag } from '@/components/ui/panels/use-temporary-flag'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('useTemporaryFlag', () => {
  it('activates and automatically deactivates after duration', () => {
    vi.useFakeTimers()
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

    vi.useRealTimers()
  })

  it('resets timeout if triggered multiple times', () => {
    vi.useFakeTimers()
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

    vi.useRealTimers()
  })

  it('clears timeout on unmount', () => {
    vi.useFakeTimers()
    const onExpire = vi.fn()
    
    const { result, unmount } = renderHook(() => useTemporaryFlag(1000, onExpire))
    
    act(() => result.current.trigger())
    
    unmount()
    
    act(() => {
      vi.advanceTimersByTime(1500)
    })
    
    expect(onExpire).not.toHaveBeenCalled()

    vi.useRealTimers()
  })
})
