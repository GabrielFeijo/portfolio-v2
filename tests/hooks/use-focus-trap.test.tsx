import { useFocusTrap } from '@/hooks/use-focus-trap'
import { render, waitFor } from '@testing-library/react'
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

describe('useFocusTrap', () => {
  it('focuses first element when enabled', async () => {
    render(<Trap enabled />)
    await waitFor(() => expect(document.activeElement?.textContent).toBe('first'))
  })

  it('does nothing when disabled', () => {
    render(<Trap enabled={false} />)
    expect(document.activeElement?.textContent).not.toBe('last')
  })

  it('traps focus forward on Tab', async () => {
    const { container } = render(<Trap enabled />)
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
})
