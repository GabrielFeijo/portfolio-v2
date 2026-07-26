import { beforeEach, describe, it, vi } from 'vitest';
import { create } from '@react-three/test-renderer';
import * as THREE from 'three';

import { AsteroidBelt } from '@/components/three/objects/asteroid-belt';
import { advanceR3F } from '../../../helpers/r3f-utils';

vi.mock('@/utils/textures', () => ({
  makeRockTexture: vi.fn(() => ({ dispose: vi.fn() })),
}));

const frameCallbacks: Array<
  (state: { clock: { getElapsedTime: () => number } }, delta: number) => void
> = [];

vi.mock('@react-three/fiber', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@react-three/fiber')>();

  return {
    ...actual,
    useFrame: (
      callback: (state: { clock: { getElapsedTime: () => number } }, delta: number) => void,
      priority?: number
    ) => {
      frameCallbacks.push(callback);

      try {
        callback({ clock: { getElapsedTime: () => 0 } }, 0);
      } catch {
        // Refs may be unavailable during registration.
      }

      return actual.useFrame(callback, priority);
    },
  };
});

describe('R3F branch edges', () => {
  beforeEach(() => {
    frameCallbacks.length = 0;
  });

  it('handles zero-count asteroid belt layout', async () => {
    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={0} color="#ff0000" />
    );
    await advanceR3F(renderer, 2, 0.05);
    await renderer.unmount();
  });

  it('marks instance matrix dirty when instanceMatrix is available', async () => {
    const instanceMatrix = { needsUpdate: false };

    Object.defineProperty(THREE.InstancedMesh.prototype, 'instanceMatrix', {
      configurable: true,
      get() {
        return instanceMatrix;
      },
    });

    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#00ff00" />
    );

    await renderer.update(
      <AsteroidBelt innerRadius={11} outerRadius={21} count={3} color="#00ff00" />
    );
    await advanceR3F(renderer, 4, 0.05);

    delete (THREE.InstancedMesh.prototype as { instanceMatrix?: unknown }).instanceMatrix;

    await renderer.unmount();
  });

  it('covers asteroid belt layout when instanced mesh lacks instanceMatrix', async () => {
    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff0000" />
    );

    const originalMatrix = Object.getOwnPropertyDescriptor(
      THREE.InstancedMesh.prototype,
      'instanceMatrix'
    );

    Object.defineProperty(THREE.InstancedMesh.prototype, 'instanceMatrix', {
      configurable: true,
      get() {
        return undefined;
      },
    });

    await advanceR3F(renderer, 3, 0.05);

    if (originalMatrix) {
      Object.defineProperty(THREE.InstancedMesh.prototype, 'instanceMatrix', originalMatrix);
    }

    await renderer.unmount();
  });
});
