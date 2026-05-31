import { describe, expect, it, vi } from 'vitest'
import { create } from '@react-three/test-renderer'

import { AsteroidBelt } from '@/components/three/objects/asteroid-belt'
import { advanceR3F } from '../../../helpers/r3f-utils'

vi.mock('@/utils/textures', () => ({
  makeRockTexture: vi.fn(() => ({ dispose: vi.fn() })),
}))

const fakeInstancedMesh = {
  setMatrixAt: vi.fn(),
  instanceMatrix: { needsUpdate: false },
}

vi.mock('react', async (importOriginal) => {
  const React = await importOriginal<typeof import('react')>()

  return {
    ...React,
    useRef: () => ({ current: fakeInstancedMesh }),
  }
})

describe('AsteroidBelt instance matrix branch', () => {
  it('marks instance matrix dirty when mesh ref is wired to a matrix', async () => {
    fakeInstancedMesh.instanceMatrix = { needsUpdate: false }

    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff0000" />
    )

    await advanceR3F(renderer, 4, 0.05)

    expect(fakeInstancedMesh.instanceMatrix.needsUpdate).toBe(true)

    await renderer.unmount()
  })

  it('skips matrix dirty flag when instance matrix is unavailable', async () => {
    fakeInstancedMesh.instanceMatrix = undefined as unknown as { needsUpdate: boolean }

    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff0000" />
    )

    await advanceR3F(renderer, 4, 0.05)

    expect(fakeInstancedMesh.setMatrixAt).toHaveBeenCalled()

    await renderer.unmount()
  })
})
