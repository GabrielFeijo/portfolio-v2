import { beforeEach, describe, expect, it, vi } from 'vitest';
import { create } from '@react-three/test-renderer';

import { Nebula } from '@/components/three/objects/nebula';
import { advanceR3F } from '../../../helpers/r3f-utils';

const disposeMock = vi.fn();

vi.mock('@/utils/geometry', () => ({
  createStarPositions: vi.fn(() => new Float32Array(30)),
  createStarColors: vi.fn(() => new Float32Array(30)),
}));

vi.mock('@/utils/textures', () => ({
  createCloudTexture: vi.fn(() => ({ dispose: disposeMock })),
  createGlowTexture: vi.fn(() => ({ dispose: disposeMock })),
  createRandom: vi.fn((seed: number) => {
    let value = seed;
    return () => {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }),
}));

describe('Nebula', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders star shells and nebula clusters with animated frames', async () => {
    const renderer = await create(<Nebula density={0.5} />);

    expect(renderer).toBeDefined();
    await advanceR3F(renderer, 15, 0.05);

    await renderer.unmount();
  });

  it('disposes textures on unmount', async () => {
    const renderer = await create(<Nebula density={0.5} />);
    await advanceR3F(renderer, 5);
    await renderer.unmount();
    expect(disposeMock).toHaveBeenCalled();
  });

  it('renders with zero density and advances safely', async () => {
    const renderer = await create(<Nebula density={0} />);
    await advanceR3F(renderer, 8, 0.02);
    await renderer.unmount();
  });

  it('renders with high density for more cloud layers', async () => {
    const renderer = await create(<Nebula density={1.5} />);
    await advanceR3F(renderer, 10, 0.03);
    await renderer.unmount();
  });
});
