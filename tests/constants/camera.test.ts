import { CAMERA_SETTINGS, IDLE_CAMERA_POSITION, IDLE_LOOK_AT } from '@/constants/camera'
import { describe, expect, it } from 'vitest'

describe('camera constants', () => {
  it('keeps camera settings in valid ranges', () => {
    expect(CAMERA_SETTINGS.minPolarAngle).toBeLessThan(CAMERA_SETTINGS.maxPolarAngle)
    expect(CAMERA_SETTINGS.minDistance).toBeLessThan(CAMERA_SETTINGS.maxDistance)
    expect(CAMERA_SETTINGS.panelMaxWidth).toBeGreaterThan(0)
  })

  it('exports idle vectors', () => {
    expect(IDLE_CAMERA_POSITION.toArray()).toEqual([-14, 24, 68])
    expect(IDLE_LOOK_AT.toArray()).toEqual([5, -1, -8])
  })
})
