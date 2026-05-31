import { LoadingScreen } from '@/components/ui/hud/loading-screen'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let mockPhases: string[] | null = ['PHASE 1', 'PHASE 2', 'FINAL']

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (key === 'loading.phases' && options?.returnObjects) {
        return mockPhases
      }
      return key
    },
  }),
}))

describe('LoadingScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockPhases = ['PHASE 1', 'PHASE 2', 'FINAL']
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('progresses through phases correctly', async () => {
    render(<LoadingScreen />)
    expect(screen.getByText('PHASE 1')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByText('FINAL')).toBeInTheDocument()
  })

  it('uses default phases if translation returns null', () => {
    mockPhases = null
    render(<LoadingScreen />)
    expect(screen.getByText(/INITIALIZING/)).toBeInTheDocument()
  })
})
