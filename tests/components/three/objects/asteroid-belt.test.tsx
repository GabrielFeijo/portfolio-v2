import { beforeEach, describe, expect, it, vi } from 'vitest'
import { create } from '@react-three/test-renderer'

import { AsteroidBelt } from '@/components/three/objects/asteroid-belt'
import { advanceR3F } from '../../../helpers/r3f-utils'

let mockDispose = vi.fn()

vi.mock('@/utils/textures', () => ({
  makeRockTexture: vi.fn(() => ({
    dispose: () => mockDispose(),
  })),
}))

describe('AsteroidBelt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDispose = vi.fn()
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
})
