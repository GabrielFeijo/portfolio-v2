import { ExperiencePanel } from '@/components/ui/panels/experience-panel'
import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ 
    t: (key: string, options?: any) => {
      if (options?.returnObjects) return []
      return key
    }
  }),
}))

describe('ExperiencePanel', () => {
  it('renders correctly and toggles items', () => {
    render(<ExperiencePanel />)
    
    expect(screen.getByText('planets.experience.subtitle')).toBeInTheDocument()
    
    expect(screen.getByText('experience_items.cit.role')).toBeInTheDocument()
    
    const firstRole = screen.getByText('experience_items.cit.role')
    act(() => {
      firstRole.click()
    })
    
    const secondRole = screen.getByText('experience_items.loopert.role')
    act(() => {
      secondRole.click()
    })
    
    expect(screen.getByText('experience_items.loopert.description')).toBeInTheDocument()
  })
})
