import { useEffect, Suspense, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { useSpaceStore } from '@/store/space-store'
import { SpaceScene } from '@/components/three/space-scene'
import { HUD } from '@/components/ui/hud'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { IntroSequence } from '@/components/ui/intro-sequence'
import { PlanetPanel } from '@/components/ui/planet-panel'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { WarpEffect } from '@/components/ui/warp-effect'
import { WebGLError } from '@/components/ui/webgl-error'
import { isWebGLAvailable } from '@/utils/webgl-check'

export default function App() {
  const { showIntro, activePanel, isLoaded } = useSpaceStore()
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    setHasWebGL(isWebGLAvailable())
  }, [])

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', prevent)
    return () => document.removeEventListener('contextmenu', prevent)
  }, [])

  if (hasWebGL === false) {
    return <WebGLError />
  }

  if (hasWebGL === null) {
    return null
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />

      <CustomCursor />

      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        camera={{ position: [0, 20, 60], fov: 60, near: 0.1, far: 2000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <SpaceScene />
          <Preload all />
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {!isLoaded && <LoadingScreen />}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && isLoaded && <IntroSequence />}
      </AnimatePresence>

      <AnimatePresence>
        {isLoaded && !showIntro && <HUD />}
      </AnimatePresence>

      <AnimatePresence>
        {activePanel && <PlanetPanel />}
      </AnimatePresence>

      <WarpEffect />
    </div>
  )
}
