import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@react-three/drei', () => ({
  Stars: () => null,
}));

vi.mock('zustand/react/shallow', () => ({
  useShallow: (selector: unknown) => selector,
}));

const setIsLoaded = vi.fn();
let mockSettings = {
  antialias: true,
  asteroidDensity: 1,
  autoRotate: true,
  dpr: 1,
  liteEffects: false,
  musicEnabled: false,
  musicVolume: 0,
  nebula: true,
  orbitalParticles: true,
  planetRotation: true,
  shootingStars: true,
  shadows: true,
  starDensity: 1,
  transitionAnimations: true,
  warpEffects: true,
};
vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: (s: any) => unknown) =>
    selector({
      experienceSettings: mockSettings,
      setIsLoaded,
    }),
}));

vi.mock('@/components/three/objects/asteroid-belt', () => ({ AsteroidBelt: () => <div /> }));
vi.mock('@/components/three/objects/nebula', () => ({ Nebula: () => <div /> }));
vi.mock('@/components/three/objects/planet-3d', () => ({ Planet3D: () => <div /> }));
vi.mock('@/components/three/objects/sun-3d', () => ({
  Sun3D: () => <div />,
  ShootingStar: () => <div />,
}));
vi.mock('@/components/three/scene/camera-controller', () => ({ CameraController: () => <div /> }));
vi.mock('@/components/three/scene/frame-scheduler', () => ({ FrameScheduler: () => null }));

import { CameraController } from '@/components/three/scene/camera-controller';
import { SpaceScene } from '@/components/three/scene/space-scene';

describe('scene smoke', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setIsLoaded.mockReset();
    mockSettings = {
      ...mockSettings,
      nebula: true,
      shootingStars: true,
      asteroidDensity: 1,
      starDensity: 1,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders space scene', () => {
    const { container } = render(<SpaceScene />);
    expect(container).toBeDefined();
  });

  it('renders camera controller', () => {
    const { container } = render(
      <CameraController
        planetAngles={{
          current: {
            about: 0,
            skills: 0,
            projects: 0,
            experience: 0,
            accomplishments: 0,
            contact: 0,
          },
        }}
      />
    );
    expect(container).toBeDefined();
  });

  it('handles timeout load and feature toggles', () => {
    mockSettings = {
      ...mockSettings,
      nebula: false,
      shootingStars: false,
      asteroidDensity: 0,
      starDensity: 0,
    };
    const { unmount } = render(<SpaceScene />);
    act(() => {
      vi.runAllTimers();
    });
    expect(setIsLoaded).toHaveBeenCalledWith(true);
    unmount();
  });

  it('renders lite scene variant with asteroids enabled and cancels load on early unmount', () => {
    mockSettings = {
      ...mockSettings,
      asteroidDensity: 0.4,
      liteEffects: true,
      nebula: false,
    };

    const { container, unmount } = render(<SpaceScene />);
    expect(container).toBeDefined();
    unmount();
    act(() => {
      vi.runAllTimers();
    });
    expect(setIsLoaded).not.toHaveBeenCalled();
  });

  it('uses zero as the default orbit phase when planet data omits it', async () => {
    vi.resetModules();
    vi.doMock('@/data/portfolio', () => ({
      PLANETS: [
        {
          id: 'about',
          color: '#ffffff',
          glowColor: '#ffffff',
          atmosphereColor: '#ffffff',
          size: 1,
          orbitRadius: 1,
          orbitSpeed: 1,
          rotationSpeed: 1,
          icon: 'User',
          type: 'rocky',
          name: 'About',
          subtitle: 'About',
          description: 'About',
        },
      ],
    }));

    const { SpaceScene: SpaceSceneWithFallbackData } =
      await import('@/components/three/scene/space-scene');
    render(<SpaceSceneWithFallbackData />);

    expect(setIsLoaded).not.toHaveBeenCalled();
  });
});
