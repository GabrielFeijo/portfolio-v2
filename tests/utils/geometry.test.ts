import { createStarColors, createStarPositions } from '@/utils/geometry';
import { describe, expect, it } from 'vitest';

describe('geometry utilities', () => {
  it('creates deterministic star positions by seed', () => {
    const a = createStarPositions(5, 100, 10, 42);
    const b = createStarPositions(5, 100, 10, 42);

    expect(Array.from(a)).toEqual(Array.from(b));
    expect(a).toHaveLength(15);
  });

  it('creates star colors with normalized values', () => {
    const colors = createStarColors(4, ['#ffffff', '#00ff00'], 12);
    expect(colors).toHaveLength(12);
    for (const value of colors) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});
