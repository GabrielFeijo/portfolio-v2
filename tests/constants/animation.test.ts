import { ANIMATION_SETTINGS } from '@/constants/animation';
import { describe, expect, it } from 'vitest';

describe('ANIMATION_SETTINGS', () => {
  it('exposes expected timing values', () => {
    expect(ANIMATION_SETTINGS.loadingDelayMs).toBe(450);
    expect(ANIMATION_SETTINGS.panelOpenDelayMs).toBe(420);
    expect(ANIMATION_SETTINGS.warpDurationMs).toBe(420);
  });

  it('contains spring animation params', () => {
    expect(ANIMATION_SETTINGS.panelSpring).toMatchObject({
      type: 'spring',
      stiffness: 250,
      damping: 32,
      mass: 0.8,
    });
  });
});
