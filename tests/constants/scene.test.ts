import { PLANET_TYPE_MAP, SCENE_SETTINGS } from '@/constants/scene'
import { describe, expect, it } from 'vitest'

describe('scene constants', () => {
  it('contains required star settings', () => {
    expect(SCENE_SETTINGS.primaryStars.count).toBeGreaterThan(SCENE_SETTINGS.secondaryStars.count)
    expect(SCENE_SETTINGS.fogNear).toBeLessThan(SCENE_SETTINGS.fogFar)
  })

  it('maps planet types to numeric indexes', () => {
    expect(PLANET_TYPE_MAP).toMatchObject({
      rocky: 0,
      oceanic: 1,
      lava: 2,
      crystal: 3,
      gas: 4,
      ice: 5,
    })
  })
})
