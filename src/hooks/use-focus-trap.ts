import type { RefObject } from 'react'
import { useEffect } from 'react'

const FOCUSABLE_SELECTOR =
  'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap(containerRef: RefObject<HTMLElement>, enabled: boolean) {
  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const focusable = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []
      ).filter((element) => !element.hasAttribute('disabled'))

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last || event.key !== 'Tab') return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const rafId = requestAnimationFrame(() => {
      if (!containerRef.current) return

      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((element) => !element.hasAttribute('disabled'))

      focusable[0]?.focus()
    })

    container.addEventListener('keydown', handleKeyDown)
    return () => {
      cancelAnimationFrame(rafId)
      container.removeEventListener('keydown', handleKeyDown)
    }
  }, [containerRef, enabled])
}
