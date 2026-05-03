import { Planet3D } from '@/components/three/objects/planet-3d'
import { PLANETS } from '@/data/portfolio'
import { render, screen } from '@testing-library/react'
import * as THREE from 'three'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let activePanel: string | null = null
let activePlanet: string | null = null
let orbitalParticles = true
let hovered = false

const disposeMock = vi.fn()

vi.mock('zustand/react/shallow', () => ({
  useShallow: (fn: any) => fn,
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock('@react-three/fiber', () => ({
  extend: vi.fn(),
}))

vi.mock('@react-three/drei', () => ({
  Html: ({ children }: any) => <div data-testid="planet-label-wrapper">{children}</div>,
  shaderMaterial: vi.fn(() => class {}),
}))

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: any) => {
    const state = {
      activePanel,
      activePlanet,
      openPanel: vi.fn(),
      setActivePlanet: vi.fn(),
      setCursorVariant: vi.fn(),
      setWarpActive: vi.fn(),
      experienceSettings: {
        planetRotation: true,
        orbitalParticles,
        starDensity: 1,
      },
    }
    return selector ? selector(state) : state
  },
}))

vi.mock('@/hooks/use-planet-interaction', () => ({
  usePlanetInteraction: () => ({
    hovered,
    handleClick: vi.fn(),
    handlePointerEnter: vi.fn(),
    handlePointerLeave: vi.fn(),
  }),
}))

vi.mock('@/hooks/use-orbit-animation', () => ({
  useOrbitAnimation: () => new THREE.Vector3(1, 0, 0),
}))

vi.mock('@/utils/textures', () => ({
  makeRingTexture: vi.fn(() => ({ dispose: disposeMock })),
}))

vi.mock('@/components/three/objects/orbit-particles', () => ({
  OrbitParticles: () => <div data-testid="orbit-particles" />,
}))

vi.mock('@/components/three/objects/small-moon', () => ({
  SmallMoon: () => <div data-testid="small-moon" />,
}))

describe('Planet3D', () => {
  beforeEach(() => {
    activePanel = null
    activePlanet = null
    orbitalParticles = true
    hovered = false
    disposeMock.mockClear()
  })

  it('renders label when panel is not active', () => {
    const planet = PLANETS[0]
    render(<Planet3D angleRef={{ current: { [planet.id]: 0 } }} planet={planet} />)
    expect(screen.getByTestId('planet-label-wrapper')).toBeInTheDocument()
    expect(screen.getByText(`planets.${planet.id}.name`)).toBeInTheDocument()
  })

  it('hides label when a panel is active', () => {
    const planet = PLANETS[0]
    activePanel = 'about'
    render(<Planet3D angleRef={{ current: { [planet.id]: 0 } }} planet={planet} />)
    expect(screen.queryByTestId('planet-label-wrapper')).toBeNull()
  })

  it('renders rings and disposes texture on unmount', () => {
    const ringPlanet = PLANETS.find((p) => p.hasRings)!
    const { unmount } = render(
      <Planet3D angleRef={{ current: { [ringPlanet.id]: 0 } }} planet={ringPlanet} />
    )
    unmount()
    expect(disposeMock).toHaveBeenCalled()
  })

  it('renders moon and orbital particles when active', () => {
    const bigPlanet = PLANETS.find((p) => p.size > 3)!
    activePlanet = bigPlanet.id
    orbitalParticles = true
    render(<Planet3D angleRef={{ current: { [bigPlanet.id]: 0 } }} planet={bigPlanet} />)
    expect(screen.getByTestId('small-moon')).toBeInTheDocument()
    expect(screen.getByTestId('orbit-particles')).toBeInTheDocument()
  })

  it('does not render orbital particles when disabled', () => {
    const bigPlanet = PLANETS.find((p) => p.size > 3)!
    activePlanet = bigPlanet.id
    orbitalParticles = false
    render(<Planet3D angleRef={{ current: { [bigPlanet.id]: 0 } }} planet={bigPlanet} />)
    expect(screen.queryByTestId('orbit-particles')).toBeNull()
  })

  it('applies hovered label class branch', () => {
    const planet = PLANETS[0]
    hovered = true
    render(<Planet3D angleRef={{ current: { [planet.id]: 0 } }} planet={planet} />)
    expect(document.querySelector('.planet-label-hovered')).not.toBeNull()
  })

  it('applies active label class branch', () => {
    const planet = PLANETS[0]
    activePlanet = planet.id

    render(<Planet3D angleRef={{ current: { [planet.id]: 0 } }} planet={planet} />)

    expect(document.querySelector('.planet-label-active')).not.toBeNull()
  })

  it('falls back for unknown planet material type and missing ring color', () => {
    const planet = {
      ...PLANETS.find((p) => p.hasRings)!,
      ringColor: undefined,
      type: 'unknown',
    } as any

    render(<Planet3D angleRef={{ current: { [planet.id]: 0 } }} planet={planet} />)

    expect(screen.getByTestId('planet-label-wrapper')).toBeInTheDocument()
  })
})
