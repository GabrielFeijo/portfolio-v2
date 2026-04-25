export const SCENE_SETTINGS = {
  background: '#01020a',
  fogNear: 180,
  fogFar: 980,
  primaryStars: {
    radius: 900,
    depth: 260,
    count: 9000,
    factor: 4.2,
    saturation: 0.02,
    speed: 0.12,
  },
  secondaryStars: {
    radius: 520,
    depth: 140,
    count: 2600,
    factor: 2.4,
    saturation: 0.18,
    speed: 0.04,
  },
} as const

export const PLANET_TYPE_MAP: Record<string, number> = {
  rocky: 0,
  oceanic: 1,
  lava: 2,
  crystal: 3,
  gas: 4,
  ice: 5,
}
