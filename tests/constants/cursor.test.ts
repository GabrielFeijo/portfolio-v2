import { CURSOR_COLORS, CURSOR_VARIANTS } from '@/constants/cursor';
import { describe, expect, it } from 'vitest';

describe('cursor constants', () => {
  it('contains the same variants for size and colors', () => {
    expect(Object.keys(CURSOR_VARIANTS).sort()).toEqual(Object.keys(CURSOR_COLORS).sort());
  });

  it('uses positive dimensions and opacity in range', () => {
    Object.values(CURSOR_VARIANTS).forEach((variant) => {
      expect(variant.width).toBeGreaterThan(0);
      expect(variant.height).toBeGreaterThan(0);
      expect(variant.borderWidth).toBeGreaterThan(0);
      expect(variant.opacity).toBeGreaterThan(0);
      expect(variant.opacity).toBeLessThanOrEqual(1);
    });
  });
});
