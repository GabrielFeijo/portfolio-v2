import {
  getPlanetOrbitCenterY,
  getPlanetOrbitRotation,
  getPlanetOrbitTilt,
  getPlanetPosition,
} from '@/utils/orbit-utils'
import { PLANETS } from '@/data/portfolio'
import { describe, expect, it } from 'vitest'

describe('orbit utils', () => {
  it('computes center Y from orbitY', () => {
    expect(getPlanetOrbitCenterY(PLANETS[0])).toBeCloseTo((PLANETS[0].orbitY ?? 0) * 0.45)
  })

  it('computes center Y with missing orbitY', () => {
    expect(getPlanetOrbitCenterY({ ...PLANETS[0], orbitY: undefined })).toBe(0)
  })

  it('clamps tilt values', () => {
    const tilt = getPlanetOrbitTilt({ ...PLANETS[0], orbitY: 999 })
    expect(tilt.x).toBeLessThanOrEqual(0.24)
    expect(tilt.z).toBeLessThanOrEqual(0.14)
  })

  it('clamps negative tilt values', () => {
    const tilt = getPlanetOrbitTilt({ ...PLANETS[0], orbitY: -999 })
    expect(tilt.x).toBeGreaterThanOrEqual(-0.24)
    expect(tilt.z).toBeGreaterThanOrEqual(-0.14)
  })

  it('handles missing orbitY using defaults', () => {
    const tilt = getPlanetOrbitTilt({ ...PLANETS[0], orbitY: undefined })
    expect(tilt).toEqual({ x: 0, z: 0 })
  })

  it('handles null-like orbit value branch', () => {
    const tilt = getPlanetOrbitTilt({ ...PLANETS[0], orbitY: null as never })
    expect(tilt).toEqual({ x: 0, z: 0 })
  })

  it('returns orbit rotation tuple', () => {
    const rotation = getPlanetOrbitRotation(PLANETS[1])
    expect(rotation).toHaveLength(3)
  })

  it('returns position vector for angle', () => {
    const position = getPlanetPosition(PLANETS[2], Math.PI / 3)
    expect(position.length()).toBeGreaterThan(0)
  })
})
