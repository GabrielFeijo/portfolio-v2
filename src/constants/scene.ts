export const SCENE_SETTINGS = {
  background: '#01020a',
  fogNear: 180,
  fogFar: 980,
  primaryStars: {
    radius: 900,
    depth: 260,
    count: 3600,
    factor: 4.2,
    saturation: 0.02,
    speed: 0.12,
  },
  secondaryStars: {
    radius: 520,
    depth: 140,
    count: 900,
    factor: 2.4,
    saturation: 0.18,
    speed: 0.04,
  },
} as const;

export const SCENE_COLORS = {
  lighting: {
    ambient: '#09111f',
    hemisphere: '#8ad8ff',
    ground: '#03050d',
    key: '#6ee7ff',
    fill: '#6d6fff',
  },
  asteroids: {
    inner: '#6b7280',
    outer: '#475569',
  },
  moon: {
    base: '#99aaaa',
  },
  sun: {
    primary: '#fff5d0',
    secondary: '#ff4500',
    halo: '#ff7a1a',
    label: '#ffd67a',
    sparkleWarm: '#fff4d6',
    lightWarm: '#fff1d8',
    lightHot: '#ff5a1f',
    flare: '#ffb800',
  },
  shootingStar: {
    core: '#ffffff',
    trail: '#00d4ff',
  },
  nebula: {
    stars: ['#c1dbff', '#f9fbff', '#8fdcff', '#ffe6b8'],
    cyanCloud: '#4fdfff',
    blueCloud: '#3f67ff',
    amberCloud: '#ffb96b',
    violetCloud: '#7b6dff',
    cyanGlow: '#7ce7ff',
    blueGlow: '#7195ff',
    amberGlow: '#ffbf7a',
    cyanCluster: '#67dfff',
    blueCluster: '#87a8ff',
    violetCluster: '#9fa8ff',
    amberCluster: '#ffbc73',
  },
  warp: {
    stars: ['#ffffff', '#bae6fd', '#0ea5e9', '#f0f9ff'],
    fade: '#0000082e',
  },
} as const;

export const PLANET_TYPE_MAP: Record<string, number> = {
  rocky: 0,
  oceanic: 1,
  lava: 2,
  crystal: 3,
  gas: 4,
  ice: 5,
};
