import { beforeEach, describe, expect, it, vi } from 'vitest'
import { create } from '@react-three/test-renderer'

import { ShootingStar } from '@/components/three/objects/sun-3d'
import { advanceR3F } from '../../../helpers/r3f-utils'

const managedRefs: Array<{ current: unknown }> = []
const frameCallbacks: Array<(state: { clock: { getElapsedTime: () => number } }, delta: number) => void> =
  []

vi.mock('react', async (importOriginal) => {
  const React = await importOriginal<typeof import('react')>()

  return {
    ...React,
    useRef: (initialValue: unknown) => {
      const ref = { current: initialValue }
      managedRefs.push(ref)
      return ref
    },
  }
})

vi.mock('@react-three/fiber', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@react-three/fiber')>()

  return {
    ...actual,
    useFrame: (
      callback: (state: { clock: { getElapsedTime: () => number } }, delta: number) => void,
      priority?: number
    ) => {
      frameCallbacks.push(callback)

      try {
        callback({ clock: { getElapsedTime: () => 0 } }, 0)
      } catch {
        // Refs may be unavailable during registration.
      }

      return actual.useFrame(callback, priority)
    },
  }
})

function getShootingStarRefs() {
  const trailRef = managedRefs[managedRefs.length - 1]
  const groupRef = managedRefs[managedRefs.length - 2]
  expect(groupRef).toBeDefined()
  expect(trailRef).toBeDefined()
  return { groupRef: groupRef!, trailRef: trailRef! }
}

describe('ShootingStar branch edges', () => {
  beforeEach(() => {
    managedRefs.length = 0
    frameCallbacks.length = 0
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  it('scales the trail mesh during the visible window', async () => {
    const renderer = await create(<ShootingStar />)
    const { groupRef, trailRef } = getShootingStarRefs()
    const trailScaleSet = vi.fn()

    groupRef.current = {
      visible: true,
      position: {
        copy: vi.fn().mockReturnThis(),
        addScaledVector: vi.fn(),
      },
    }
    trailRef.current = {
      scale: {
        set: trailScaleSet,
      },
    }

    const callback = frameCallbacks[frameCallbacks.length - 1]
    expect(callback).toBeTypeOf('function')

    callback!({ clock: { getElapsedTime: () => 1 } }, 0.08)

    expect(trailScaleSet).toHaveBeenCalled()

    await renderer.unmount()
    vi.restoreAllMocks()
  })

  it('continues animating when trail ref is unavailable', async () => {
    const renderer = await create(<ShootingStar />)
    const { groupRef, trailRef } = getShootingStarRefs()

    groupRef.current = {
      visible: true,
      position: {
        copy: vi.fn().mockReturnThis(),
        addScaledVector: vi.fn(),
      },
    }
    trailRef.current = null

    const callback = frameCallbacks[frameCallbacks.length - 1]
    expect(callback).toBeTypeOf('function')

    callback!({ clock: { getElapsedTime: () => 1 } }, 0.08)

    await renderer.unmount()
    vi.restoreAllMocks()
  })

  it('hides the group after the visible window ends', async () => {
    const renderer = await create(<ShootingStar />)
    const { groupRef } = getShootingStarRefs()

    groupRef.current = {
      visible: true,
      position: {
        copy: vi.fn().mockReturnThis(),
        addScaledVector: vi.fn(),
      },
    }

    const callback = frameCallbacks[frameCallbacks.length - 1]
    expect(callback).toBeTypeOf('function')

    await advanceR3F(renderer, 250, 0.1)
    callback!({ clock: { getElapsedTime: () => 10 } }, 0.1)

    expect((groupRef.current as { visible: boolean }).visible).toBe(false)

    await renderer.unmount()
    vi.restoreAllMocks()
  })
})
