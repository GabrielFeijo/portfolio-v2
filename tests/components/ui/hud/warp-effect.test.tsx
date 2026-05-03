import { WarpEffect } from '@/components/ui/hud/warp-effect'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let mockWarpActive = true
let mockWarpSetting = true

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector: any) => selector({
    warpActive: mockWarpActive,
    experienceSettings: { warpEffects: mockWarpSetting }
  }),
}))

describe('WarpEffect', () => {
  beforeEach(() => {
    mockWarpActive = true
    mockWarpSetting = true
  })

  it('renders canvas when active and setting enabled', () => {
    const { container } = render(<WarpEffect />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('does not render when warp is inactive', () => {
    mockWarpActive = false
    const { container } = render(<WarpEffect />)
    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeInTheDocument()
  })

  it('does not render when setting is disabled', () => {
    mockWarpSetting = false
    const { container } = render(<WarpEffect />)
    const canvas = container.querySelector('canvas')
    expect(canvas).not.toBeInTheDocument()
  })
})

