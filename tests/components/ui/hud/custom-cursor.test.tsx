import { CustomCursor } from '@/components/ui/hud/custom-cursor'
import { act, render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let mockVariant = 'default'
vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: any) => selector({ cursorVariant: mockVariant }),
}))

describe('CustomCursor', () => {
  let listeners: any[] = []
  let matches = true

  beforeEach(() => {
    mockVariant = 'default'
    listeners = []
    matches = true
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        get matches() {
          return matches
        },
        media: query,
        onchange: null,
        addEventListener: vi.fn((type, cb) => {
          if (type === 'change') listeners.push(cb)
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('renders when cursor is capable', () => {
    const { container } = render(<CustomCursor />)
    expect(container.firstChild).not.toBeNull()
  })

  it('updates cursor position on mouse move', () => {
    render(<CustomCursor />)
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 80 }))
    })
    expect(document.body.classList.contains('cursor-fallback-mode')).toBe(false)
  })

  it('renders planet variant specific elements', () => {
    mockVariant = 'planet'
    const { unmount } = render(<CustomCursor />)
    unmount()
  })

  it('handles media query change events', () => {
    render(<CustomCursor />)
    act(() => {
      matches = false
      listeners.forEach((l) => l({ matches: false }))
    })
    expect(document.body.classList.contains('cursor-fallback-mode')).toBe(true)
  })

  it('returns null when cursor is not capable', () => {
    matches = false
    const { container } = render(<CustomCursor />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null during server rendering without window', () => {
    vi.stubGlobal('window', undefined)

    expect(renderToString(<CustomCursor />)).toBe('')

    vi.unstubAllGlobals()
  })
})
