import { describe, expect, it, vi } from 'vitest'
import { create } from '@react-three/test-renderer'

import { AsteroidBelt } from '@/components/three/objects/asteroid-belt'
import { advanceR3F } from '../../../helpers/r3f-utils'

vi.mock('@/utils/textures', () => ({
  makeRockTexture: vi.fn(() => ({ dispose: vi.fn() })),
}))

const mockMeshRef = { current: null as any }

vi.mock('react', async (importOriginal) => {
  const React = await importOriginal<typeof import('react')>()

  return {
    ...React,
    useRef: (initial: unknown) => {
      if (initial === null) {
        return mockMeshRef
      }

      return React.useRef(initial)
    },
  }
})

describe('AsteroidBelt instance matrix branch', () => {
  it('marks instance matrix dirty when mesh ref is wired to a matrix', async () => {
    mockMeshRef.current = null

    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff0000" />
    )

    const meshNode = mockMeshRef.current as any
    meshNode.instanceMatrix = { needsUpdate: false }

    await advanceR3F(renderer, 4, 0.05)

    expect(meshNode.instanceMatrix.needsUpdate).toBe(true)

    await renderer.unmount()
  })

  it('throttles instance matrix rewrites between animation frames', async () => {
    mockMeshRef.current = null

    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff0000" />
    )

    const meshNode = mockMeshRef.current as any
    meshNode.setMatrixAt = vi.fn()
    meshNode.instanceMatrix = { needsUpdate: false }

    await advanceR3F(renderer, 1, 0.01)
    expect(meshNode.setMatrixAt).not.toHaveBeenCalled()

    await advanceR3F(renderer, 1, 0.03)
    expect(meshNode.setMatrixAt).toHaveBeenCalled()

    await renderer.unmount()
  })

  it('skips matrix dirty flag when instance matrix is unavailable', async () => {
    mockMeshRef.current = null

    const renderer = await create(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff0000" />
    )

    const meshNode = mockMeshRef.current as any
    meshNode.setMatrixAt = vi.fn()
    meshNode.instanceMatrix = undefined as unknown as { needsUpdate: boolean }

    await advanceR3F(renderer, 4, 0.05)

    expect(meshNode.setMatrixAt).toHaveBeenCalled()

    await renderer.unmount()
  })
})
