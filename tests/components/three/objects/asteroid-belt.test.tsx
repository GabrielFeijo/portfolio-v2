import { AsteroidBelt } from '@/components/three/objects/asteroid-belt'
import { act, render } from '@testing-library/react'
import { forwardRef, useImperativeHandle } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockMesh, refState } = vi.hoisted(() => ({
  mockMesh: {
    setMatrixAt: vi.fn(),
    instanceMatrix: { needsUpdate: false },
    geometry: { dispose: vi.fn() },
    material: { dispose: vi.fn() },
  },
  refState: { keepNull: false, lastRef: null as null | { current: any } },
}))

vi.mock('@/utils/textures', () => ({
  makeRockTexture: vi.fn(() => ({
    dispose: vi.fn(),
  })),
}))

const mockFrameCallbacks: any[] = []
vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: any) => {
    mockFrameCallbacks.push(cb)
  },
}))

const MockThreeObject = forwardRef(({ children, type, ...props }: any, ref) => {
  if (!refState.keepNull) {
    useImperativeHandle(ref, () => mockMesh)
  }
  return <div data-testid={type}>{children}</div>
})

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useRef: (initial: any) => {
      if (initial === null) {
        if (refState.keepNull) {
          const lastRef = { current: null }
          refState.lastRef = lastRef
          return lastRef
        }
        return {
          get current() {
            return mockMesh
          },
          set current(_) {},
        }
      }
      return (actual as any).useRef(initial)
    },
    createElement: (type: any, props: any, ...children: any) => {
      if (type === 'instancedMesh') {
        const nextProps = refState.keepNull ? { type } : { ...props, type }
        return (actual as any).createElement(MockThreeObject, nextProps, ...children)
      }
      if (
        typeof type === 'string' &&
        [
          'dodecahedronGeometry',
          'meshStandardMaterial',
          'octahedronGeometry',
          'icosahedronGeometry',
          'mesh',
          'group',
        ].includes(type)
      ) {
        return (actual as any).createElement('div', { 'data-testid': type }, ...children)
      }
      return (actual as any).createElement(type, props, ...children)
    },
  }
})

describe('AsteroidBelt', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFrameCallbacks.length = 0
    refState.keepNull = false
    refState.lastRef = null
  })

  it('renders and runs frame loop', async () => {
    render(<AsteroidBelt innerRadius={10} outerRadius={20} count={10} color="#ff0000" />)

    expect(mockMesh.setMatrixAt).toHaveBeenCalled()
    expect(mockFrameCallbacks.length).toBeGreaterThan(0)

    await act(async () => {
      mockFrameCallbacks.forEach((cb) => {
        try {
          cb({}, 0.016)
        } catch (e) {}
      })
    })
    expect(mockMesh.setMatrixAt).toHaveBeenCalled()
  })

  it('unmounts and disposes texture', () => {
    const { unmount } = render(
      <AsteroidBelt innerRadius={10} outerRadius={20} count={10} color="#ff0000" />
    )
    unmount()
  })

  it('skips initialization and animation when the instanced mesh ref is missing', () => {
    refState.keepNull = true
    render(<AsteroidBelt innerRadius={10} outerRadius={20} count={2} color="#ff0000" />)
    if (refState.lastRef) refState.lastRef.current = null

    expect(mockMesh.setMatrixAt).not.toHaveBeenCalled()

    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 0.016))
    })

    expect(mockMesh.setMatrixAt).not.toHaveBeenCalled()
  })
})
