import { ANIMATION_SETTINGS } from '@/constants/animation';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import type { PanelId } from '@/types/portfolio';
import type { CursorVariant, ExperienceSettings } from '@/types/store';
import type { ThreeEvent } from '@react-three/fiber';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePlanetInteractionOptions {
  planetId: PanelId;
  handlePlanetClick?: (panel: PanelId) => void;
  openPanel?: (panel: PanelId) => void;
  setActivePlanet?: (id: string | null) => void;
  setCursorVariant: (variant: CursorVariant) => void;
  setWarpActive?: (active: boolean) => void;
  settings?: ExperienceSettings;
}

function clearTimerRef(timerRef: { current: number | null }) {
  if (timerRef.current === null) return;
  window.clearTimeout(timerRef.current);
  timerRef.current = null;
}

export function usePlanetInteraction({
  planetId,
  handlePlanetClick,
  openPanel,
  setActivePlanet,
  setCursorVariant,
  setWarpActive,
  settings,
}: UsePlanetInteractionOptions) {
  const [hovered, setHovered] = useState(false);
  const warpTimeoutRef = useRef<number | null>(null);
  const panelOpenTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const cancelPendingInteractionTimers = useCallback(() => {
    clearTimerRef(warpTimeoutRef);
    clearTimerRef(panelOpenTimerRef);
  }, []);

  useEffect(() => {
    return () => {
      cancelPendingInteractionTimers();
    };
  }, [cancelPendingInteractionTimers]);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();

      if (!openPanel || !setActivePlanet || !setWarpActive || !settings) {
        handlePlanetClick?.(planetId);
        return;
      }

      clearTimerRef(panelOpenTimerRef);
      setActivePlanet(planetId);

      const useTransitions = settings.transitionAnimations && !prefersReducedMotion;
      if (!useTransitions) {
        openPanel(planetId);
        return;
      }

      if (settings.warpEffects) {
        setWarpActive(true);
        clearTimerRef(warpTimeoutRef);
        warpTimeoutRef.current = window.setTimeout(() => {
          setWarpActive(false);
          warpTimeoutRef.current = null;
        }, ANIMATION_SETTINGS.warpDurationMs);
      }

      panelOpenTimerRef.current = window.setTimeout(() => {
        panelOpenTimerRef.current = null;
        openPanel(planetId);
      }, ANIMATION_SETTINGS.panelOpenDelayMs);
    },
    [
      handlePlanetClick,
      openPanel,
      planetId,
      prefersReducedMotion,
      setActivePlanet,
      setWarpActive,
      settings,
    ]
  );

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
    setCursorVariant('planet');
  }, [setCursorVariant]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    setCursorVariant('default');
  }, [setCursorVariant]);

  return {
    handleClick,
    handlePointerEnter,
    handlePointerLeave,
    hovered,
  };
}
