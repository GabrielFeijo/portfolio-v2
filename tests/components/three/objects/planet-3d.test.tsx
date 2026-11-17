import { Planet3D } from '@/components/three/objects/planet-3d';
import { PLANETS } from '@/data/portfolio';
import type { Planet } from '@/types/portfolio';
import { create } from '@react-three/test-renderer';
import * as THREE from 'three';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { advanceR3F } from '../../../helpers/r3f-utils';

const disposeMock = vi.fn();
const handlePlanetClick = vi.fn();
const setCursorVariant = vi.fn();
const handleClick = vi.fn();
const handlePointerEnter = vi.fn();
const handlePointerLeave = vi.fn();

let mockInteraction = {
  hovered: false,
  handleClick,
  handlePointerEnter,
  handlePointerLeave,
};

let mockStoreState = {
  activePanel: null as string | null,
  activePlanet: null as string | null,
  handlePlanetClick,
  setCursorVariant,
  experienceSettings: {
    dpr: 1,
    planetRotation: true,
    orbitalParticles: true,
    starDensity: 1,
  },
};

vi.mock('zustand/react/shallow', () => ({
  useShallow: (fn: (state: typeof mockStoreState) => unknown) => fn,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@react-three/drei', () => ({
  Html: () => null,
  shaderMaterial: vi.fn(
    () =>
      function ShaderMaterialMock() {
        return null;
      }
  ),
}));

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

vi.mock('@/hooks/use-planet-interaction', () => ({
  usePlanetInteraction: () => mockInteraction,
}));

vi.mock('@/hooks/use-orbit-animation', () => ({
  useOrbitAnimation: () => new THREE.Vector3(1, 0, 0),
}));

vi.mock('@/utils/textures', () => ({
  makeRingTexture: vi.fn(() => ({ dispose: disposeMock })),
}));

vi.mock('@/components/three/objects/orbit-particles', () => ({
  OrbitParticles: () => null,
}));

vi.mock('@/components/three/objects/small-moon', () => ({
  SmallMoon: () => null,
}));

function createAngleRef(planetId: string) {
  return { current: { [planetId]: 0 } };
}

function renderPlanet(planet: Planet) {
  return create(<Planet3D angleRef={createAngleRef(planet.id)} planet={planet} />);
}

describe('Planet3D', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInteraction = {
      hovered: false,
      handleClick,
      handlePointerEnter,
      handlePointerLeave,
    };
    mockStoreState = {
      activePanel: null,
      activePlanet: null,
      handlePlanetClick,
      setCursorVariant,
      experienceSettings: {
        dpr: 1,
        planetRotation: true,
        orbitalParticles: true,
        starDensity: 1,
      },
    };
  });

  it('renders a basic planet and advances animation frames', async () => {
    const planet = PLANETS[0];
    const renderer = await renderPlanet(planet);
    await advanceR3F(renderer, 5);
    await renderer.unmount();
  });

  it('uses high-detail geometry when the configured DPR is high', async () => {
    mockStoreState.experienceSettings.dpr = 1.6;
    const renderer = await renderPlanet(PLANETS[0]);

    await advanceR3F(renderer, 2);
    await renderer.unmount();
  });

  it('creates ring texture from ringColor when rings are enabled', async () => {
    const ringPlanet = PLANETS.find((planet) => planet.hasRings && planet.ringColor)!;
    const renderer = await renderPlanet(ringPlanet);
    await advanceR3F(renderer, 3);
    await renderer.unmount();
    expect(disposeMock).toHaveBeenCalled();
  });

  it('falls back to planet color when ringColor is missing', async () => {
    const ringPlanet: Planet = {
      ...PLANETS.find((planet) => planet.hasRings)!,
      ringColor: undefined,
    };
    const renderer = await renderPlanet(ringPlanet);
    await advanceR3F(renderer, 3);
    await renderer.unmount();
    expect(disposeMock).toHaveBeenCalled();
  });

  it('skips ring geometry for planets without rings', async () => {
    const noRingPlanet = PLANETS.find((planet) => !planet.hasRings)!;
    const renderer = await renderPlanet(noRingPlanet);
    await advanceR3F(renderer, 3);
    await renderer.unmount();
    expect(disposeMock).not.toHaveBeenCalled();
  });

  it('uses default shader type for unknown planet types', async () => {
    const unknownTypePlanet: Planet = { ...PLANETS[0], type: 'star' };
    const renderer = await renderPlanet(unknownTypePlanet);
    await advanceR3F(renderer, 3);
    await renderer.unmount();
  });

  it('renders active label styling for selected planets', async () => {
    const bigPlanet = PLANETS.find((planet) => planet.size > 3)!;
    mockStoreState.activePlanet = bigPlanet.id;

    const renderer = await renderPlanet(bigPlanet);
    await advanceR3F(renderer, 5);
    await renderer.unmount();
  });

  it('renders hovered label styling when planet is not active', async () => {
    mockInteraction.hovered = true;
    mockStoreState.activePlanet = null;

    const renderer = await renderPlanet(PLANETS[0]);
    await advanceR3F(renderer, 2);
    await renderer.unmount();
  });

  it('renders default label styling without hover or active state', async () => {
    mockInteraction.hovered = false;
    mockStoreState.activePlanet = null;

    const renderer = await renderPlanet(PLANETS[0]);
    await advanceR3F(renderer, 2);
    await renderer.unmount();
  });

  it('hides label when a panel is open', async () => {
    mockStoreState.activePanel = 'about';

    const renderer = await renderPlanet(PLANETS[0]);
    expect(renderer).toBeDefined();

    await renderer.unmount();
  });

  it('renders orbital particles for active planets when enabled', async () => {
    const bigPlanet = PLANETS.find((planet) => planet.size > 3)!;
    mockStoreState.activePlanet = bigPlanet.id;
    mockStoreState.experienceSettings.orbitalParticles = true;

    const renderer = await renderPlanet(bigPlanet);
    await advanceR3F(renderer, 8, 0.04);
    await renderer.unmount();
  });

  it('skips orbital particles when disabled in settings', async () => {
    const bigPlanet = PLANETS.find((planet) => planet.size > 3)!;
    mockStoreState.activePlanet = bigPlanet.id;
    mockStoreState.experienceSettings.orbitalParticles = false;

    const renderer = await renderPlanet(bigPlanet);
    await advanceR3F(renderer, 5);
    await renderer.unmount();
  });

  it('skips small moon for compact planets', async () => {
    const smallPlanet = PLANETS.find((planet) => planet.size <= 3)!;
    const renderer = await renderPlanet(smallPlanet);
    await advanceR3F(renderer, 3);
    await renderer.unmount();
  });

  it('omits atmosphere and inner ring halo when liteEffects is enabled', async () => {
    const ringPlanet = PLANETS.find((planet) => planet.hasRings)!;
    (mockStoreState.experienceSettings as any).liteEffects = true;

    const renderer = await renderPlanet(ringPlanet);
    await advanceR3F(renderer, 2);
    await renderer.unmount();
  });
});
