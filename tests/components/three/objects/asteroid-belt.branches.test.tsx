import { beforeEach, describe, it, vi } from 'vitest'
import { create } from '@react-three/test-renderer'

import { AsteroidBelt } from '@/components/three/objects/asteroid-belt'
import { advanceR3F } from '../../../helpers/r3f-utils'

vi.mock('@/utils/textures', () => ({
  makeRockTexture: vi.fn(() => ({ dispose: vi.fn() })),
}))

vi.mock('react', async (importOriginal) => {
  const React = await importOriginal<typeof import('react')>()

  return {
    ...React,
    useRef: () => {
      const blockedRef = { blocked: true }

      return Object.defineProperty(blockedRef, 'current', {
        configurable: true,
        get: () => null,
        set: () => undefined,
      })
    },
  }
})

describe('AsteroidBelt ref guards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('skips matrix updates when the instanced mesh ref is unavailable', async () => {
    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff0000" />
    )

    await advanceR3F(renderer, 2, 0.05)
    await renderer.unmount()
  })
})
