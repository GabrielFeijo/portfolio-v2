import { ProjectsPanel } from '@/components/ui/panels/projects-panel'
import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.returnObjects) return []
      return key
    },
  }),
}))

vi.mock('@/store/space-store', () => ({
  useSpaceStore: () => ({
    setCursorVariant: vi.fn(),
  }),
}))

describe('ProjectsPanel', () => {
  it('renders correctly and filters projects', () => {
    render(<ProjectsPanel />)

    expect(screen.getByText('planets.projects.subtitle')).toBeInTheDocument()

    const fullStackFilter = screen.getByText('projects.filters.full_stack')
    act(() => {
      fullStackFilter.click()
    })

    expect(screen.getByText('projects_items.arsenal_academy.name')).toBeInTheDocument()

    const projectCard = screen.getByText('projects_items.arsenal_academy.name')
    act(() => {
      projectCard.click()
    })

    expect(screen.getByText('projects_items.arsenal_academy.description')).toBeInTheDocument()

    act(() => {
      projectCard.click()
    })

    expect(screen.getByText('projects_items.arsenal_academy.description')).toBeInTheDocument()
  })
})
