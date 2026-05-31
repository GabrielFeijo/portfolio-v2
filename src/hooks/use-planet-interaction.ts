import type { PanelId } from '@/types/portfolio'
import type { CursorVariant } from '@/types/store'
import type { ThreeEvent } from '@react-three/fiber'
import { useCallback, useState } from 'react'

interface UsePlanetInteractionOptions {
  planetId: PanelId
  handlePlanetClick: (panel: PanelId) => void
  setCursorVariant: (variant: CursorVariant) => void
}

export function usePlanetInteraction({
  planetId,
  handlePlanetClick,
  setCursorVariant,
}: UsePlanetInteractionOptions) {
  const [hovered, setHovered] = useState(false)

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation()
      handlePlanetClick(planetId)
    },
    [handlePlanetClick, planetId]
  )

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
