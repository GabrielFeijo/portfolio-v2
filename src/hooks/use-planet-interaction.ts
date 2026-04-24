import { useCallback, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { ANIMATION_SETTINGS } from '@/constants/animation'
import type { PanelId } from '@/types/portfolio'
import type { CursorVariant } from '@/types/store'

interface UsePlanetInteractionOptions {
  planetId: PanelId
  openPanel: (panel: PanelId) => void
  setActivePlanet: (id: string | null) => void
  setCursorVariant: (variant: CursorVariant) => void
}

export function usePlanetInteraction({
  planetId,
  openPanel,
  setActivePlanet,
  setCursorVariant,
}: UsePlanetInteractionOptions) {
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    setActivePlanet(planetId)
    window.setTimeout(() => openPanel(planetId), ANIMATION_SETTINGS.panelOpenDelayMs)
  }, [openPanel, planetId, setActivePlanet])

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
