import { PLANETS } from '@/data/portfolio'
import { render } from '@testing-library/react'
import React from 'react'
import * as THREE from 'three'
import { describe, expect, it, vi } from 'vitest'

const frameCallbacks: Array<(state: { clock: { getElapsedTime: () => number } }, delta: number) => void> = []

vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: (state: { clock: { getElapsedTime: () => number } }, delta: number) => void) => frameCallbacks.push(cb),
  extend: vi.fn(),
  useThree: (selector: (s: { size: { width: number; height: number } }) => unknown) => selector({ size: { width: 1200, height: 800 } }),
}))

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Sphere: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Sparkles: () => <div data-testid="sparkles" />,
  Stars: () => <div data-testid="stars" />,
  shaderMaterial: () => function ShaderMaterialMock() { return null },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock('zustand/react/shallow', () => ({
  useShallow: (selector: unknown) => selector,
}))

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: (s: any) => unknown) => {
    const state = {
    activePanel: null,
    activePlanet: null,
    openPanel: vi.fn(),
    setActivePlanet: vi.fn(),
    setCursorVariant: vi.fn(),
    setWarpActive: vi.fn(),
    helpOpen: false,
    settingsOpen: false,
    isLoaded: true,
    openHelp: vi.fn(),
    experienceSettings: {
      antialias: true,
      asteroidDensity: 1,
      autoRotate: true,
      dpr: 1,
      musicEnabled: false,
      musicVolume: 0,
      nebula: true,
      orbitalParticles: true,
      planetRotation: true,
      shootingStars: true,
      shadows: true,
      starDensity: 1,
      transitionAnimations: true,
      warpEffects: true,
    },
  }
    return selector ? selector(state) : state
  },
}))

vi.mock('@/hooks/use-planet-interaction', () => ({
  usePlanetInteraction: () => ({
    hovered: false,
    handleClick: vi.fn(),
    handlePointerEnter: vi.fn(),
    handlePointerLeave: vi.fn(),
  }),
}))

vi.mock('@/hooks/use-orbit-animation', () => ({
  useOrbitAnimation: () => new THREE.Vector3(1, 0, 0),
}))

import { AsteroidBelt } from '@/components/three/objects/asteroid-belt'
import { Nebula } from '@/components/three/objects/nebula'
import { OrbitParticles } from '@/components/three/objects/orbit-particles'
import { Planet3D } from '@/components/three/objects/planet-3d'
import { SmallMoon } from '@/components/three/objects/small-moon'
import { ShootingStar, Sun3D } from '@/components/three/objects/sun-3d'

describe('3d objects smoke', () => {
  it('renders asteroid belt', () => {
    render(<AsteroidBelt innerRadius={10} outerRadius={20} count={5} color="#fff" />)
    expect(true).toBe(true)
  })

  it('renders nebula', () => {
    render(<Nebula density={0.5} />)
    expect(true).toBe(true)
  })

  it('renders orbit particles', () => {
    render(<OrbitParticles color="#fff" density={0.5} size={2} />)
    expect(true).toBe(true)
  })

  it('renders planet and moon', () => {
    render(<Planet3D angleRef={{ current: Object.fromEntries(PLANETS.map((p) => [p.id, 0])) }} planet={PLANETS[0]} />)
    render(<SmallMoon color="#fff" lightDir={new THREE.Vector3(1, 0, 0)} size={2} />)
    expect(true).toBe(true)
  })

  it('renders sun and shooting star', () => {
    render(<Sun3D />)
    render(<ShootingStar />)
    expect(true).toBe(true)
  })
})
