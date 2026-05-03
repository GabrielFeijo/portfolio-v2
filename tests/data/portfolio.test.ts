import { DEVELOPER, PANEL_IDS, PLANETS, PROJECT_CATEGORIES } from '@/data/portfolio'
import { describe, expect, it } from 'vitest'

describe('portfolio data', () => {
  it('contains all expected panel ids', () => {
    expect(PANEL_IDS).toEqual([
      'about',
      'skills',
      'projects',
      'experience',
      'accomplishments',
      'contact',
    ])
  })

  it('keeps planets aligned with panel ids', () => {
    expect(PLANETS.map((planet) => planet.id)).toEqual(PANEL_IDS)
  })

  it('has valid developer profile baseline', () => {
    expect(DEVELOPER.name.length).toBeGreaterThan(3)
    expect(DEVELOPER.age).toBeGreaterThanOrEqual(18)
    expect(DEVELOPER.github).toContain('github.com')
  })

  it('defines known project categories', () => {
    expect(PROJECT_CATEGORIES).toContain('Full Stack')
  })
})
