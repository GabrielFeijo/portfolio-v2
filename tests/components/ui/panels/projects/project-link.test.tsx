import { ProjectLink } from '@/components/ui/panels/projects/project-link'
import { render, screen } from '@testing-library/react'
import { ExternalLink } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'

describe('ProjectLink', () => {
  it('renders correctly with primary style', () => {
    const setCursorVariant = vi.fn()
    render(
      <ProjectLink
        href="https://test.com"
        icon={ExternalLink}
        label="Demo"
        primary
        setCursorVariant={setCursorVariant}
      />
    )
    const link = screen.getByRole('link', { name: /Demo/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('panel-cta')
  })

  it('renders correctly with secondary style', () => {
    render(
      <ProjectLink
        href="https://test.com"
        icon={ExternalLink}
        label="Code"
        setCursorVariant={vi.fn()}
      />
    )
    const link = screen.getByRole('link', { name: /Code/i })
    expect(link).toHaveClass('panel-cta-secondary')
  })
})
