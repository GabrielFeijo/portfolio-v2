import { ANIMATION_SETTINGS } from '@/constants/animation'
import type { PanelId } from '@/types/portfolio'
import type { CursorVariant, ExperienceSettings } from '@/types/store'
import type { ThreeEvent } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState } from 'react'

interface UsePlanetInteractionOptions {
  planetId: PanelId
  openPanel: (panel: PanelId) => void
  setActivePlanet: (id: string | null) => void
  setCursorVariant: (variant: CursorVariant) => void
  setWarpActive: (active: boolean) => void
  settings: ExperienceSettings
}

export function usePlanetInteraction({
  planetId,
  openPanel,
  setActivePlanet,
  setCursorVariant,
  setWarpActive,
  settings,
}: UsePlanetInteractionOptions) {
  const [hovered, setHovered] = useState(false)
  const warpTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (warpTimeoutRef.current !== null) {
        window.clearTimeout(warpTimeoutRef.current)
      }
    }
  }, [])

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setActivePlanet(planetId)

    if (!settings.transitionAnimations) {
      openPanel(planetId)
      return
    }

    if (settings.warpEffects) {
      setWarpActive(true)

      if (warpTimeoutRef.current !== null) {
        window.clearTimeout(warpTimeoutRef.current)
      }

      warpTimeoutRef.current = window.setTimeout(() => {
        setWarpActive(false)
        warpTimeoutRef.current = null
      }, ANIMATION_SETTINGS.warpDurationMs)
    }

    window.setTimeout(() => openPanel(planetId), ANIMATION_SETTINGS.panelOpenDelayMs)
  }, [openPanel, planetId, setActivePlanet, setWarpActive, settings.transitionAnimations, settings.warpEffects])

  const handlePointerEnter = useCallback(() => {
    setHovered(true)
    setCursorVariant('planet')
  }, [setCursorVariant])

  const handlePointerLeave = useCallback(() => {
    setHovered(false)
    setCursorVariant('default')
  }, [setCursorVariant])

  return {
    handleClick,
    handlePointerEnter,
    handlePointerLeave,
    hovered,
  }
}
