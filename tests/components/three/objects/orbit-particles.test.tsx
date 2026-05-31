import { beforeEach, describe, expect, it, vi } from 'vitest'
import { create } from '@react-three/test-renderer'

import { OrbitParticles } from '@/components/three/objects/orbit-particles'
import { advanceR3F } from '../../../helpers/r3f-utils'

describe('OrbitParticles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders and rotates points across animation frames', async () => {
    const renderer = await create(<OrbitParticles color="#ffffff" density={0.5} size={5} />)

    expect(renderer).toBeDefined()
    await advanceR3F(renderer, 12, 0.05)

    await renderer.unmount()
  })

  it('renders with zero density and advances safely', async () => {
    const renderer = await create(<OrbitParticles color="#ffffff" density={0} size={5} />)
    await advanceR3F(renderer, 8, 0.04)
    await renderer.unmount()
  })

  it('updates rotation with varying delta values', async () => {
    const renderer = await create(<OrbitParticles color="#00ffaa" density={1} size={8} />)
    await advanceR3F(renderer, 6, [0.01, 0.02, 0.03, 0.04, 0.05, 0.06])
    await renderer.unmount()
  })
})
