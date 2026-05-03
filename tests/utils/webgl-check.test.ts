import { isWebGL2Available, isWebGLAvailable } from '@/utils/webgl-check'
import { describe, expect, it, vi } from 'vitest'

describe('webgl-check', () => {
  it('returns true when webgl context exists', () => {
    const getContext = vi.fn((type: string) => (type === 'webgl' ? {} : null))
    vi.spyOn(document, 'createElement').mockReturnValue({ getContext } as unknown as HTMLCanvasElement)
    vi.stubGlobal('WebGLRenderingContext', function W() {})

    expect(isWebGLAvailable()).toBe(true)
  })

  it('supports experimental-webgl fallback', () => {
    const getContext = vi.fn((type: string) => (type === 'experimental-webgl' ? {} : null))
    vi.spyOn(document, 'createElement').mockReturnValue({ getContext } as unknown as HTMLCanvasElement)
    vi.stubGlobal('WebGLRenderingContext', function W() {})

    expect(isWebGLAvailable()).toBe(true)
  })

  it('returns false if context is unavailable', () => {
    const getContext = vi.fn(() => null)
    vi.spyOn(document, 'createElement').mockReturnValue({ getContext } as unknown as HTMLCanvasElement)
    vi.stubGlobal('WebGLRenderingContext', undefined)

    expect(isWebGLAvailable()).toBe(false)
  })

  it('returns false if function throws', () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      throw new Error('boom')
    })

    expect(isWebGLAvailable()).toBe(false)
  })

  it('returns true when webgl2 context exists', () => {
    const getContext = vi.fn((type: string) => (type === 'webgl2' ? {} : null))
    vi.spyOn(document, 'createElement').mockReturnValue({ getContext } as unknown as HTMLCanvasElement)
    vi.stubGlobal('WebGL2RenderingContext', function W2() {})

    expect(isWebGL2Available()).toBe(true)
  })

  it('returns false when webgl2 check throws', () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      throw new Error('boom')
    })
    expect(isWebGL2Available()).toBe(false)
  })
})
