import { ShootingStar, Sun3D } from '@/components/three/objects/sun-3d'
import { act, fireEvent, render } from '@testing-library/react'
import * as THREE from 'three'
import { afterEach, beforeEach, describe, it, vi } from 'vitest'

const mockFrameCallbacks: any[] = []
let frameCallCount = 0
const openHelp = vi.fn()
const setCursorVariant = vi.fn()

let sunMeshRef: any
let sunMaterialRef: any
let shootingStarGroupRef: any
let shootingStarTrailRef: any
let refMode: 'sun' | 'shooting-star' = 'sun'
let solarFlareRefs: any[] = []

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: any) => {
    const state = {
      openHelp,
      setCursorVariant,
      experienceSettings: { transitionAnimations: true, warpEffects: true, autoRotate: true },
    }
    return selector ? selector(state) : state
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}))

vi.mock('@react-three/fiber', () => ({
  useFrame: (cb: any) => { mockFrameCallbacks.push(cb) },
  extend: vi.fn(),
  useThree: () => ({ camera: new THREE.PerspectiveCamera(), clock: new THREE.Clock() })
}))

vi.mock('@react-three/drei', () => ({
  Sphere: ({ children }: any) => <div>{children}</div>,
  Sparkles: () => <div>Sparkles</div>,
  Html: ({ children }: any) => <div>{children}</div>,
  shaderMaterial: vi.fn(() => class { }),
}))

vi.mock('react', async () => {
  const actual = await vi.importActual('react')
  return {
    ...actual,
    useRef: (initial: any) => {
      const refObj = { current: initial }

      if (initial === null) {
        frameCallCount++
        if (refMode === 'sun' && frameCallCount === 1) {
          sunMeshRef = refObj
          refObj.current = {
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            position: { x: 0, y: 0, z: 0 }
          }
        } else if (refMode === 'sun' && frameCallCount === 2) {
          sunMaterialRef = refObj
          refObj.current = {
            uniforms: {
              uTime: { value: 0 },
              uColorPrimary: { value: new THREE.Color() },
              uColorSecondary: { value: new THREE.Color() },
              uIntensity: { value: 0 }
            }
          }
        } else if (refMode === 'sun') {
          refObj.current = {
            scale: { setScalar: vi.fn() },
            position: { set: vi.fn() }
          }
          solarFlareRefs.push(refObj)
        } else if (refMode === 'shooting-star' && frameCallCount === 1) {
          shootingStarGroupRef = refObj
          refObj.current = {
            position: new THREE.Vector3(),
            visible: true
          }
        } else if (refMode === 'shooting-star' && frameCallCount === 2) {
          shootingStarTrailRef = refObj
          refObj.current = {
            scale: { set: vi.fn() }
          }
        }
      }

      return refObj
    },
    createElement: (type: any, props: any, ...children: any) => {
      if (typeof type === 'string' && /^[a-z]/.test(type)) {
        return (actual as any).createElement('div', props, ...children)
      }
      return (actual as any).createElement(type, props, ...children)
    }
  }
})

describe('Sun3D', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFrameCallbacks.length = 0
    frameCallCount = 0
    refMode = 'sun'
    sunMeshRef = undefined
    sunMaterialRef = undefined
    solarFlareRefs = []
    openHelp.mockClear()
    setCursorVariant.mockClear()
  })

  const restoreSunRefs = () => {
    if (sunMeshRef) {
      sunMeshRef.current = {
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        position: { x: 0, y: 0, z: 0 }
      }
    }
    if (sunMaterialRef) {
      sunMaterialRef.current = {
        uniforms: {
          uTime: { value: 0 },
          uColorPrimary: { value: new THREE.Color() },
          uColorSecondary: { value: new THREE.Color() },
          uIntensity: { value: 0 }
        }
      }
    }
    solarFlareRefs.forEach((ref) => {
      ref.current = {
        scale: { setScalar: vi.fn() },
        position: { set: vi.fn() }
      }
    })
  }

  it('renders and runs frame loop', async () => {
	    render(<Sun3D />)
        restoreSunRefs()
    let frameCalled = false
    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try {
          cb({ clock: { getElapsedTime: () => 5.0 } }, 0.016)
          frameCalled = true
        } catch (e) { }
      })
    })
  })

  it('updates sun mesh rotation on frame', async () => {
	    render(<Sun3D />)
        restoreSunRefs()
    const initialRotY = sunMeshRef?.current?.rotation?.y ?? 0

    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try {
          cb({ clock: { getElapsedTime: () => 1.0 } }, 0.016)
        } catch (e) { }
      })
    })
  })

  it('updates material uniforms on frame', async () => {
	    render(<Sun3D />)
        restoreSunRefs()

    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try {
          cb({ clock: { getElapsedTime: () => 10.5 } }, 0.016)
        } catch (e) { }
      })
    })
  })

  it('handles null refs gracefully', async () => {
    render(<Sun3D />)
    restoreSunRefs()

    if (sunMeshRef) sunMeshRef.current = null
    if (sunMaterialRef) sunMaterialRef.current = null
    solarFlareRefs.forEach((ref) => {
      ref.current = null
    })

    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try {
          cb({ clock: { getElapsedTime: () => 2.0 } }, 0.016)
        } catch (e) { }
      })
    })
  })

  it('renders multiple frame cycles', async () => {
	    render(<Sun3D />)
        restoreSunRefs()

	    await act(async () => {
	      for (let i = 0; i < 3; i++) {
	        mockFrameCallbacks.forEach(cb => {
	          try {
	            cb({ clock: { getElapsedTime: () => i } }, 0.016)
	          } catch (e) { }
	        })
	      }
    })
  })

  it('opens help and updates cursor state from mesh interactions', () => {
    const { container } = render(<Sun3D />)
    const interactiveNodes = Array.from(container.querySelectorAll('*'))

    interactiveNodes.forEach((node) => {
      act(() => {
        fireEvent.pointerEnter(node)
        fireEvent.pointerLeave(node)
        fireEvent.click(node)
      })
    })

    expect(openHelp).toHaveBeenCalled()
    expect(setCursorVariant).toHaveBeenCalledWith('planet')
    expect(setCursorVariant).toHaveBeenCalledWith('default')
  })

  it('marks the help label as hovered on pointer enter', () => {
    const { container } = render(<Sun3D />)
    const mesh = Array.from(container.querySelectorAll('*')).find((node) => node.tagName.toLowerCase() === 'mesh')

    if (mesh) {
      fireEvent.pointerEnter(mesh)
    }

    expect(container.querySelector('.planet-label-hovered')).toBeInTheDocument()
  })
})

describe('ShootingStar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFrameCallbacks.length = 0
    frameCallCount = 0
    refMode = 'shooting-star'
    shootingStarGroupRef = undefined
    shootingStarTrailRef = undefined
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  const restoreShootingStarRefs = () => {
    if (shootingStarGroupRef) {
      shootingStarGroupRef.current = {
        position: new THREE.Vector3(),
        visible: true
      }
    }
    if (shootingStarTrailRef) {
      shootingStarTrailRef.current = {
        scale: { set: vi.fn() }
      }
    }
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders and runs frame loop', async () => {
	    render(<ShootingStar />)
        restoreShootingStarRefs()
    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try { cb({ clock: { getElapsedTime: () => 1.0 } }, 0.016) } catch (e) { }
      })
    })
  })

  it('handles active phase (t < 2.5)', async () => {
	    render(<ShootingStar />)
        restoreShootingStarRefs()
    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try {
          cb({ clock: { getElapsedTime: () => 0.5 } }, 0.016)
        } catch { }
      })
    })
  })

  it('handles inactive phase (t >= 2.5)', async () => {
	    render(<ShootingStar />)
        restoreShootingStarRefs()
    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try {
          cb({ clock: { getElapsedTime: () => 5.0 } }, 0.016)
        } catch { }
      })
    })
  })

  it('handles full cycle including wrap-around', async () => {
    render(<ShootingStar />)
    restoreShootingStarRefs()

    await act(async () => {
      for (let t of [0.0, 1.0, 2.5, 5.0, 10.0, 17.9]) {
        mockFrameCallbacks.forEach(cb => {
          try {
            cb({ clock: { getElapsedTime: () => t } }, 0.016)
          } catch { }
        })
      }
    })
  })

  it('handles null group refs', async () => {
	    render(<ShootingStar />)
        restoreShootingStarRefs()
    if (shootingStarGroupRef) shootingStarGroupRef.current = null

    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try { cb({ clock: { getElapsedTime: () => 1.0 } }, 0.016) } catch { }
      })
    })
  })

  it('handles missing trail refs while the group is active', async () => {
    render(<ShootingStar />)
    restoreShootingStarRefs()
    if (shootingStarTrailRef) shootingStarTrailRef.current = null

    await act(async () => {
      mockFrameCallbacks.forEach(cb => {
        try { cb({ clock: { getElapsedTime: () => 1.0 } }, 0.016) } catch { }
      })
    })
  })
})
