import { createCloudTexture, createGlowTexture, createRandom, hexToRgb, makeRingTexture, makeRockTexture } from '@/utils/textures'
import * as THREE from 'three'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('textures utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('createRandom is deterministic', () => {
    const randA = createRandom(7)
    const randB = createRandom(7)
    expect(randA()).toBe(randB())
    expect(randA()).toBe(randB())

    const randC = createRandom(-5)
    expect(randC()).toBeTypeOf('number')
  })

  it('converts hex to rgb', () => {
    expect(hexToRgb('#ff8800')).toEqual({ r: 255, g: 136, b: 0 })
  })

  it('creates textures even when no 2d context exists', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
    expect(makeRingTexture('#ffffff')).toBeInstanceOf(THREE.CanvasTexture)
    expect(makeRockTexture('#ffffff')).toBeInstanceOf(THREE.CanvasTexture)
    expect(createCloudTexture(1, '#ffffff')).toBeInstanceOf(THREE.CanvasTexture)
    expect(createGlowTexture(1, '#ffffff')).toBeInstanceOf(THREE.CanvasTexture)
  })

  it('creates cloud and glow textures with needsUpdate enabled', () => {
    const cloud = createCloudTexture(3, '#88ccff')
    const glow = createGlowTexture(4, '#ffaa22')

    expect(cloud.version).toBeGreaterThan(0)
    expect(glow.version).toBeGreaterThan(0)
  })

  it('generates textures correctly when context is available', () => {
    const ring = makeRingTexture('#ffffff')
    const rock = makeRockTexture('#ffffff')
    
    expect(ring).toBeInstanceOf(THREE.CanvasTexture)
    expect(rock).toBeInstanceOf(THREE.CanvasTexture)
  })
})
