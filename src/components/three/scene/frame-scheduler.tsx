import { useSpaceStore } from '@/store/space-store';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

export function FrameScheduler() {
  const invalidate = useThree((state) => state.invalidate);
  const { activePanel, activePlanet, helpOpen, settings, settingsOpen, warpActive } = useSpaceStore(
    useShallow((state) => ({
      activePanel: state.activePanel,
      activePlanet: state.activePlanet,
      helpOpen: state.helpOpen,
      settings: state.experienceSettings,
      settingsOpen: state.settingsOpen,
      warpActive: state.warpActive,
    }))
  );
  const degraded = useRef(false);
  const sample = useRef({ frames: 0, startedAt: 0 });

  const transitioning = Boolean((activePlanet && !activePanel) || warpActive);
  const obscured = Boolean(activePanel || helpOpen || settingsOpen);
  const animated =
    settings.autoRotate ||
    settings.planetRotation ||
    settings.nebula ||
    settings.shootingStars ||
    settings.asteroidDensity > 0;
  const targetFps = obscured ? 0 : transitioning ? 60 : animated ? 30 : 0;

  useEffect(() => {
    invalidate();
    if (targetFps === 0) return;

    let intervalId: number | undefined;
    const start = () => {
      if (document.hidden || intervalId !== undefined) return;
      intervalId = window.setInterval(invalidate, 1000 / targetFps);
    };
    const stop = () => {
      if (intervalId !== undefined) window.clearInterval(intervalId);
      intervalId = undefined;
    };
    const handleVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [invalidate, targetFps]);

  useFrame(({ clock }) => {
    if (targetFps !== 30 || degraded.current) return;
    const elapsed = clock.getElapsedTime();
    if (sample.current.startedAt === 0) sample.current.startedAt = elapsed;
    sample.current.frames += 1;
    const duration = elapsed - sample.current.startedAt;
    if (duration < 4) return;

    const measuredFps = sample.current.frames / duration;
    if (measuredFps < 22) {
      degraded.current = true;
      const store = useSpaceStore.getState();
      store.setExperienceSetting('dpr', 1);
      store.setExperienceSetting('shadows', false);
      store.setExperienceSetting(
        'starDensity',
        Math.min(store.experienceSettings.starDensity, 0.3)
      );
      store.setExperienceSetting(
        'asteroidDensity',
        Math.min(store.experienceSettings.asteroidDensity, 0.3)
      );
    }
    sample.current = { frames: 0, startedAt: elapsed };
  });

  return null;
}
