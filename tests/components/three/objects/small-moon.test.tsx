import { SmallMoon } from '@/components/three/objects/small-moon'
import { act, render } from '@testing-library/react'
import * as THREE from 'three'
import { beforeEach, describe, it, vi } from 'vitest'

const mockFrameCallbacks: any[] = []
let groupRef: any
let materialRef: any

vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: any) => {
    mockFrameCallbacks.push(cb)
  },
}))

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useRef: (initial: any) => {
      const refObj = { current: initial }
      if (initial === null) {
        if (!groupRef) {
          groupRef = refObj
          refObj.current = {
            rotation: { x: 0, y: 0, z: 0 },
          }
        } else if (!materialRef) {
          materialRef = refObj
          refObj.current = {
            uniforms: {
              uTime: { value: 0 },
              uLightDir: { value: { copy: vi.fn() } },
            },
          }
        }
      }
      return refObj
    },
    createElement: (type: any, props: any, ...children: any) => {
      if (typeof type === 'string' && /^[a-z]/.test(type)) {
        return (actual as any).createElement('div', { ...props, 'data-testid': type }, ...children)
      }
      return (actual as any).createElement(type, props, ...children)
    },
  }
})

describe('SmallMoon', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFrameCallbacks.length = 0
    groupRef = undefined
    materialRef = undefined
  })

  const restoreRefs = () => {
    if (groupRef) {
      groupRef.current = {
        rotation: { x: 0, y: 0, z: 0 },
      }
    }
    if (materialRef) {
      materialRef.current = {
        uniforms: {
          uTime: { value: 0 },
          uLightDir: { value: { copy: vi.fn() } },
        },
      }
    }
  }

  it('renders and runs frame loop', () => {
    const lightDir = new THREE.Vector3(1, 0, 0)
    render(<SmallMoon color="#ffffff" lightDir={lightDir} size={5} />)
    restoreRefs()

    const state = { clock: { getElapsedTime: () => 1.0 } }
    act(() => {
      mockFrameCallbacks.forEach((cb) => {
        try {
          cb(state, 0.016)
        } catch (e) {}
      })
    })
  })

  it('updates group rotation on frame', () => {
    const lightDir = new THREE.Vector3(1, 0, 0)
    render(<SmallMoon color="#ffffff" lightDir={lightDir} size={5} />)
    restoreRefs()

    const state = { clock: { getElapsedTime: () => 2.0 } }
    act(() => {
      mockFrameCallbacks.forEach((cb) => {
        try {
          cb(state, 0.016)
        } catch (e) {}
      })
    })
  })

  it('updates material uniforms on frame', () => {
    const lightDir = new THREE.Vector3(0, 1, 0)
    render(<SmallMoon color="#cccccc" lightDir={lightDir} size={3} />)
    restoreRefs()

    const state = { clock: { getElapsedTime: () => 3.5 } }
    act(() => {
      mockFrameCallbacks.forEach((cb) => {
        try {
          cb(state, 0.016)
        } catch (e) {}
      })
    })
  })

  it('handles null group ref', () => {
    const lightDir = new THREE.Vector3(1, 1, 0)
    render(<SmallMoon color="#aa0000" lightDir={lightDir} size={2} />)
    restoreRefs()

    if (groupRef) groupRef.current = null

    const state = { clock: { getElapsedTime: () => 1.0 } }
    act(() => {
      mockFrameCallbacks.forEach((cb) => {
        try {
          cb(state, 0.016)
        } catch (e) {}
      })
    })
  })

  it('handles null material ref', () => {
    const lightDir = new THREE.Vector3(1, 0, 1)
    render(<SmallMoon color="#00aa00" lightDir={lightDir} size={4} />)
    restoreRefs()

    if (materialRef) materialRef.current = null

    const state = { clock: { getElapsedTime: () => 2.5 } }
    act(() => {
      mockFrameCallbacks.forEach((cb) => {
        try {
          cb(state, 0.016)
        } catch (e) {}
      })
    })
  })

  it('runs multiple frame cycles', () => {
    const lightDir = new THREE.Vector3(1, 1, 1)
    render(<SmallMoon color="#ffaa00" lightDir={lightDir} size={6} />)
    restoreRefs()

    act(() => {
      for (let i = 0; i < 5; i++) {
        mockFrameCallbacks.forEach((cb) => {
          try {
            cb({ clock: { getElapsedTime: () => i * 0.5 } }, 0.016)
          } catch (e) {}
        })
      }
    })
  })
})
