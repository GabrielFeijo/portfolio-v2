import { NOISE_CHUNK } from '@/utils/glsl/noise.glsl'
import { describe, expect, it } from 'vitest'

describe('noise shader', () => {
  it('exports a non-empty glsl string', () => {
    expect(typeof NOISE_CHUNK).toBe('string')
    expect(NOISE_CHUNK.length).toBeGreaterThan(0)
  })
})
