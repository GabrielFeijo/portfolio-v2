export const ANIMATION_SETTINGS = {
  loadingDelayMs: 450,
  panelOpenDelayMs: 420,
  warpDurationMs: 420,
  panelSpring: {
    type: 'spring',
    stiffness: 250,
    damping: 32,
    mass: 0.8,
  },
} as const;
