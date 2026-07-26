import type { RefObject } from 'react';
import { useEffect } from 'react';

const FOCUSABLE_SELECTOR =
  'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusableElements = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => !element.hasAttribute('disabled')
      );

    const handleKeyDown = (event: KeyboardEvent) => {
      const focusable = getFocusableElements();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.key !== 'Tab' || !first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const rafId = requestAnimationFrame(() => {
      getFocusableElements()[0]?.focus();
    });

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [containerRef, enabled]);
}
