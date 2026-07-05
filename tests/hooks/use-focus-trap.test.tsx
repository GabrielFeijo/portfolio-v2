import { useFocusTrap } from '@/hooks/use-focus-trap'
import { act, render } from '@testing-library/react'
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
    await flushFocusFrame()
    expect(document.activeElement?.textContent).toBe('first')
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

    expect(document.activeElement?.textContent).toBe('first')
  })

  it('traps focus backward on Shift+Tab', async () => {
    const { container } = render(<Trap enabled />)
    await flushFocusFrame()
    expect(document.activeElement?.textContent).toBe('first')

    const event = new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true })
    container.firstElementChild?.dispatchEvent(event)

    expect(document.activeElement?.textContent).toBe('last')
  })

  it('ignores other keys', async () => {
    const { container } = render(<Trap enabled />)
    await flushFocusFrame()
    expect(document.activeElement?.textContent).toBe('first')

    const event = new window.KeyboardEvent('keydown', { key: 'Enter' })
    container.firstElementChild?.dispatchEvent(event)

    expect(document.activeElement?.textContent).toBe('first')
  })

  it('handles null ref during keydown', async () => {
    let refObj: any
    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      refObj = ref
      useFocusTrap(ref, true)
      return (
        <div ref={ref}>
          <button>btn</button>
        </div>
      )
    }
    const { container } = render(<TestComponent />)
    await flushFocusFrame()

    refObj.current = null

    const event = new window.KeyboardEvent('keydown', { key: 'Tab' })
    container.firstElementChild?.dispatchEvent(event)
  })

  it('handles null ref in requestAnimationFrame', async () => {
    let refObj: any
    function TestComponent() {
      const ref = useRef<HTMLDivElement>(null)
      refObj = ref
      useFocusTrap(ref, true)
      return (
        <div ref={ref}>
          <button>btn</button>
        </div>
      )
    }
    render(<TestComponent />)

    refObj.current = null

    await flushFocusFrame()
  })
})
