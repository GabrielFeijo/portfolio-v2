import { useTemporaryFlag } from '@/components/ui/panels/use-temporary-flag';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useTemporaryFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sets active to true and then back to false after duration', () => {
    const { result } = renderHook(() => useTemporaryFlag(1000));
    expect(result.current.active).toBe(false);

    act(() => {
      result.current.trigger();
    });
    expect(result.current.active).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.active).toBe(false);
  });

  it('calls onExpire when timeout completes', () => {
    const onExpire = vi.fn();
    const { result } = renderHook(() => useTemporaryFlag(1000, onExpire));

    act(() => {
      result.current.trigger();
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onExpire).toHaveBeenCalled();
  });

  it('resets timeout if triggered again', () => {
    const { result } = renderHook(() => useTemporaryFlag(1000));

    act(() => {
      result.current.trigger();
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    act(() => {
      result.current.trigger();
    });
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(result.current.active).toBe(true);

    act(() => {
      vi.advanceTimersByTime(301);
    });
    expect(result.current.active).toBe(false);
  });

  it('clears timeout on unmount', () => {
    const spy = vi.spyOn(window, 'clearTimeout');
    const { result, unmount } = renderHook(() => useTemporaryFlag(1000));

    act(() => {
      result.current.trigger();
    });
    unmount();
    expect(spy).toHaveBeenCalled();
  });
});
