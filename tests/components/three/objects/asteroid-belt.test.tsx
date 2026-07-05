import { create } from '@react-three/test-renderer'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AsteroidBelt } from '@/components/three/objects/asteroid-belt'
import { advanceR3F } from '../../../helpers/r3f-utils'

let mockDispose = vi.fn()
const mockMeshRef = { current: null as any }
const effectCleanups: Array<() => void> = []

function flushEffectCleanups() {
  while (effectCleanups.length > 0) {
    effectCleanups.pop()?.()
  }
}

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react')
  return {
    ...actual,
    useEffect: (effect: () => void | (() => void)) => {
      const cleanup = effect()
      if (typeof cleanup === 'function') {
        effectCleanups.push(cleanup)
      }
    },
    useRef: (initial: unknown) => {
      if (initial === null) {
        return mockMeshRef
      }
      return actual.useRef(initial)
    },
  }
})

vi.mock('@/utils/textures', () => ({
  makeRockTexture: vi.fn(() => ({
    dispose: () => mockDispose(),
  })),
}))

describe('AsteroidBelt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDispose = vi.fn()
    flushEffectCleanups()
  })

  it('renders, advances frames, and updates instanced matrices', async () => {
    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={5} color="#ff0000" />
    )

    expect(renderer).toBeDefined()
    await advanceR3F(renderer, 10, 0.05)

    await renderer.unmount()
  })

  it('disposes rock texture on unmount', async () => {
    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={5} color="#ff0000" />
    )
    await advanceR3F(renderer, 2)
    await renderer.unmount()
    flushEffectCleanups()
    expect(mockDispose).toHaveBeenCalled()
  })

  it('repositions asteroids when props change', async () => {
    const renderer = await create(
      <AsteroidBelt innerRadius={5} outerRadius={10} count={3} color="#00ff00" />
    )
    await advanceR3F(renderer, 3)

    await renderer.update(
      <AsteroidBelt innerRadius={8} outerRadius={15} count={4} color="#0000ff" />
    )
    await advanceR3F(renderer, 3)

    await renderer.unmount()
  })

  it('handles missing instanceMatrix without throwing', async () => {
    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff8800" />
    )

    const meshNode = mockMeshRef.current as any
    const originalInstanceMatrix = meshNode.instanceMatrix
    meshNode.setMatrixAt = vi.fn()
    meshNode.instanceMatrix = null

    await renderer.update(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff8800" />
    )
    await advanceR3F(renderer, 1, 0.05)

    meshNode.instanceMatrix = originalInstanceMatrix
    await renderer.unmount()
  })
})
