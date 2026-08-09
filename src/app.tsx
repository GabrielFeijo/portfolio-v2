import { PerformanceOverlay } from '@/components/ui/dev/performance-overlay';
import { CustomCursor } from '@/components/ui/hud/custom-cursor';
import { HUD } from '@/components/ui/hud/hud';
import { LoadingScreen } from '@/components/ui/hud/loading-screen';
import { SpaceMusic } from '@/components/ui/hud/space-music';
import { WarpEffect } from '@/components/ui/hud/warp-effect';
import { HelpOverlay } from '@/components/ui/overlays/help-overlay';
import { SettingsOverlay } from '@/components/ui/overlays/settings-overlay';
import { PlanetPanel } from '@/components/ui/planet-panel';
import { ExperienceBoundary } from '@/components/three/scene/experience-boundary';
import { useSectionHash } from '@/hooks/use-section-hash';
import { useSpaceStore } from '@/store/space-store';
import { AnimatePresence } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

const EXPERIENCE_LOAD_TIMEOUT_MS = 8_000;
const SpaceExperience = lazy(() =>
  Promise.race([
    import('@/components/three/scene/space-experience'),
    new Promise<never>((_, reject) => {
      window.setTimeout(
        () => reject(new Error('Space experience loading timed out')),
        EXPERIENCE_LOAD_TIMEOUT_MS
      );
    }),
  ])
);

export default function App() {
  const { activePanel, graphicsMode, helpOpen, isLoaded, settingsOpen } = useSpaceStore(
    useShallow((state) => ({
      activePanel: state.activePanel,
      graphicsMode: state.graphicsMode,
      helpOpen: state.helpOpen,
      isLoaded: state.isLoaded,
      settingsOpen: state.settingsOpen,
    }))
  );
  useSectionHash();

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener('contextmenu', prevent);
    return () => document.removeEventListener('contextmenu', prevent);
  }, []);

  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      <div className="vignette" />

      <CustomCursor />

      <ExperienceBoundary>
        <Suspense fallback={<div className="fallback-experience" aria-hidden="true" />}>
          <SpaceExperience />
        </Suspense>
      </ExperienceBoundary>

      <AnimatePresence>{!isLoaded && <LoadingScreen />}</AnimatePresence>
      <AnimatePresence>{isLoaded && graphicsMode !== '2d' && <HUD />}</AnimatePresence>
      <AnimatePresence>{isLoaded && activePanel && <PlanetPanel />}</AnimatePresence>
      <AnimatePresence>{isLoaded && helpOpen && <HelpOverlay />}</AnimatePresence>
      <AnimatePresence>{isLoaded && settingsOpen && <SettingsOverlay />}</AnimatePresence>
      <SpaceMusic />
      <WarpEffect />
      <PerformanceOverlay />
    </div>
  );
}
