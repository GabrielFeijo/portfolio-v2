import { beforeEach, describe, expect, it, vi } from 'vitest'
import { create } from '@react-three/test-renderer'
import * as THREE from 'three'

import '@/components/three/objects/planet-3d'

import { SmallMoon } from '@/components/three/objects/small-moon'
import { advanceR3F } from '../../../helpers/r3f-utils'

describe('SmallMoon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders and animates group rotation and shader uniforms', async () => {
    const lightDir = new THREE.Vector3(1, 0, 0)
    const renderer = await create(<SmallMoon color="#ffffff" lightDir={lightDir} size={5} />)

    expect(renderer).toBeDefined()
    await advanceR3F(renderer, 20, 0.05)

    await renderer.unmount()
  })

  it('handles multiple advance cycles with different light directions', async () => {
    const lightDir = new THREE.Vector3(1, 1, 1)
    const renderer = await create(<SmallMoon color="#ffaa00" lightDir={lightDir} size={6} />)
    await advanceR3F(renderer, 15, [0.016, 0.032, 0.048])
    await renderer.unmount()
  })
})
