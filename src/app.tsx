import { SpaceScene } from '@/components/three/scene/space-scene';
import { CustomCursor } from '@/components/ui/hud/custom-cursor';
import { HUD } from '@/components/ui/hud/hud';
import { LoadingScreen } from '@/components/ui/hud/loading-screen';
import { SpaceMusic } from '@/components/ui/hud/space-music';
import { WarpEffect } from '@/components/ui/hud/warp-effect';
import { HelpOverlay } from '@/components/ui/overlays/help-overlay';
import { SettingsOverlay } from '@/components/ui/overlays/settings-overlay';
import { WebGLError } from '@/components/ui/overlays/webgl-error';
import { PlanetPanel } from '@/components/ui/planet-panel';
import { useSpaceStore } from '@/store/space-store';
import { isWebGLAvailable } from '@/utils/webgl-check';
import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

export default function App() {
  const { t } = useTranslation();
  const { activePanel, antialias, dpr, helpOpen, isLoaded, settingsOpen, shadows } = useSpaceStore(
    useShallow((state) => ({
      activePanel: state.activePanel,
      antialias: state.experienceSettings.antialias,
      dpr: state.experienceSettings.dpr,
      helpOpen: state.helpOpen,
      isLoaded: state.isLoaded,
      settingsOpen: state.settingsOpen,
      shadows: state.experienceSettings.shadows,
    }))
  );
  const [webGLStatus, setWebGLStatus] = useState<
    'checking' | 'available' | 'unavailable' | 'context_lost'
  >(isWebGLAvailable() ? 'available' : 'unavailable');

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    return () => document.removeEventListener('contextmenu', prevent);
  }, []);

  if (webGLStatus === 'unavailable' || webGLStatus === 'context_lost') {
    return <WebGLError variant={webGLStatus} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="scanlines" />
      <div className="vignette" />
      <div className="noise" />

      <CustomCursor />

      <Canvas
        aria-label={t('app.canvas_aria')}
        className="absolute inset-0"
        camera={{ position: [0, 22, 64], fov: 58, near: 0.1, far: 2200 }}
        dpr={[1, dpr]}
        gl={{ antialias, alpha: false, powerPreference: 'high-performance' }}
        shadows={shadows}
        onCreated={({ gl }) => {
          const handleContextLost = (event: Event) => {
            event.preventDefault();
            setWebGLStatus('context_lost');
          };
          gl.domElement.addEventListener('webglcontextlost', handleContextLost, { once: true });
        }}
      >
        <Suspense fallback={null}>
          <SpaceScene />
          <Preload all />
        </Suspense>
      </Canvas>

      <AnimatePresence>{!isLoaded && <LoadingScreen />}</AnimatePresence>
      <AnimatePresence>{isLoaded && <HUD />}</AnimatePresence>
      <AnimatePresence>{isLoaded && activePanel && <PlanetPanel />}</AnimatePresence>
      <AnimatePresence>{isLoaded && helpOpen && <HelpOverlay />}</AnimatePresence>
      <AnimatePresence>{isLoaded && settingsOpen && <SettingsOverlay />}</AnimatePresence>
      <SpaceMusic />
      <WarpEffect />
    </div>
  );
}
