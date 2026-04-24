export const ANIMATION_SETTINGS = {
  loadingDelayMs: 2500,
  panelOpenDelayMs: 800,
  warpDurationMs: 800,
  panelSpring: {
    type: 'spring',
    stiffness: 250,
    damping: 32,
    mass: 0.8,
  },
} as const
