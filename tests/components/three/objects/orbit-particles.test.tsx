import { OrbitParticles } from '@/components/three/objects/orbit-particles'
import { act, render } from '@testing-library/react'
import { forwardRef, useImperativeHandle } from 'react'
import { beforeEach, describe, it, vi } from 'vitest'

const mockFrameCallbacks: any[] = []
const refState = vi.hoisted(() => ({ keepNull: false }))
let pointsRef: { current: any }
vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: any) => {
    mockFrameCallbacks.push(cb)
  },
}))

const MockThreeObject = forwardRef(({ children, type, ...props }: any, ref) => {
  const obj = {
    rotation: { x: 0, y: 0, z: 0 },
  }
  if (!refState.keepNull) {
    useImperativeHandle(ref, () => obj)
  }
  return <div data-testid={type}>{children}</div>
})

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useRef: (initial: any) => {
      if (initial === null) return pointsRef
      return (actual as any).useRef(initial)
    },
    createElement: (type: any, props: any, ...children: any) => {
      if (
        typeof type === 'string' &&
        ['points', 'bufferGeometry', 'bufferAttribute', 'pointsMaterial'].includes(type)
      ) {
        if (props?.ref) {
          const nextProps = refState.keepNull ? { type } : { ...props, type }
          return (actual as any).createElement(MockThreeObject, nextProps, ...children)
        }
        return (actual as any).createElement('div', { 'data-testid': type }, ...children)
      }
      return (actual as any).createElement(type, props, ...children)
    },
  }
})

describe('OrbitParticles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFrameCallbacks.length = 0
    refState.keepNull = false
    pointsRef = { current: { rotation: { x: 0, y: 0, z: 0 } } }
  })

  it('renders and runs frame loop', () => {
    render(<OrbitParticles color="#ffffff" density={0.5} size={5} />)

    act(() => {
      mockFrameCallbacks.forEach((cb) => {
        try {
          cb({}, 0.016)
        } catch (e) {}
      })
    })
  })

  it('skips animation when the points ref is missing', () => {
    refState.keepNull = true
    render(<OrbitParticles color="#ffffff" density={0.1} size={5} />)
    pointsRef.current = null

    act(() => {
      mockFrameCallbacks.forEach((cb) => cb({}, 0.016))
    })
  })
})
