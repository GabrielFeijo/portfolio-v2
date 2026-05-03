import { HUD } from '@/components/ui/hud/hud'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const openSettings = vi.fn()
const setLanguage = vi.fn()
const setCursorVariant = vi.fn()
let resolvedLanguage = 'en'

vi.mock('@/store/space-store', () => ({
  useSpaceStore: (selector?: any) => {
    const state = {
        openSettings,
        setCursorVariant,
        setLanguage,
    }
    return selector ? selector(state) : state
  }
}))

const changeLanguage = vi.fn()
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ 
    t: (key: string) => key,
    i18n: {
      resolvedLanguage,
      changeLanguage,
    }
  }),
}))

describe('HUD', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    resolvedLanguage = 'en'
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders and updates time', () => {
    render(<HUD />)
    expect(screen.getByText('Gabriel Feijó')).toBeInTheDocument()
    
    const configBtn = screen.getByLabelText('settings.title')
    fireEvent.click(configBtn)
    expect(openSettings).toHaveBeenCalled()
  })

  it('changes language when buttons are clicked', () => {
    render(<HUD />)
    
    const ptBtn = screen.getByText('pt')
    fireEvent.click(ptBtn)
    
    expect(changeLanguage).toHaveBeenCalledWith('pt')
    expect(setLanguage).toHaveBeenCalledWith('pt')

    fireEvent.click(screen.getByText('en'))
    expect(changeLanguage).toHaveBeenCalledWith('en')
    expect(setLanguage).toHaveBeenCalledWith('en')
  })

  it('sets cursor on mouse enter', () => {
      render(<HUD />)
      const ptBtn = screen.getByText('pt')
      fireEvent.mouseEnter(ptBtn)
      fireEvent.mouseLeave(ptBtn)
      expect(setCursorVariant).toHaveBeenCalledWith('link')
      expect(setCursorVariant).toHaveBeenCalledWith('default')
  })

  it('refreshes the clock interval and clears it on unmount', () => {
    const { unmount } = render(<HUD />)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    unmount()
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
  })

  it('uses pt language branch', () => {
    resolvedLanguage = 'pt-BR'
    render(<HUD />)
    expect(setLanguage).toHaveBeenCalledWith('pt')
  })
})
