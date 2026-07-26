import { describe, expect, it, vi } from 'vitest';

vi.mock('@react-three/fiber', () => ({
  useThree: (selector: (state: { size: { width: number; height: number } }) => unknown) =>
    selector({ size: { width: 1200, height: 700 } }),
}));

import { useCanvasSize } from '@/hooks/use-canvas-size';

describe('useCanvasSize', () => {
  it('returns renderer size from useThree', () => {
    expect(useCanvasSize()).toEqual({ width: 1200, height: 700 });
  });
});
