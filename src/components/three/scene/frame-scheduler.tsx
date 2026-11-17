import { useSpaceStore } from '@/store/space-store';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

const FULL_SCREEN_PANEL_QUERY = '(max-width: 639px)';
const MAX_DEGRADE_LEVEL = 3;
const SAMPLE_WINDOW_SECONDS = 4;

let degradeLevel = 0;

export function resetPerformanceDegradation() {
  degradeLevel = 0;
}

function applyDegradeLevel(level: number) {
  const store = useSpaceStore.getState();
  const set = store.setExperienceSetting;
  const { asteroidDensity, starDensity } = store.experienceSettings;

  if (level === 1) {
    set('dpr', 1);
    set('shadows', false);
    set('liteEffects', true);
    set('starDensity', Math.min(starDensity, 0.3));
    set('asteroidDensity', Math.min(asteroidDensity, 0.3));
    return;
  }

  if (level === 2) {
    set('nebula', false);
    set('shootingStars', false);
    set('orbitalParticles', false);
    set('warpEffects', false);
    set('antialias', false);
    set('asteroidDensity', Math.min(asteroidDensity, 0.15));
  }
}

interface TargetFpsParams {
  hiddenScene: boolean;
  transitioning: boolean;
  obscured: boolean;
  animated: boolean;
  idleFps: number;
}

function resolveTargetFps({
  hiddenScene,
  transitioning,
  obscured,
  animated,
  idleFps,
}: TargetFpsParams): number {
  if (hiddenScene) return 0;
  if (transitioning) return 60;
  if (obscured) return 12;
  return animated ? idleFps : 0;
}

function useFullScreenPanelViewport() {
  const [matches, setMatches] = useState(
    () => window.matchMedia?.(FULL_SCREEN_PANEL_QUERY).matches ?? false
  );

  useEffect(() => {
    const query = window.matchMedia?.(FULL_SCREEN_PANEL_QUERY);
    if (!query) return;

    const handleChange = () => setMatches(query.matches);
    handleChange();
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return matches;
}

export function FrameScheduler() {
  const invalidate = useThree((state) => state.invalidate);
  const { activePanel, activePlanet, helpOpen, isLoaded, settings, settingsOpen, warpActive } =
    useSpaceStore(
      useShallow((state) => ({
        activePanel: state.activePanel,
        activePlanet: state.activePlanet,
        helpOpen: state.helpOpen,
        isLoaded: state.isLoaded,
        settings: state.experienceSettings,
        settingsOpen: state.settingsOpen,
        warpActive: state.warpActive,
      }))
    );
  const fullScreenPanelViewport = useFullScreenPanelViewport();
  const [level, setLevel] = useState(degradeLevel);
  const sample = useRef({ frames: 0, startedAt: 0 });

  const transitioning = Boolean((activePlanet && !activePanel) || warpActive);
  const modalOpen = Boolean(helpOpen || settingsOpen);
  const hiddenScene = !isLoaded || modalOpen || Boolean(activePanel && fullScreenPanelViewport);
  const obscured = Boolean(activePanel);
  const animated =
    settings.autoRotate ||
    settings.planetRotation ||
    settings.nebula ||
    settings.shootingStars ||
    settings.asteroidDensity > 0;
  const baseIdleFps = settings.liteEffects ? 24 : 30;
  const degradedIdleFps = settings.liteEffects ? 15 : 20;
  const idleFps = level >= MAX_DEGRADE_LEVEL ? degradedIdleFps : baseIdleFps;
  const targetFps = resolveTargetFps({
    hiddenScene,
    transitioning,
    obscured,
    animated,
    idleFps,
  });

  const prevSettingsRef = useRef(settings);

  useEffect(() => {
    if (prevSettingsRef.current === settings) return;
    prevSettingsRef.current = settings;
    invalidate();
  }, [invalidate, settings]);

  useEffect(() => {
    invalidate();
    sample.current = { frames: 0, startedAt: 0 };
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
    const handleVisibility = () => {
      sample.current = { frames: 0, startedAt: 0 };
      if (document.hidden) {
        stop();
        return;
      }
      start();
    };

    start();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [invalidate, targetFps]);

  useFrame(({ clock }) => {
    if (targetFps !== idleFps || degradeLevel >= MAX_DEGRADE_LEVEL) return;
    const elapsed = clock.getElapsedTime();
    if (sample.current.startedAt === 0) sample.current.startedAt = elapsed;
    sample.current.frames += 1;
    const duration = elapsed - sample.current.startedAt;
    if (duration < SAMPLE_WINDOW_SECONDS) return;

    const measuredFps = sample.current.frames / duration;
    sample.current = { frames: 0, startedAt: elapsed };
    if (measuredFps >= idleFps * 0.73) return;

    const skipLevelOne =
      degradeLevel === 0 && settings.liteEffects && settings.dpr <= 1 && !settings.shadows;
    degradeLevel = skipLevelOne ? 2 : degradeLevel + 1;
    applyDegradeLevel(degradeLevel);
    setLevel(degradeLevel);
  });

  return null;
}
