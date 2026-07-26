import { PLANETS } from '@/data/portfolio';
import { create } from '@react-three/test-renderer';
import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-three/drei', () => ({
  Html: () => null,
  Sphere: () => null,
  Sparkles: () => null,
  Stars: () => null,
  shaderMaterial: () =>
    function ShaderMaterialMock() {
      return null;
    },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock('zustand/react/shallow', () => ({
  useShallow: (selector: unknown) => selector,
}));

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: (s: any) => unknown) => {
    const state = {
      activePanel: null,
      activePlanet: null,
      openPanel: vi.fn(),
      setActivePlanet: vi.fn(),
      setCursorVariant: vi.fn(),
      setWarpActive: vi.fn(),
      helpOpen: false,
      settingsOpen: false,
      isLoaded: true,
      openHelp: vi.fn(),
      experienceSettings: {
        antialias: true,
        asteroidDensity: 1,
        autoRotate: true,
        dpr: 1,
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
      },
    };
    return selector ? selector(state) : state;
  },
}));

vi.mock('@/hooks/use-planet-interaction', () => ({
  usePlanetInteraction: () => ({
    hovered: false,
    handleClick: vi.fn(),
    handlePointerEnter: vi.fn(),
    handlePointerLeave: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-orbit-animation', () => ({
  useOrbitAnimation: () => new THREE.Vector3(1, 0, 0),
}));

import { AsteroidBelt } from '@/components/three/objects/asteroid-belt';
import { Nebula } from '@/components/three/objects/nebula';
import { OrbitParticles } from '@/components/three/objects/orbit-particles';
import { Planet3D } from '@/components/three/objects/planet-3d';
import { SmallMoon } from '@/components/three/objects/small-moon';
import { ShootingStar, Sun3D } from '@/components/three/objects/sun-3d';

describe('3d objects smoke', () => {
  it('renders asteroid belt', async () => {
    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={5} color="#fff" />
    );
    expect(renderer).toBeDefined();
    await renderer.unmount();
  });

  it('renders nebula', async () => {
    const renderer = await create(<Nebula density={0.5} />);
    expect(renderer).toBeDefined();
    await renderer.unmount();
  });

  it('renders orbit particles', async () => {
    const renderer = await create(<OrbitParticles color="#fff" density={0.5} size={2} />);
    expect(renderer).toBeDefined();
    await renderer.unmount();
  });

  it('renders planet and moon', async () => {
    const renderer = await create(
      <Planet3D
        angleRef={{ current: Object.fromEntries(PLANETS.map((p) => [p.id, 0])) }}
        planet={PLANETS[0]}
      />
    );
    const moonRenderer = await create(
      <SmallMoon color="#fff" lightDir={new THREE.Vector3(1, 0, 0)} size={2} />
    );
    expect(renderer).toBeDefined();
    expect(moonRenderer).toBeDefined();
    await renderer.unmount();
    await moonRenderer.unmount();
  });

  it('renders sun and shooting star', async () => {
    const sunRenderer = await create(<Sun3D />);
    const starRenderer = await create(<ShootingStar />);
    expect(sunRenderer).toBeDefined();
    expect(starRenderer).toBeDefined();
    await sunRenderer.unmount();
    await starRenderer.unmount();
  });
});
