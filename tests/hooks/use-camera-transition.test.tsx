import { PLANETS } from '@/data/portfolio'
import { useCameraTransition } from '@/hooks/use-camera-transition'
import { renderHook } from '@testing-library/react'
import * as THREE from 'three'
import { describe, expect, it, vi } from 'vitest'

describe('useCameraTransition', () => {
  it('sets idle lookAt when no active panel', () => {
    const setLookAt = vi.fn()
    const controlsRef = { current: { setLookAt } }
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1000)

    renderHook(() =>
      useCameraTransition({
        activePanel: null,
        activePlanet: null,
        camera,
        controlsRef: controlsRef as never,
        planetAngles: {
          current: Object.fromEntries(PLANETS.map((p: { id: string }) => [p.id, 0])),
        },
        smooth: true,
        viewportWidth: 1280,
      })
    )

    expect(setLookAt).toHaveBeenCalled()
  })

  it('sets focused lookAt when panel is active', () => {
    const setLookAt = vi.fn()
    const controlsRef = { current: { setLookAt } }
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1000)

    renderHook(() =>
      useCameraTransition({
        activePanel: 'about',
        activePlanet: 'about',
        camera,
        controlsRef: controlsRef as never,
        planetAngles: {
          current: Object.fromEntries(PLANETS.map((p: { id: string }) => [p.id, 0])),
        },
        smooth: false,
        viewportWidth: 1920,
      })
    )

    expect(setLookAt).toHaveBeenCalled()
  })

  it('does nothing if controls is null', () => {
    const setLookAt = vi.fn()
    const controlsRef = { current: null }
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1000)

    renderHook(() =>
      useCameraTransition({
        activePanel: null,
        activePlanet: null,
        camera,
        controlsRef: controlsRef as never,
        planetAngles: { current: {} },
        smooth: true,
        viewportWidth: 1280,
      })
    )

    expect(setLookAt).not.toHaveBeenCalled()
  })

  it('does nothing if planet is not found', () => {
    const setLookAt = vi.fn()
    const controlsRef = { current: { setLookAt } }
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 1000)

    renderHook(() =>
      useCameraTransition({
        activePanel: 'about',
        activePlanet: 'invalid-planet' as 'about',
        camera,
        controlsRef: controlsRef as never,
        planetAngles: { current: {} },
        smooth: true,
        viewportWidth: 1280,
      })
    )

    expect(setLookAt).not.toHaveBeenCalled()
  })
})
