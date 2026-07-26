import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock('@react-three/fiber', () => ({
  Canvas: ({
    children,
    onCreated,
  }: {
    children: React.ReactNode;
    onCreated?: (state: any) => void;
  }) => {
    if (onCreated) {
      const gl = {
        domElement: {
          addEventListener: (event: string, cb: (...args: unknown[]) => void) => {
            if (event === 'webglcontextlost') {
              (window as any).__triggerContextLost = cb;
            }
          },
        },
      };
      onCreated({ gl });
    }
    return <div data-testid="canvas">{children}</div>;
  },
}));

vi.mock('@react-three/drei', () => ({
  Preload: () => null,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('zustand/react/shallow', () => ({
  useShallow: (selector: unknown) => selector,
}));

vi.mock('@/components/three/scene/space-scene', () => ({
  SpaceScene: () => <div data-testid="scene" />,
}));
vi.mock('@/components/ui/hud/custom-cursor', () => ({
  CustomCursor: () => <div data-testid="cursor" />,
}));
vi.mock('@/components/ui/hud/hud', () => ({ HUD: () => <div data-testid="hud" /> }));
vi.mock('@/components/ui/hud/loading-screen', () => ({
  LoadingScreen: () => <div data-testid="loading" />,
}));
vi.mock('@/components/ui/hud/space-music', () => ({
  SpaceMusic: () => <div data-testid="music" />,
}));
vi.mock('@/components/ui/hud/warp-effect', () => ({
  WarpEffect: () => <div data-testid="warp" />,
}));
vi.mock('@/components/ui/overlays/help-overlay', () => ({
  HelpOverlay: () => <div data-testid="help" />,
}));
vi.mock('@/components/ui/overlays/settings-overlay', () => ({
  SettingsOverlay: () => <div data-testid="settings" />,
}));
vi.mock('@/components/ui/overlays/webgl-error', () => ({
  WebGLError: ({ variant }: { variant: string }) => <div data-testid="webgl">{variant}</div>,
}));
vi.mock('@/components/ui/planet-panel', () => ({ PlanetPanel: () => <div data-testid="panel" /> }));

const state = {
  activePanel: null as null | string,
  helpOpen: false,
  isLoaded: false,
  experienceSettings: { dpr: 1, antialias: true, shadows: true },
  settingsOpen: false,
};

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: (s: typeof state) => unknown) => selector(state),
}));

const isWebGLAvailableMock = vi.fn(() => true);
vi.mock('@/utils/webgl-check', () => ({
  isWebGLAvailable: () => isWebGLAvailableMock(),
}));

describe('App', () => {
  beforeEach(() => {
    state.activePanel = null;
    state.helpOpen = false;
    state.isLoaded = false;
    state.settingsOpen = false;
    isWebGLAvailableMock.mockReturnValue(true);
    delete (window as any).__triggerContextLost;
  });

  it('renders webgl error when unavailable', async () => {
    isWebGLAvailableMock.mockReturnValue(false);
    const { default: App } = await import('@/app');
    render(<App />);

    expect(screen.getByTestId('webgl')).toHaveTextContent('unavailable');
  });

  it('renders scene and loading ui when available', async () => {
    const { default: App } = await import('@/app');
    render(<App />);

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders panel and overlays when store enables them', async () => {
    state.activePanel = 'about';
    state.helpOpen = true;
    state.isLoaded = true;
    state.settingsOpen = true;

    const { default: App } = await import('@/app');
    render(<App />);

    expect(screen.getByTestId('hud')).toBeInTheDocument();
    expect(screen.getByTestId('panel')).toBeInTheDocument();
    expect(screen.getByTestId('help')).toBeInTheDocument();
    expect(screen.getByTestId('settings')).toBeInTheDocument();
  });

  it('handles webgl context lost', async () => {
    const { default: App } = await import('@/app');
    render(<App />);

    const event = { preventDefault: vi.fn() };

    await act(async () => {
      (window as any).__triggerContextLost?.(event);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(screen.getByTestId('webgl')).toHaveTextContent('context_lost');
  });

  it('prevents the native context menu and removes the listener on cleanup', async () => {
    const { default: App } = await import('@/app');
    const { unmount } = render(<App />);

    const firstEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    fireEvent(document, firstEvent);
    expect(firstEvent.defaultPrevented).toBe(true);

    unmount();

    const secondEvent = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    fireEvent(document, secondEvent);
    expect(secondEvent.defaultPrevented).toBe(false);
  });
});
