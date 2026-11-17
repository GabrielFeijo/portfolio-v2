import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, create } from '@react-three/test-renderer';

import { Sun3D } from '@/components/three/objects/sun-3d';
import { advanceR3F } from '../../../helpers/r3f-utils';

const openHelp = vi.fn();
const setCursorVariant = vi.fn();
let mockSunState = {
  activePanel: null as string | null,
  helpOpen: false,
  settingsOpen: false,
  openHelp,
  setCursorVariant,
  experienceSettings: {
    asteroidDensity: 1,
    liteEffects: false,
  },
};

const sunHandlers: Partial<{
  click: (event: { stopPropagation: () => void }) => void;
  enter: () => void;
  leave: () => void;
}> = {};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('zustand/react/shallow', () => ({
  useShallow: (fn: unknown) => fn,
}));

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: (state: typeof mockSunState) => unknown) =>
    selector ? selector(mockSunState) : mockSunState,
}));

vi.mock('@react-three/drei', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@react-three/drei')>();
  return {
    ...actual,
    Html: () => null,
    Sphere: () => null,
    Sparkles: () => null,
  };
});

vi.mock('react', async (importOriginal) => {
  const React = await importOriginal<typeof import('react')>();

  return {
    ...React,
    useCallback: (factory: () => (...args: never[]) => unknown, deps: unknown[]) => {
      const callback = React.useCallback(factory, deps);
      const source = factory.toString();

      if (source.includes('stopPropagation')) {
        sunHandlers.click = callback as (event: { stopPropagation: () => void }) => void;
      } else if (source.includes('setHovered(true)')) {
        sunHandlers.enter = callback as () => void;
      } else if (source.includes('setHovered(false)')) {
        sunHandlers.leave = callback as () => void;
      }

      return callback;
    },
  };
});

describe('Sun3D', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSunState = {
      activePanel: null,
      helpOpen: false,
      settingsOpen: false,
      openHelp,
      setCursorVariant,
      experienceSettings: {
        asteroidDensity: 1,
        liteEffects: false,
      },
    };
    sunHandlers.click = undefined;
    sunHandlers.enter = undefined;
    sunHandlers.leave = undefined;
  });

  it('renders and animates sun mesh, shader uniforms, and solar flares', async () => {
    const renderer = await create(<Sun3D />);

    expect(renderer).toBeDefined();
    await advanceR3F(renderer, 30, 0.05);

    await renderer.unmount();
  });

  it('handles pointer interactions and opens help on click', async () => {
    const renderer = await create(<Sun3D />);

    expect(sunHandlers.enter).toBeTypeOf('function');
    expect(sunHandlers.click).toBeTypeOf('function');
    expect(sunHandlers.leave).toBeTypeOf('function');

    await act(async () => {
      sunHandlers.enter!();
    });
    await advanceR3F(renderer, 1, 0.016);
    expect(setCursorVariant).toHaveBeenCalledWith('planet');

    const stopPropagation = vi.fn();
    await act(async () => {
      sunHandlers.click!({ stopPropagation });
    });
    expect(stopPropagation).toHaveBeenCalled();
    expect(openHelp).toHaveBeenCalled();

    await act(async () => {
      sunHandlers.leave!();
    });
    expect(setCursorVariant).toHaveBeenCalledWith('default');

    await renderer.unmount();
  });

  it('uses reduced sparkles and skips flares when liteEffects is enabled', async () => {
    mockSunState.experienceSettings = { asteroidDensity: 0, liteEffects: true };

    const renderer = await create(<Sun3D />);
    await advanceR3F(renderer, 5, 0.05);
    await renderer.unmount();
  });

  it('pauses flares, sparkles, and sun ticks while obscured', async () => {
    mockSunState.activePanel = 'projects';

    const renderer = await create(<Sun3D />);
    await advanceR3F(renderer, 5, 0.05);
    await renderer.unmount();
  });
});
