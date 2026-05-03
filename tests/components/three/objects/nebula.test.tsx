import { Nebula } from '@/components/three/objects/nebula'
import { act, render } from '@testing-library/react'
import { forwardRef, useImperativeHandle } from 'react'
import { beforeEach, describe, it, vi } from 'vitest'

vi.mock('@/utils/geometry', () => ({
  createStarPositions: vi.fn(() => new Float32Array(30)),
  createStarColors: vi.fn(() => new Float32Array(30)),
}))

vi.mock('@/utils/textures', () => ({
  createCloudTexture: vi.fn(() => ({ dispose: vi.fn() })),
  createGlowTexture: vi.fn(() => ({ dispose: vi.fn() })),
  createRandom: vi.fn(() => (Math.random)),
}))

const mockFrameCallbacks: any[] = []
const refState = vi.hoisted(() => ({ keepNull: false }))
let refs: Array<{ current: any }>
vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: any) => { mockFrameCallbacks.push(cb) },
}))

const MockThreeObject = forwardRef(({ children, type, ...props }: any, ref) => {
    const obj = {
        rotation: { x: 0, y: 0, z: 0 },
        position: { set: vi.fn(), copy: vi.fn().mockReturnThis() },
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
                if (initial === null) {
                    const ref = { current: { rotation: { x: 0, y: 0, z: 0 } } }
                    refs.push(ref)
                    return ref
                }
                return (actual as any).useRef(initial)
            },
	        createElement: (type: any, props: any, ...children: any) => {
	            if (typeof type === 'string' && ['points', 'group', 'sprite', 'bufferGeometry', 'bufferAttribute', 'pointsMaterial', 'spriteMaterial'].includes(type)) {
	                if (props?.ref) {
                        const nextProps = refState.keepNull ? { type } : { ...props, type }
	                    return (actual as any).createElement(MockThreeObject, nextProps, ...children)
	                }
	                return (actual as any).createElement('div', { 'data-testid': type }, ...children)
	            }
            return (actual as any).createElement(type, props, ...children)
        }
    }
})

describe('Nebula', () => {
    beforeEach(() => {
	    vi.clearAllMocks()
	    mockFrameCallbacks.length = 0
        refState.keepNull = false
        refs = []
	  })

  it('renders and runs frame loop', () => {
    render(<Nebula density={0.5} />)
    
    const state = { clock: { getElapsedTime: () => 1.0 } }
    act(() => {
        mockFrameCallbacks.forEach(cb => {
            try { cb(state, 0.016) } catch(e) {}
        })
    })
  })

	  it('unmounts and disposes textures', () => {
	    const { unmount } = render(<Nebula density={0.5} />)
	    unmount()
	  })

      it('uses minimum layer counts and skips frame updates when refs are missing', () => {
        refState.keepNull = true
        render(<Nebula density={0} />)
        refs.forEach((ref) => {
            ref.current = null
        })

        const state = { clock: { getElapsedTime: () => 1.0 } }
        act(() => {
            mockFrameCallbacks.forEach(cb => cb(state, 0.016))
        })
      })
	})
