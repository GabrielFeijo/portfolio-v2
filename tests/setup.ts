import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: (x: number, y: number, w: number, h: number) => ({
        data: new Array(w * h * 4)
      }),
      putImageData: () => {},
      createImageData: () => ([]),
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
      createRadialGradient: () => ({
        addColorStop: () => {}
      }),
    }
  }
})

const originalConsoleError = console.error
console.error = (...args: any[]) => {
  const message = args.join(' ')
  if (
    message.includes('is unrecognized in this browser') ||
    message.includes('is using incorrect casing') ||
    message.includes('does not recognize the') ||
    message.includes('non-boolean attribute')
  ) {
    if (
      message.includes('ambientLight') ||
      message.includes('hemisphereLight') ||
      message.includes('pointLight') ||
      message.includes('spotLight') ||
      message.includes('color') ||
      message.includes('fog') ||
      message.includes('dodecahedronGeometry') ||
      message.includes('meshStandardMaterial') ||
      message.includes('instancedMesh') ||
      message.includes('bufferAttribute') ||
      message.includes('bufferGeometry') ||
      message.includes('pointsMaterial') ||
      message.includes('points') ||
      message.includes('spriteMaterial') ||
      message.includes('sprite') ||
      message.includes('group') ||
      message.includes('ringGeometry') ||
      message.includes('meshBasicMaterial') ||
      message.includes('mesh') ||
      message.includes('sphereGeometry') ||
      message.includes('advancedAtmosphereMaterial') ||
      message.includes('aaaPlanetMaterial') ||
      message.includes('sunMaterial') ||
      message.includes('cylinderGeometry') ||
      message.includes('uColor') ||
      message.includes('uIntensity') ||
      message.includes('uType') ||
      message.includes('uLightDir') ||
      message.includes('uColorPrimary') ||
      message.includes('uColorSecondary') ||
      message.includes('transparent') ||
      message.includes('depthWrite') ||
      message.includes('vertexColors') ||
      message.includes('frustumCulled') ||
      message.includes('sizeAttenuation') ||
      message.includes('depthTest') ||
      message.includes('groundColor') ||
      message.includes('makeDefault') ||
      message.includes('smoothTime')
    ) {
      return
    }
  }
  originalConsoleError(...args)
}

const originalConsoleWarn = console.warn
console.warn = (...args: any[]) => {
  const msg = args.join(' ')
  if (msg.includes('Multiple instances of Three.js being imported')) return
  originalConsoleWarn(...args)
}
