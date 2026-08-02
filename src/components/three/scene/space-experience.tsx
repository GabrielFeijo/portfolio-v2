import { useSpaceStore } from '@/store/space-store';
import { isWebGLAvailable } from '@/utils/webgl-check';
import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { WebGLError } from '../../ui/overlays/webgl-error';
import '../register-materials';
import { SpaceScene } from './space-scene';

export default function SpaceExperience() {
  const { t } = useTranslation();
  const {
    antialias,
    dpr,
    isLoaded,
    setCursorVariant,
    setExperienceSetting,
    setGraphicsMode,
    setIsLoaded,
    shadows,
  } = useSpaceStore(
    useShallow((state) => ({
      antialias: state.experienceSettings.antialias,
      dpr: state.experienceSettings.dpr,
      isLoaded: state.isLoaded,
      setCursorVariant: state.setCursorVariant,
      setExperienceSetting: state.setExperienceSetting,
      setGraphicsMode: state.setGraphicsMode,
      setIsLoaded: state.setIsLoaded,
      shadows: state.experienceSettings.shadows,
    }))
  );
  const [webGLStatus, setWebGLStatus] = useState<
    'available' | 'unavailable' | 'context_lost' | 'disabled'
  >(() => (isWebGLAvailable() ? 'available' : 'unavailable'));

  useEffect(() => {
    if (webGLStatus === 'available' || webGLStatus === 'disabled') return;

    setGraphicsMode('2d');
    setCursorVariant('default');
    setExperienceSetting('customCursor', false);
    setIsLoaded(true);
  }, [setCursorVariant, setExperienceSetting, setGraphicsMode, setIsLoaded, webGLStatus]);

  useEffect(() => {
    if (isLoaded || webGLStatus !== 'available') return;

    const timeout = window.setTimeout(() => {
      setWebGLStatus('unavailable');
      setIsLoaded(true);
    }, 8_000);
    return () => window.clearTimeout(timeout);
  }, [isLoaded, setIsLoaded, webGLStatus]);

  if (webGLStatus === 'disabled') {
    return <div className="scene-fallback" data-testid="scene-2d-fallback" aria-hidden="true" />;
  }

  if (webGLStatus !== 'available') {
    return <WebGLError variant={webGLStatus} onContinue={() => setWebGLStatus('disabled')} />;
  }

  return (
    <Canvas
      aria-label={t('app.canvas_aria')}
      key={`space-canvas-${antialias ? 'aa' : 'no-aa'}`}
      className="absolute inset-0"
      camera={{ position: [0, 22, 64], fov: 58, near: 0.1, far: 2200 }}
      dpr={[1, dpr]}
      gl={{ antialias, alpha: false, powerPreference: 'high-performance' }}
      shadows={shadows}
      frameloop="demand"
      onCreated={({ gl }) => {
        const handleContextLost = (event: Event) => {
          event.preventDefault();
          setWebGLStatus('context_lost');
        };
        gl.domElement.addEventListener('webglcontextlost', handleContextLost, { once: true });
      }}
    >
      <SpaceScene />
    </Canvas>
  );
}
