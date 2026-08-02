import { CustomCursor } from '@/components/ui/hud/custom-cursor';
import { act, render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let mockVariant = 'default';
let mockCustomCursor = true;
let mockGraphicsMode: 'webgl' | '2d' = 'webgl';
vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: any) =>
    selector({
      cursorVariant: mockVariant,
      graphicsMode: mockGraphicsMode,
      experienceSettings: {
        customCursor: mockCustomCursor,
      },
    }),
}));

describe('CustomCursor', () => {
  let listeners: any[] = [];
  let matches = true;

  beforeEach(() => {
    mockVariant = 'default';
    mockGraphicsMode = 'webgl';
    listeners = [];
    matches = true;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        get matches() {
          if (query.includes('prefers-reduced-motion')) {
            return false;
          }
          return matches;
        },
        media: query,
        onchange: null,
        addEventListener: vi.fn((type, cb) => {
          if (type === 'change') listeners.push(cb);
        }),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders when cursor is capable', () => {
    const { container } = render(<CustomCursor />);
    expect(container.firstChild).not.toBeNull();
  });

  it('updates cursor position on mouse move', () => {
    render(<CustomCursor />);
    act(() => {
      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 80 }));
    });
    expect(document.body.classList.contains('custom-cursor-active')).toBe(true);
  });

  it('renders planet variant specific elements', () => {
    mockVariant = 'planet';
    const { unmount } = render(<CustomCursor />);
    unmount();
  });

  it('handles media query change events', () => {
    render(<CustomCursor />);
    act(() => {
      matches = false;
      listeners.forEach((l) => l({ matches: false }));
    });
    expect(document.body.classList.contains('custom-cursor-active')).toBe(false);
  });

  it('returns null when cursor is not capable', () => {
    matches = false;
    const { container } = render(<CustomCursor />);
    expect(container.firstChild).toBeNull();
  });

  it('forces the native cursor in 2D compatibility mode', () => {
    mockGraphicsMode = '2d';
    const { container } = render(<CustomCursor />);

    expect(container.firstChild).toBeNull();
    expect(document.body.classList.contains('custom-cursor-active')).toBe(false);
    expect(document.body.classList.contains('graphics-2d-mode')).toBe(true);
  });

  it('returns null during server rendering without window', () => {
    vi.stubGlobal('window', undefined);

    expect(renderToString(<CustomCursor />)).toBe('');

    vi.unstubAllGlobals();
  });
});
