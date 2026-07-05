import { useFocusTrap } from '@/hooks/use-focus-trap'
import { act, render, waitFor } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it } from 'vitest'

function Trap({ enabled }: { enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, enabled)

  return (
    <div ref={ref}>
      <button>first</button>
      <button>last</button>
    </div>
  )
}

async function flushFocusFrame() {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve())
    })
  })
}

describe('useFocusTrap', () => {
  it('focuses first element when enabled', async () => {
    render(<Trap enabled />)
    await waitFor(() => expect(document.activeElement?.textContent).toBe('first'))
  })

  it('does nothing when disabled', async () => {
    render(<Trap enabled={false} />)
    await flushFocusFrame()
    expect(document.activeElement?.textContent).not.toBe('last')
  })

  it('traps focus forward on Tab', async () => {
    const { container } = render(<Trap enabled />)
    await flushFocusFrame()
    const elements = container.querySelectorAll('button')

    elements[1].focus()
    expect(document.activeElement?.textContent).toBe('last')

    const event = new window.KeyboardEvent('keydown', { key: 'Tab' })
    container.firstElementChild?.dispatchEvent(event)

    await waitFor(() => expect(document.activeElement?.textContent).toBe('first'))
  })

  it('traps focus backward on Shift+Tab', async () => {
    const { container } = render(<Trap enabled />)
    await waitFor(() => expect(document.activeElement?.textContent).toBe('first'))

    const event = new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
    container.firstElementChild?.dispatchEvent(event)

    expect(document.activeElement?.textContent).toBe('last')
  })

  it('ignores other keys', async () => {
    const { container } = render(<Trap enabled />)
    await waitFor(() => expect(document.activeElement?.textContent).toBe('first'))

    const event = new window.KeyboardEvent('keydown', { key: 'Enter' })
    container.firstElementChild?.dispatchEvent(event)

    await waitFor(() => expect(document.activeElement?.textContent).toBe('first'))
  })

  it('handles null ref during keydown', async () => {
    const externalRef = { current: null as HTMLDivElement | null }

    function TestComponent() {
      useFocusTrap(externalRef, true)
      return (
        <div ref={externalRef}>
          <button>btn</button>
        </div>
      )
    }
    const { container } = render(<TestComponent />)
    await flushFocusFrame()

    externalRef.current = null

    const event = new window.KeyboardEvent('keydown', { key: 'Tab' })
    container.firstElementChild?.dispatchEvent(event)
  })

  it('handles null ref in requestAnimationFrame', async () => {
    const externalRef = { current: null as HTMLDivElement | null }

    function TestComponent() {
      useFocusTrap(externalRef, true)
      return (
        <div ref={externalRef}>
          <button>btn</button>
        </div>
      )
    }
    render(<TestComponent />)

    externalRef.current = null

    await flushFocusFrame()
  })

  it('falls back gracefully when activeElement is not an HTMLElement', async () => {
    const originalActiveElement = document.activeElement
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => ({}) as Element,
    })

    try {
      const { unmount } = render(<Trap enabled />)
      await flushFocusFrame()
      unmount()
    } finally {
      Object.defineProperty(document, 'activeElement', {
        configurable: true,
        get: () => originalActiveElement,
      })
    }
  })
})
