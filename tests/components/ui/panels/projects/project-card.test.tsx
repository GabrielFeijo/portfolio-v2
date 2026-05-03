import { ProjectCard } from '@/components/ui/panels/projects/project-card'
import type { Project } from '@/data/portfolio'
import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

let returnTranslatedHighlights = true

const mockProject: Project = {
  id: 'proj-1',
  name: 'Project 1',
  description: 'Desc',
  tech: ['React'],
  category: 'Frontend',
  year: '2023',
  color: '#000000',
  highlights: ['H1'],
  live: 'https://live.com',
  github: 'https://github.com',
  image: 'img.png'
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ 
	    t: (key: string, options?: any) => {
	        if (key.includes('highlights') && options?.returnObjects) return returnTranslatedHighlights ? ['H1'] : undefined
	        return key
	    },
  }),
}))

describe('ProjectCard', () => {
  beforeEach(() => {
    returnTranslatedHighlights = true
  })
  it('renders correctly', () => {
    render(
      <ProjectCard 
        project={mockProject} 
        isSelected={false} 
        onToggle={vi.fn()} 
        setCursorVariant={vi.fn()} 
        transition={{ delay: 0 }} 
      />
    )
    expect(screen.getByText('projects_items.proj-1.name')).toBeInTheDocument()
    expect(screen.queryByText('common.highlights')).not.toBeInTheDocument()
  })

  it('renders expanded details when isSelected', () => {
    render(
      <ProjectCard 
        project={mockProject} 
        isSelected={true} 
        onToggle={vi.fn()} 
        setCursorVariant={vi.fn()} 
        transition={{ delay: 0 }} 
      />
    )
    expect(screen.getByText('common.highlights')).toBeInTheDocument()
    expect(screen.getByText('H1')).toBeInTheDocument()
    expect(screen.getByText('common.open_project')).toBeInTheDocument()
  })

	  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(
      <ProjectCard 
        project={mockProject} 
        isSelected={false} 
        onToggle={onToggle} 
        setCursorVariant={vi.fn()} 
        transition={{ delay: 0 }} 
      />
    )
    act(() => {
        screen.getByRole('article').click()
    })
    expect(onToggle).toHaveBeenCalled()
	  })

  it('falls back to project highlights when translations are unavailable', () => {
    returnTranslatedHighlights = false

    render(
      <ProjectCard
        project={mockProject}
        isSelected={true}
        onToggle={vi.fn()}
        setCursorVariant={vi.fn()}
        transition={{ delay: 0 }}
      />
    )

    expect(screen.getByText('H1')).toBeInTheDocument()
  })
	})
